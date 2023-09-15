class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };
        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        this.toggleState(chatBox);
        this.sendInitialGreeting(chatBox);

        openButton.addEventListener('click', () => {
            this.toggleState(chatBox);
            this.sendInitialGreeting(chatBox);
        });

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });
    }
    toggleState(chatbox) {
        this.state = !this.state;
    
        if (this.state) {
            //const audio = new Audio('pop.mp3');
            //console.log('Audio object:', audio); 
            //audio.play();
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.play();
            console.log('Audio play method called'); 
            chatbox.classList.add('chatbox--active');
            this.displayPredefinedQuestions(chatbox);
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }
    
    sendInitialGreeting(chatbox) {
        const greeting = "Hi! How can I assist you today?";
        const greetingMessage = { name: 'Sam', message: greeting };
        this.messages.push(greetingMessage);
        this.updateChatText(chatbox);
        this.displayPredefinedQuestions(chatbox);
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === '') {
            return;
        }

        const normalizedMessage = text1.toLowerCase();

        if (normalizedMessage.includes('do you need more help')) {
            const followUpMessage = "I'm here to help. What else can I assist you with?";
            let msg4 = { name: 'Sam', message: followUpMessage };
            this.messages.push(msg4);
            this.updateChatText(chatbox);
            textField.value = '';
            return;
        }

        this.messages.push({ name: 'User', message: text1 });

        const greetings = ['hello', 'hi', 'good morning', 'good afternoon', 'good evening'];
        if (greetings.some(greeting => normalizedMessage.includes(greeting))) {
            let greetingResponse = "Hello! How can I assist you today?";
            if (normalizedMessage.includes('hi')) {
                greetingResponse = "Hi! How can I assist you today?";
            } else if (normalizedMessage.includes('good morning')) {
                greetingResponse = "Good morning! How can I assist you?";
            } else if (normalizedMessage.includes('good afternoon')) {
                greetingResponse = "Good afternoon! How can I assist you?";
            } else if (normalizedMessage.includes('good evening')) {
                greetingResponse = "Good evening! How can I assist you?";
            }

            let msg2 = { name: 'Sam', message: greetingResponse };
            this.messages.push(msg2);
        } else {
            // Replace this with your actual API call code
            fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: JSON.stringify({ message: text1 }),
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(r => r.json())
                .then(r => {
                    let msg3 = { name: 'Sam', message: r.answer };
                    this.messages.push(msg3);

                    const needHelpQuestion = "Do you need any more help? Type Below...";
                    let msg5 = { name: 'Sam', message: needHelpQuestion };
                    this.messages.push(msg5);

                    this.updateChatText(chatbox);
                    textField.value = '';
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.updateChatText(chatbox);
                    textField.value = '';
                });
        }

        this.updateChatText(chatbox);
        textField.value = '';
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === 'Sam') {
                html +=
                    '<div class="messages__item messages__item--visitor">' +
                    item.message +
                    '</div>';
            } else {
                html +=
                    '<div class="messages__item messages__item--operator">' +
                    item.message +
                    '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

    displayPredefinedQuestions(chatbox) {
        const chatMessages = chatbox.querySelector('.chatbox__messages');

        const predefinedQuestions = [
            'Is there a maximum limit on topUp?',
            'My Transaction is still pending!',
            'My card has been blocked?',
            // Add more questions as needed
        ];

        const buttonsHtml = predefinedQuestions
            .map(
                question =>
                    `<div class="predefined-question">${question}</div>`
            )
            .join('');

        chatMessages.insertAdjacentHTML('beforeend', buttonsHtml);

        const predefinedButtons = chatMessages.querySelectorAll('.predefined-question');
        predefinedButtons.forEach(button => {
            button.addEventListener('click', () => {
                const node = chatbox.querySelector('input');
                node.value = button.textContent;
                this.onSendButton(chatbox);
            });
        });

        const needHelpButton = document.createElement('div');
        needHelpButton.className = 'predefined-question';
        needHelpButton.textContent = "What are the Current exchange Rates?";
        needHelpButton.addEventListener('click', () => {
            window.location.href = 'https://www.oanda.com/currency-converter/en/'; 

        });
        chatMessages.appendChild(needHelpButton);
    }
}

const chatbox = new Chatbox();
chatbox.display();
import pandas as pd
import random

from nltk_utils import tokenize
import keras


data = pd.read_csv('Responses_MarkovML.csv')
df = data.values.tolist()


model = keras.models.load_model('simple_nn.h5')


bot_name = "Sam"

def get_response(msg):
    sentence = tokenize(msg)
    prediction = model.predict(sentence)

    # print(sentence.shape)
    # print(prediction)
    label = prediction.argmax()
    # print(label)
    # print(prediction.shape)
    res = df[label][random.randint(1,4)]
    
    return res


if __name__ == "__main__":
    print("Let's chat! (type 'quit' to exit)")
    while True:
        # sentence = "do you use credit cards?"
        sentence = input("You: ")
        if sentence == "quit":
            break

        resp = get_response(sentence)
        print(resp)
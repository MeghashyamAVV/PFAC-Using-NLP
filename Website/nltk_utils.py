import nltk
from nltk.corpus import stopwords
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pandas as pd

stop_words = stopwords.words('english')
stop_words.remove('not')
stop_words.remove('don')
stop_words.remove("don't")
stop_words.remove('couldn')
stop_words.remove("couldn't")
stop_words.remove("didn")
stop_words.remove("didn't")
stop_words.remove("hadn")
stop_words.remove("hadn't")
stop_words.remove("hasn")
stop_words.remove("hasn't")
stop_words.remove("haven")
stop_words.remove("haven't")
stop_words.remove("isn")
stop_words.remove("isn't")
stop_words.remove("mustn")
stop_words.remove("mustn't")
stop_words.remove("wasn")
stop_words.remove("wasn't")
stop_words.remove("weren")
stop_words.remove("weren't")
stop_words.remove("wouldn")
stop_words.remove("wouldn't")

df_train = pd.read_csv('Train.csv')
df_val = pd.read_csv('Val.csv')
df_test = pd.read_csv('Test.csv')
all_sentences = df_train['text'].tolist() + df_val['text'].tolist()

tokenizer = Tokenizer()
tokenizer.fit_on_texts(all_sentences)

train_sequences = tokenizer.texts_to_sequences(df_train['text'].tolist())
val_sequences = tokenizer.texts_to_sequences(df_val['text'].tolist())
test_sequences = tokenizer.texts_to_sequences(df_test['text'].tolist())

vocab_size = len(tokenizer.word_index) + 1
max_sequence_length = max([len(seq) for seq in train_sequences + val_sequences])

def tokenize(sentence):
    processed_words = []
    for word in sentence.split():
        if word.lower() not in stop_words:
            processed_words.append(word.lower())
    
    processed_sentence = ' '.join(processed_words)

    seq = []
    seq.append(processed_sentence)

    sequence = tokenizer.texts_to_sequences(seq)

    padded_seq = pad_sequences(sequence, maxlen=max_sequence_length, padding='post')

    return padded_seq

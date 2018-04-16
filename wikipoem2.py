'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
# import csv
# import re

# from pattern.web import URL, DOM, Wikia
from pattern.web import Wikia
from flask import Flask, render_template, request, flash, session
from flask.ext.session import Session


def create_poem(inputwoord):
    w = Wikia(domain=inputwoord)
    wordlist = []
    wordlist1 = []

    print "start"
    while len(wordlist) < 10:
        for j in range(45):
            for i, title in enumerate(w.index(start='a', throttle=1.0, cached=True)):
                if i >= 3:
                    break
                article = w.search(title)
                words = repr(article.title).split()
                for word in words:
                    wordlist1.append(word.strip("u'"))
                for word in wordlist1:
                    if not word[0].isupper() and word.isalpha():
                        wordlist.append(word)

    for word in wordlist:
        print word

    return wordlist


sess = Session()
app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        word_input = request.form['firstname']
        print word_input
        wordlist = create_poem(word_input)
        return render_template('wikipoem.html', rows=wordlist)
    else:
        return render_template('wikipoem.html')


@app.route("/wikipiep")
def wikipiep():
    request
    rows = wordlist

    return render_template("history.html", wordlist=rows)


if __name__ == '__main__':
    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'

    sess.init_app(app)
    app.run(debug=True)


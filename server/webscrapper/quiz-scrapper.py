import requests
from bs4 import BeautifulSoup
from lxml import etree
import pymongo
import time

conn_url = "mongodb+srv://webrootpj:GxzYuigHkkmslB7v@mongo-webproject.gqoqzuw.mongodb.net/webrot?retryWrites=true&w=majority"
try: 
    client = pymongo.MongoClient(conn_url)
except Exception:
    print("Error: " + Exception)

database = client["webrot"]
colletion = database["questions"]

def get_question_content(url):
    response = requests.get(url)
    content = response.content
    soup = BeautifulSoup(content, "html.parser")
    
    dom = etree.HTML(str(soup))

    # Titlul intrebarii
    question_title = dom.xpath('//h4[@class="question-title"]')[0].text
    print(question_title)

    # Imaginea intrebarii
    url_imagine = dom.xpath('//img[@class="img-responsive center-block border-img"]/@src')
    if len(url_imagine) > 0:
        url_imagine = url_imagine[0]
        print("Imagine: " + url_imagine)
    else:
        url_imagine = "none"
        print("Intrebarea nu are imagine!")

    # Iteram prin intrebari
    incorrect_question_collection = [] # se adauga in DB acest array
    incorrect_questions = dom.xpath('//div[@data-correct="0"]')
    for question in incorrect_questions:
        question_text = etree.tostring(question, method='text', encoding='unicode')
        incorrect_question_collection.append(question_text.strip()[2:-1])
    
    print(incorrect_question_collection)

    correct_quesiton_collection = [] # se adauga in DB acest array
    correct_questions = dom.xpath('//div[@data-correct="1"]')
    for question in correct_questions:
        question_text = etree.tostring(question, method='text', encoding='unicode')
        correct_quesiton_collection.append(question_text.strip()[2:-1])

    print(correct_quesiton_collection)

    print("Done with scrapping -> !")

    newQuestion = {
        "question": question_title,
        "image_url": url_imagine,
        "incorrectQ": incorrect_question_collection,
        "correctQ": correct_quesiton_collection
    }

    # inseram in baza de date
    res = colletion.insert_one(newQuestion)

    print(res.inserted_id)

    xpath_next_question = '//a[@class="btn btn-block btn-lg btn-primary next_url"]/@href'
    next_question = dom.xpath(xpath_next_question)
    
    if len(next_question)>0:
        time.sleep(0.1)
        return next_question[0]
    else:
        return


needContinue = get_question_content("https://www.scoalarutiera.ro/intrebari-posibile-drpciv-categoria-b/1151/ce-indica-semnalul-agentului-de-circulatie")
while len(needContinue) > 0:
    needContinue = get_question_content(needContinue)

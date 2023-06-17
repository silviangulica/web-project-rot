import requests
from bs4 import BeautifulSoup
from lxml import etree
import time
import pymongo

conn_url = "mongodb+srv://webrootpj:GxzYuigHkkmslB7v@mongo-webproject.gqoqzuw.mongodb.net/webrot?retryWrites=true&w=majority"
try: 
    client = pymongo.MongoClient(conn_url)
except Exception:
    print("Error: " + Exception)

database = client["webrot"]
colletion = database["lessons"]

def generate_lesson_from_url(url):
    response = requests.get(url)
    content = response.content
    soup = BeautifulSoup(content, "html.parser")
    
    dom = etree.HTML(str(soup))

    # Titlu lectie
    lesson_title = dom.xpath('/html/body/div[1]/div/div/div/div[2]/div/div[1]/h3/span/strong')
    print(lesson_title[0].text)

generate_lesson_from_url("https://www.scoalarutiera.ro/indicatoare-si-marcaje/indicatoare-de-avertizare/curba-la-stanga/5")
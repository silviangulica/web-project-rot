import requests
from bs4 import BeautifulSoup
import urllib
import re
import os
import time



# 1. Obține conținutul paginii web
url = "https://www.scoalarutiera.ro/indicatoare-si-marcaje/indicatoare-de-avertizare/curba-la-stanga/5"  # înlocuiește cu URL-ul paginii pe care dorești să o scrapperi
response = requests.get(url)
content = response.content

# 2. Parsarea continutului paginii web
soup = BeautifulSoup(content, "html.parser")
images = soup.find_all("img")
buttons = soup.find_all("a", {"class": "btn btn-ar btn-warning pull-right"})
contents = soup.find_all("div", {"class": "col-md-8 col-md-pull-4"})
titles = soup.find_all("h3", {"class": "panel-title text-center"})


    

# 4. Creeam o functie care ne returneaza continutul paginii web si il punem intr-un fisier text
def get_content(contents, images, titles, lesson_index):
    imagename = "content.txt"
    actual_image = ""
    lesson_content = ""


    for image in images:
        imagename = image["src"].split("/")[-1]
        # Verificăm dacă numele imaginii este unul din "logo.png" sau "logo2.png"
        if imagename in ["logo.png", "logo-dark.png", "google-play-badge.png", "Download_on_the_App_Store_Badge_RO_RGB_wht_100317.png", "Badge-Black.huawei.png"]:
            continue
        print("Downloading image: {}".format(imagename))
        response = requests.get(image["src"])
        image_path = os.path.join(os.path.dirname(__file__), imagename)
        with open(image_path, "wb") as f:
            f.write(response.content)
        actual_image = imagename

    # for image in images:
    #     imagename = image["src"].split("/")[-1]
    #     # Verificam daca numele imaginii este unul din "logo.png" sau "logo2.png"
    #     if imagename == "logo.png" or imagename == "logo-dark.png" or imagename == "google-play-badge.png" or imagename == "Download_on_the_App_Store_Badge_RO_RGB_wht_100317.png" or imagename == "Badge-Black.huawei.png":
    #         continue
    #     print("Downloading image: {}".format(imagename))
    #     urllib.request.urlretrieve(image["src"].encode("utf-8").decode("utf-8"), imagename)

    #     actual_image = imagename
    print("[Scrapper]: Done downloading images!")

    for content in contents:
        h6 = content.find_all("h6")
        for h in h6:
            h.extract()
        lesson_content += content.text

    denumire = ""
    for title in titles:
        denumire = title.text
        break

    prev_lesson = "lesson{}.html".format(lesson_index - 1)
    next_lesson = "lesson{}.html".format(lesson_index + 1)

    html_string = '''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lectie</title>
    <link rel="stylesheet" href="lesson.css" />
    <script src="lesson.js" defer></script>
    <link rel="icon" href="../img/nobg-icon.png" />
  </head>

  <body>
    <header class="hero">
      <nav class="nav">
        <div class="nav__logo">RoT</div>
        <ul class="nav__list">
          <li class="nav__list-item">
            <a href="../dashboard/dashboard.html" class="anchor--not-selected"
              >Profil</a
            >
          </li>
          <li class="nav__list-item">
            <a href="../quizzes/quiz.html" class="anchor--not-selected"
              >Teste</a
            >
          </li>
          <li class="nav__list-item">
            <a href="../lessons/lessons.html" class="anchor--not-selected"
              >Lecții</a
            >
          </li>
        </ul>
      </nav>
      <div class="hero__display"></div>
    </header>

    <main>
      <div class="lesson">
        <div class="lesson__title">{}</div>
        <div class="lesson__content">
          <div class="lesson__content-text">
            {}
          </div>
          <div class="lesson__image">
            <img src="../server/webscrapper/{}" alt="doesn exist" class="lesson__image--visible" />
          </div>
        </div>
        <div class="lesson__panel">
          <div class="lesson__panel-prev-lesson">
            <a href="{}">Previous Lesson</a>
          </div>
          <div class="lesson__panel-next-lesson">
            <a href="{}">Next Lesson</a>
          </div>
        </div>
      </div>
    </main>
  </body>
</html>'''.format(denumire, lesson_content, actual_image, prev_lesson, next_lesson)
    

    denumire_fisier = "../../lesson/lesson{}.html".format(lesson_index)
    with open(denumire_fisier, "w") as file:
        file.write(html_string)
    print("[Scrapper]: Done writing to file!")





# Creeam o functie care sa verifice daca exista href, si sa-l parcurga
def get_href(buttons, lesson_index):
    for button in buttons:
        if button.has_attr("href"):
            url = button["href"]
            print(url)
            response = requests.get(url)
            content = response.content
            soup = BeautifulSoup(content, "html.parser")
            images = soup.find_all("img")
            buttons = soup.find_all("a", {"class": "btn btn-ar btn-warning pull-right"})
            contents = soup.find_all("div", {"class": "col-md-8 col-md-pull-4"})
            titles = soup.find_all("h3", {"class": "panel-title text-center"})
            get_content(contents, images, titles, lesson_index)
            lesson_index += 1
            time.sleep(0.5)
            get_href(buttons, lesson_index)
            break
        else:
            return

get_content(contents, images, titles, 1)
get_href(buttons, 2)
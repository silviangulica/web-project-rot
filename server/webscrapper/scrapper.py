import requests
from bs4 import BeautifulSoup
import urllib



# 1. Obține conținutul paginii web
url = "https://www.scoalarutiera.ro/indicatoare-si-marcaje/indicatoare-de-avertizare/curba-la-stanga/5"  # înlocuiește cu URL-ul paginii pe care dorești să o scrapperi
response = requests.get(url)
content = response.content

# 2. Parsarea continutului paginii web
soup = BeautifulSoup(content, "html.parser")
images = soup.find_all("img")
buttons = soup.find_all("a", {"class": "btn btn-ar btn-warning pull-right"})
contents = soup.find_all("div", {"class": "col-md-8 col-md-pull-4"})




# 3. Creeam o functie care sa ne descarce toate imaginile din "images"
def download_images(images):
    for image in images:
        filename = image["src"].split("/")[-1]
        # Verificam daca numele imaginii este unul din "logo.png" sau "logo2.png"
        if filename == "logo.png" or filename == "logo-dark.png" or filename == "google-play-badge.png" or filename == "Download_on_the_App_Store_Badge_RO_RGB_wht_100317.png" or filename == "Badge-Black.huawei.png":
            continue
        print("Downloading image: {}".format(filename))
        urllib.request.urlretrieve(image["src"], filename)
    print("Done!")

# 4. Creeam o functie care ne returneaza continutul paginii web si il punem intr-un fisier text
def get_content(contents):
    for content in contents:
        h6 = content.find_all("h6")

        for h in h6:
            h.extract()

        # Trebuie acum sa copiem un fisier html local si sa ii modificam textul cu cel din pagina web
        
        
       
    print("Done!")





# apelam functia
download_images(images)
get_content(contents)
import speech_recognition as sr
import requests

def reconnaissance_vocale():
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()

    with microphone as source:
        print("Dites quelque chose...")
        recognizer.adjust_for_ambient_noise(source) 
        audio = recognizer.listen(source)

    try:
        texte_dicté = recognizer.recognize_google(audio, language="fr-FR")
        print(f"Vous avez dit : {texte_dicté}")
        return texte_dicté
    except sr.UnknownValueError:
        print("Désolé, je n'ai pas pu comprendre votre discours.")
        return None
    except sr.RequestError:
        print("Erreur de service de reconnaissance vocale.")
        return None

def recherche_api(query):
    url = f"https://exemple-api.com/recherche?q={query}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        results = response.json()
        print("Résultats de la recherche:")
        print(results)
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'appel API : {e}")

def main():
    texte_dicté = reconnaissance_vocale()
    if texte_dicté:
        recherche_api(texte_dicté)

if __name__ == "__main__":
    main()

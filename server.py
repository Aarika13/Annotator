from flask import Flask, request
from PIL import Image
import pytesseract

app = Flask(__name__)

@app.route('/extract', methods=['POST'])
def extract_text():
    file = request.files['image']
    image = Image.open(file.stream)
    text = pytesseract.image_to_string(image)
    return text

if __name__ == '__main__':
    app.run()

from io import BytesIO
from flask import Flask
from flask import render_template,request,jsonify
import pytesseract
from PIL import Image
import base64
from pymongo import MongoClient
# import gradio as gr

app = Flask(__name__)
client = MongoClient('mongodb://localhost:27017')
db = client['annotator']
collection = db['annotate']

@app.route('/')
def home():
    # return "Hello World"
    return render_template('index.html')

# @app.route('/label', methods=['POST'])
# def label():
#     image_data = request.files['image']
#     image = gr.Image(image_data)
#     # Define the labeler function
#     def label_image(input_image):
#         # Implement your labeling logic here
#         # Return the labeled data
#         return {
#             'label': 'Example Label',
#             'confidence': 0.9
#         }
#     iface = gr.Interface(fn=label_image, inputs=image, outputs="json")
#     return iface.process()

@app.route('/upload', methods=['GET','POST'])
def upload():
    image_file = request.files['image']
    image_filename = image_file.filename
    image_path = f'static/uploads/{image_filename}'
    image_file.save(image_path)
    # return render_template('label.html')
    return render_template('label_2.html', image_path=image_path)

@app.route('/extract', methods=['GET','POST'])
def extract_labels():
    file = request.files['image']
    image = Image.open(file.stream)
    labels = {
        'invoice':"",
        'date': "",
        'description': "",
        'tax': "",
        'tax_type': '',
        'amount': ""
    }

    # Perform OCR to extract the text from the image
    text = pytesseract.image_to_string(image)

    # Find the labels and their corresponding values
    for label in labels:
        label_index = text.find(label)
        if label_index != -1:
            # Extract the value following the label
            value = text[label_index + len(label):].strip()
            # Store the value in the labels dictionary
            labels[label] = value

    return jsonify(labels)
# def extract_fields():
#     image_data = request.json['image_data']
#     field = request.json['field']
#     # Convert the data URL to PIL Image
#     image = Image.open(BytesIO(base64.b64decode(image_data.split(',')[1])))

#     # Perform OCR using Pytesseract
#     extracted_data = {
#         'invoice_number': pytesseract.image_to_string(image),
#         'date': "",
#         'description': "",
#         'tax': "",
#         'tax_type': '',
#         'amount': ''
#     }
#     response = {field : extracted_data}
#     return jsonify(response)
    # return render_template('output.html',data = extracted_data)
    # return jsonify(extracted_data)

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5050, debug=True)

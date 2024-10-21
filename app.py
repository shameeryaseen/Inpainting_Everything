from flask import Flask, request, jsonify
from flask_cors import CORS
import inpainting_modules  # Import the inpainting module

app = Flask(__name__)
CORS(app)

@app.route('/inpaint', methods=['POST'])
def inpaint():
    data = request.json
    image = data['image']
    mask = data['mask']
    result = inpainting_modules.inpaint_image(image, mask)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

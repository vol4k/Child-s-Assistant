import os
from flask import jsonify, request, request, jsonify, send_file, Blueprint
from app import store, router

# Image Routes

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@router.route('/media', methods=['POST'])
def upload_media():
    try:
        if 'media' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['media']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file and allowed_file(file.filename):
            return store.upload_image(file)

        return jsonify({'error': 'Invalid file type'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@router.route('/media/<uuid>', methods=['DELETE'])
def delete_media(uuid):
    try:
        result = store.delete_image(uuid)
        if result:
            return jsonify({'message': 'Image deleted successfully'}), 200
        else:
            return jsonify({'error': 'Image not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@router.route('/media/<uuid>', methods=['GET'])
def get_media(uuid):
    try:
        file_path = store.get_image(uuid)

        if not file_path or not os.path.isfile(file_path):
            return jsonify({'error': 'File not found'}), 404

        return send_file(file_path)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

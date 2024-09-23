from flask import jsonify, request, request, jsonify
from app import store, router

# Child Profile Routes


@router.route('/child-profile/all', methods=['GET'])
def get_children():
    try:
        return store.get_children()
    except:
        return jsonify({"error": "Failed to retrieve child profiles"}), 500


@router.route('/child-profile/get', methods=['POST'])
def get_child_profile():
    data = request.json
    uuid = data.get('uuid')
    return store.get_child_profile(uuid)


@router.route('/child-profile', methods=['POST'])
def add_or_update_child_profile():
    data = request.json
    uuid = data.get('uuid')
    name = data.get('name')
    birthday = data.get('birthday')
    sex = data.get('sex')
    image_uuid = data.get('image_uuid')
    store.add_or_update_child_profile(
        uuid,
        name,
        birthday,
        sex,
        image_uuid
    )
    return jsonify({'status': 'success'})


@router.route('/child-profile', methods=['DELETE'])
def delete_child_profile():
    data = request.json
    uuid = data.get('uuid')
    if store.delete_child_profile(uuid):
        return jsonify({'status': True})
    return jsonify({'status': False}), 401


@router.route('/child-profile/statistic', methods=['POST'])
def get_statistic():
    try:
        data = request.json
        today = data.get('today')
        uuid = data.get('uuid')
        jsonify(data)
        return store.get_statistic(today, uuid)
    except:
        return jsonify({"error": "Failed to retrieve child profile statistic"}), 500

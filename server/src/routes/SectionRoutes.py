from flask import jsonify, request, request, jsonify
from app import store, router

# Section Routes


@router.route('/section/all', methods=['GET'])
def get_sections():
    try:
        return store.get_sections()
    except:
        return jsonify({"error": "Failed to retrieve sections"}), 500


@router.route('/section/get', methods=['POST'])
def get_section():
    try:
        data = request.json
        uuid = data.get('uuid')
        return store.get_section(uuid)
    except:
        return jsonify({"error": "Failed to retrieve section"}), 500


@router.route('/section', methods=['POST'])
def add_or_update_section():
    data = request.json
    uuid = data.get('uuid')
    title = data.get('title')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    store.add_or_update_section(
        uuid,
        title,
        start_time,
        end_time,
    )
    return jsonify({'status': 'success'})


@router.route('/section', methods=['DELETE'])
def delete_section():
    data = request.json
    uuid = data.get('uuid')
    return jsonify({'stauts': store.delete_section(uuid)})

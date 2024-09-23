from flask import jsonify, request, request, jsonify
from app import store, router

# Task Routes


@router.route('/task/all', methods=['POST'])
def get_all_tasks():
    try:
        data = request.json
        profile_uuid = data.get('profile_uuid')
        section_uuids = data.get('section_uuids')
        start_date = data.get('start_date')
        tasks_type = data.get('tasks_type')
        return store.get_tasks_with_filters(
            profile_uuid,
            section_uuids,
            start_date,
            tasks_type
        )
    except:
        return jsonify({"error": "Failed to retrieve tasks"}), 500

@router.route('/task/get', methods=['POST'])
def get_task():
    try:
        data = request.json
        uuid = data.get('uuid')
        return jsonify(store.get_task(uuid))
    except:
        return jsonify({"error": "Failed to retrieve task"}), 500


@router.route('/task', methods=['POST'])
def add_or_update_task():
    try:
        data = request.json
        uuid = data.get('uuid')
        title = data.get('title')
        section_uuid = data.get('section_uuid')
        revard = data.get('revard')
        repeat = data.get('repeat')
        start_date = data.get('start_date')
        image_uuid = data.get('image_uuid')
        desctiption = data.get('description')
        child_uuids = data.get('child_uuids')
        return store.add_or_update_task(
            uuid,
            title,
            section_uuid,
            revard,
            repeat,
            start_date,
            image_uuid,
            desctiption,
            child_uuids
        )
    except:
        return jsonify({"error": "Failed to retrieve task"}), 500


@router.route('/task', methods=['DELETE'])
def delete_task():
    try:
        data = request.json
        uuid = data.get('uuid')
        return jsonify({'status': store.delete_task(uuid)})
    except:
        return jsonify({"error": "Failed to retrieve task"}), 500

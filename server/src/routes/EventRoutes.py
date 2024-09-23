from flask import jsonify, request, request, jsonify
from app import store, router

# Event Routes


@router.route('/event/all', methods=['POST'])
def get_all_events():
    try:
        data = request.json
        child_profile_uuid = data.get('child_profile_uuid')
        date = data.get('date')
        return store.get_events_with_filters(
            child_profile_uuid,
            date,
        )
    except:
        return jsonify({"error": "Failed to retrieve events"}), 500


@router.route('/event/get', methods=['POST'])
def get_event():
    try:
        data = request.json
        uuid = data.get('uuid')
        return store.get_event(uuid)
    except:
        return jsonify({"error": "Failed to retrieve event"}), 500


@router.route('/event/by_keys', methods=['POST'])
def event_by_keys():
    try:
        data = request.json
        child_profile_uuid = data.get('child_profile_uuid')
        task_uuid = data.get('task_uuid')

        return store.event_by_keys(child_profile_uuid, task_uuid)
    except:
        return jsonify({"error": "Failed to retrieve event"}), 500


@router.route('/event', methods=['DELETE'])
def delete_event():
    try:
        data = request.json
        uuid = data.get('uuid')
        return jsonify({'status': store.delete_event(uuid)})
    except:
        return jsonify({"error": "Failed to retrieve event"}), 500


@router.route('/event', methods=['POST'])
def add_or_update_event():
    try:
        data = request.json
        uuid = data.get('uuid')
        child_profile_uuid = data.get('child_profile_uuid')
        task_uuid = data.get('task_uuid')
        date = data.get('date')
        return store.add_or_update_event(
            uuid,
            child_profile_uuid,
            task_uuid,
            date
        )
    except:
        return jsonify({"error": "Failed to retrieve event"}), 500


@router.route('/event/tasks', methods=['POST'])
def get_event_tasks():
    try:
        data = request.json
        uuids = data.get('uuids')
        return store.get_event_tasks(uuids)
    except:
        return jsonify({"error": "Failed to retrieve events"}), 500

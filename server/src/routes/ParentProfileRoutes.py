
from flask import jsonify, request
from app import store, router

# Parent Profile Routes


@ router.route('/parent-profile/exist', methods=['GET'])
def check_if_any_record_exist():
    exists = store.has_any_record()
    return jsonify({'exists': exists})


@ router.route('/parent-profile/update', methods=['POST'])
def update_password_and_security_question():
    data = request.json
    password = data.get('password')
    sec_q = data.get('sec_q')
    sec_a = data.get('sec_a')
    auto_delete = data.get('auto_delete')
    week_start = data.get('week_start')
    store.add_or_update_credentials(
        password, sec_q, sec_a, auto_delete, week_start)
    return jsonify({'status': 'success'})


@ router.route('/parent-profile/password', methods=['POST'])
def update_password():
    data = request.json
    password = data.get('password')
    store.update_password(password)
    return jsonify({'status': 'success'})


@ router.route('/parent-profile/auto_delete', methods=['POST'])
def update_auto_delete():
    data = request.json
    auto_delete = data.get('auto_delete')
    store.update_auto_delete(auto_delete)
    return jsonify({'status': 'success'})


@ router.route('/parent-profile/week', methods=['POST'])
def update_week_start():
    data = request.json
    week_start = data.get('week_start')
    store.update_week_start(week_start)
    return jsonify({"status": "success"})


@ router.route('/parent-profile/security', methods=['POST'])
def update_security_question():
    data = request.json
    sec_q = data.get('sec_q')
    sec_a = data.get('sec_a')
    store.update_security_question(sec_q, sec_a)
    return jsonify({'status': 'success'})


@ router.route('/parent-profile/security', methods=['GET'])
def get_secret():
    return store.get_secret()


@ router.route('/parent-profile/auto_delete', methods=['GET'])
def get_auto_delete():
    return store.get_auto_delete()


@ router.route('/parent-profile/week', methods=['GET'])
def get_week_start():
    return jsonify(store.get_week_start())


@ router.route('/parent-profile/security/question', methods=['GET'])
def get_sequrity_question():
    question = store.get_sequrity_question()
    return jsonify({'question': question})


@ router.route('/parent-profile/password/check', methods=['POST'])
def check_password():
    data = request.json
    provided_password = data.get('password')
    if store.check_password(provided_password):
        return jsonify({'status': True})
    return jsonify({'status': False}), 401


@ router.route('/parent-profile/security/check', methods=['POST'])
def check_security_answer():
    data = request.json
    sec_a = data.get('sec_a')
    if store.check_security_answer(sec_a):
        return jsonify({'status': True})
    return jsonify({'status': False}), 401
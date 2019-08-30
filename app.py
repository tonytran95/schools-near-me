from flask import Flask, render_template, request, jsonify
from flask_paginate import Pagination, get_page_args
from flask_talisman import Talisman
from mongoengine import connect
from models import School
from dotenv import load_dotenv
import os

app = Flask(__name__)
talisman = Talisman(app, content_security_policy=None)

load_dotenv()
API_KEY = os.environ.get('API_KEY')
DATABASE_HOST = os.environ.get('DATABASE_HOST')
connect(host=DATABASE_HOST)


@app.route("/")
def index():
    return render_template('index.html', api_key=API_KEY)


@app.route('/schools/<string:level>')
def school_list(level):
    search = False
    temp_level = level
    if level == 'special':
        temp_level = 'specific'
    query = request.args.get('query')
    if query:
        search = True
        schools = School.objects(level__icontains=temp_level, name__icontains=query)
    else:
        schools = School.objects(level__icontains=temp_level)
    schools = schools.order_by('-enrolments')
    page, per_page, offset = get_page_args()
    per_page *= 5
    offset *= 5
    pagination_schools = schools[offset: offset + per_page]
    pagination = Pagination(page=page, per_page=per_page, total=schools.count(), record_name="schools",
                            css_framework="bootstrap4", alignment="center", search=search, found=schools.count())
    return render_template("school_list.html", schools=pagination_schools, level=level, pagination=pagination)


@app.route('/schools/<int:code>')
def school_page(code):
    school = School.objects.get(code=code)
    return render_template("school_profile.html", school=school, api_key=API_KEY)


@app.route('/api/schools', methods=['GET'])
def get_schools():
    pipeline = [
        {
            '$geoNear': {
                'near': {
                    'type': 'Point',
                    'coordinates': []
                },
                'spherical': True,
                'distanceField': "distance",
                'limit': 2207
            }
        },
        {
            '$match': {}
        }
    ]
    for arg in request.args:
        param = request.args.get(arg)
        if arg == 'longitude' or arg == 'latitude':
            pipeline[0]['$geoNear']['near']['coordinates'].append(float(param))
        elif arg == 'distance':
            pipeline[0]['$geoNear']['maxDistance'] = int(param)
        elif arg == 'level' or arg == 'gender' or arg == 'selective' or arg == 'support_classes':
            pipeline[1]['$match'][arg] = param
        elif arg == 'enrolments' or arg == 'train_duration':
            pipeline[1]['$match'][arg] = {'$lte': int(param)}
        else:
            pipeline[1]['$match'][arg] = True

    schools = School.objects.aggregate(*pipeline)
    response = []
    for school in schools:
        school_dict_item = {
            'code': school['_id'],
            'name': school['name'],
            'longitude': school['location']['coordinates'][0],
            'latitude': school['location']['coordinates'][1],
            'distance': school['distance'],
            'street': school['street'],
            'suburb': school['suburb'],
            'postcode': school['postcode'],
            'logo': school['logo']
        }
        response.append(school_dict_item)
    return jsonify(response)


if __name__ == '__main__':
    app.run()

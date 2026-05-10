from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import re
from models import db, User, Trip, Itinerary, Activity, Destination, PublicShare, TripNote, SavedDestination
from functools import wraps
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///traveloop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Import models after db initialization
from models import User, Trip, Itinerary, Activity, Destination, PackingItem, ActivityTemplate

@app.route('/')
def index():
    return send_from_directory('../', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../', path)

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Username, email, and password are required'}), 400
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Missing email or password'}), 400
        
        user = User.query.filter(
            (User.email == data['email']) | (User.username == data['email'])
        ).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User Routes
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            # Check if email is already taken by another user
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'error': 'Email already taken'}), 409
            user.email = data['email']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Trip Routes
@app.route('/api/trips', methods=['GET'])
@jwt_required()
def get_trips():
    try:
        user_id = get_jwt_identity()
        trips = Trip.query.filter_by(user_id=user_id).order_by(Trip.created_at.desc()).all()
        
        return jsonify([trip.to_dict() for trip in trips]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips', methods=['POST'])
@jwt_required()
def create_trip():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'destination', 'start_date', 'end_date', 'budget']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create new trip
        trip = Trip(
            user_id=user_id,
            name=data['name'],
            destination=data['destination'],
            description=data.get('description', ''),
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date(),
            budget=float(data['budget']),
            cover_photo=data.get('cover_photo', '')
        )
        
        db.session.add(trip)
        db.session.commit()
        
        return jsonify({
            'message': 'Trip created successfully',
            'trip': trip.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>', methods=['GET'])
@jwt_required()
def get_trip(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        return jsonify(trip.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>', methods=['PUT'])
@jwt_required()
def update_trip(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        data = request.get_json()
        
        updatable_fields = ['name', 'destination', 'description', 'start_date', 'end_date', 'budget', 'cover_photo']
        for field in updatable_fields:
            if field in data:
                if field in ['start_date', 'end_date']:
                    setattr(trip, field, datetime.strptime(data[field], '%Y-%m-%d').date())
                elif field == 'budget':
                    setattr(trip, field, float(data[field]))
                else:
                    setattr(trip, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Trip updated successfully',
            'trip': trip.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>', methods=['DELETE'])
@jwt_required()
def delete_trip(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        db.session.delete(trip)
        db.session.commit()
        
        return jsonify({'message': 'Trip deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Itinerary Routes
@app.route('/api/trips/<int:trip_id>/itinerary', methods=['GET'])
@jwt_required()
def get_itinerary(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        itinerary = Itinerary.query.filter_by(trip_id=trip_id).order_by(Itinerary.order).all()
        
        result = []
        for stop in itinerary:
            activities = Activity.query.filter_by(itinerary_id=stop.id).order_by(Activity.time).all()
            result.append({
                **stop.to_dict(),
                'activities': [activity.to_dict() for activity in activities]
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/itinerary', methods=['POST'])
@jwt_required()
def create_itinerary_stop(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        data = request.get_json()
        
        # Get the next order number
        last_order = db.session.query(db.func.max(Itinerary.order)).filter_by(trip_id=trip_id).scalar() or 0
        
        stop = Itinerary(
            trip_id=trip_id,
            city=data['city'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
            order=last_order + 1
        )
        
        db.session.add(stop)
        db.session.commit()
        
        return jsonify({
            'message': 'Itinerary stop created successfully',
            'stop': stop.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/itinerary/<int:stop_id>', methods=['PUT'])
@jwt_required()
def update_itinerary_stop(stop_id):
    try:
        user_id = get_jwt_identity()
        stop = Itinerary.query.join(Trip).filter(
            Itinerary.id == stop_id,
            Trip.user_id == user_id
        ).first()
        
        if not stop:
            return jsonify({'error': 'Itinerary stop not found'}), 404
        
        data = request.get_json()
        
        updatable_fields = ['city', 'date', 'end_date', 'order']
        for field in updatable_fields:
            if field in data:
                if field in ['date', 'end_date']:
                    setattr(stop, field, datetime.strptime(data[field], '%Y-%m-%d').date())
                else:
                    setattr(stop, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Itinerary stop updated successfully',
            'stop': stop.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/itinerary/<int:stop_id>', methods=['DELETE'])
@jwt_required()
def delete_itinerary_stop(stop_id):
    try:
        user_id = get_jwt_identity()
        stop = Itinerary.query.join(Trip).filter(
            Itinerary.id == stop_id,
            Trip.user_id == user_id
        ).first()
        
        if not stop:
            return jsonify({'error': 'Itinerary stop not found'}), 404
        
        db.session.delete(stop)
        db.session.commit()
        
        return jsonify({'message': 'Itinerary stop deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Activity Routes
@app.route('/api/itinerary/<int:stop_id>/activities', methods=['POST'])
@jwt_required()
def create_activity(stop_id):
    try:
        user_id = get_jwt_identity()
        stop = Itinerary.query.join(Trip).filter(
            Itinerary.id == stop_id,
            Trip.user_id == user_id
        ).first()
        
        if not stop:
            return jsonify({'error': 'Itinerary stop not found'}), 404
        
        data = request.get_json()
        
        activity = Activity(
            itinerary_id=stop_id,
            activity=data['activity'],
            time=data.get('time'),
            location=data.get('location'),
            cost=float(data.get('cost', 0)),
            notes=data.get('notes', '')
        )
        
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({
            'message': 'Activity created successfully',
            'activity': activity.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/activities/<int:activity_id>', methods=['PUT'])
@jwt_required()
def update_activity(activity_id):
    try:
        user_id = get_jwt_identity()
        activity = Activity.query.join(Itinerary).join(Trip).filter(
            Activity.id == activity_id,
            Trip.user_id == user_id
        ).first()
        
        if not activity:
            return jsonify({'error': 'Activity not found'}), 404
        
        data = request.get_json()
        
        updatable_fields = ['activity', 'time', 'location', 'cost', 'notes']
        for field in updatable_fields:
            if field in data:
                if field == 'cost':
                    setattr(activity, field, float(data[field]))
                else:
                    setattr(activity, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Activity updated successfully',
            'activity': activity.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/activities/<int:activity_id>', methods=['DELETE'])
@jwt_required()
def delete_activity(activity_id):
    try:
        user_id = get_jwt_identity()
        activity = Activity.query.join(Itinerary).join(Trip).filter(
            Activity.id == activity_id,
            Trip.user_id == user_id
        ).first()
        
        if not activity:
            return jsonify({'error': 'Activity not found'}), 404
        
        db.session.delete(activity)
        db.session.commit()
        
        return jsonify({'message': 'Activity deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Destination Routes
@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    try:
        destinations = Destination.query.all()
        return jsonify([dest.to_dict() for dest in destinations]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/destinations', methods=['POST'])
@jwt_required()
def create_destination():
    try:
        data = request.get_json()
        
        destination = Destination(
            name=data['name'],
            country=data['country'],
            region=data.get('region'),
            city_type=data.get('city_type', 'city'),
            description=data.get('description', ''),
            image_url=data.get('image_url', ''),
            popular_activities=data.get('popular_activities', []),
            best_time_to_visit=data.get('best_time_to_visit', ''),
            average_cost=data.get('average_cost', 0),
            cost_index=data.get('cost_index', 100.0),
            popularity_score=data.get('popularity_score', 0.0),
            rating=data.get('rating', 0.0),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            timezone=data.get('timezone'),
            currency=data.get('currency'),
            language=data.get('language'),
            population=data.get('population')
        )
        
        db.session.add(destination)
        db.session.commit()
        
        return jsonify({
            'message': 'Destination created successfully',
            'destination': destination.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# City Search Routes
@app.route('/api/cities/search', methods=['GET'])
def search_cities():
    try:
        query = request.args.get('q', '').strip()
        country = request.args.get('country')
        region = request.args.get('region')
        city_type = request.args.get('city_type')
        min_cost = request.args.get('min_cost', type=float)
        max_cost = request.args.get('max_cost', type=float)
        min_popularity = request.args.get('min_popularity', type=float)
        max_popularity = request.args.get('max_popularity', type=float)
        sort_by = request.args.get('sort_by', 'name')  # name, popularity, cost, rating
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Build base query
        cities_query = Destination.query
        
        # Apply filters
        if query:
            cities_query = cities_query.filter(
                Destination.name.ilike(f'%{query}%')
            )
        
        if country:
            cities_query = cities_query.filter(Destination.country == country)
        
        if region:
            cities_query = cities_query.filter(Destination.region == region)
        
        if city_type:
            cities_query = cities_query.filter(Destination.city_type == city_type)
        
        if min_cost is not None:
            cities_query = cities_query.filter(Destination.average_cost >= min_cost)
        
        if max_cost is not None:
            cities_query = cities_query.filter(Destination.average_cost <= max_cost)
        
        if min_popularity is not None:
            cities_query = cities_query.filter(Destination.popularity_score >= min_popularity)
        
        if max_popularity is not None:
            cities_query = cities_query.filter(Destination.popularity_score <= max_popularity)
        
        # Apply sorting
        if sort_by == 'name':
            cities_query = cities_query.order_by(Destination.name.asc())
        elif sort_by == 'popularity':
            cities_query = cities_query.order_by(Destination.popularity_score.desc())
        elif sort_by == 'cost':
            cities_query = cities_query.order_by(Destination.average_cost.asc())
        elif sort_by == 'rating':
            cities_query = cities_query.order_by(Destination.rating.desc())
        
        # Pagination
        paginated = cities_query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        # Get filter options
        countries = db.session.query(Destination.country).distinct().all()
        regions = db.session.query(Destination.region).distinct().all()
        city_types = db.session.query(Destination.city_type).distinct().all()
        
        return jsonify({
            'cities': [city.to_dict() for city in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages,
                'has_next': paginated.has_next,
                'has_prev': paginated.has_prev
            },
            'filters': {
                'countries': [c[0] for c in countries if c[0]],
                'regions': [r[0] for r in regions if r[0]],
                'city_types': [ct[0] for ct in city_types if ct[0]]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cities/featured', methods=['GET'])
def get_featured_cities():
    try:
        limit = request.args.get('limit', 10, type=int)
        
        # Get cities with high popularity scores
        featured_cities = Destination.query.filter(
            Destination.popularity_score > 70
        ).order_by(
            Destination.popularity_score.desc(),
            Destination.rating.desc()
        ).limit(limit).all()
        
        return jsonify([city.to_dict() for city in featured_cities]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cities/<int:city_id>', methods=['GET'])
def get_city_details(city_id):
    try:
        city = Destination.query.get(city_id)
        
        if not city:
            return jsonify({'error': 'City not found'}), 404
        
        return jsonify(city.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/add-city', methods=['POST'])
@jwt_required()
def add_city_to_trip(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        data = request.get_json()
        city_id = data.get('city_id')
        date = data.get('date')
        end_date = data.get('end_date')
        
        if not city_id or not date:
            return jsonify({'error': 'City ID and date are required'}), 400
        
        # Get city details
        city = Destination.query.get(city_id)
        if not city:
            return jsonify({'error': 'City not found'}), 404
        
        # Check if city is already in itinerary
        existing_stop = Itinerary.query.filter_by(
            trip_id=trip_id, 
            city=city.name
        ).first()
        
        if existing_stop:
            return jsonify({'error': 'City already added to itinerary'}), 409
        
        # Get the next order number
        last_order = db.session.query(db.func.max(Itinerary.order)).filter_by(trip_id=trip_id).scalar() or 0
        
        # Create itinerary stop
        stop = Itinerary(
            trip_id=trip_id,
            city=city.name,
            date=datetime.strptime(date, '%Y-%m-%d').date(),
            end_date=datetime.strptime(end_date, '%Y-%m-%d').date() if end_date else None,
            order=last_order + 1
        )
        
        db.session.add(stop)
        db.session.commit()
        
        return jsonify({
            'message': 'City added to trip successfully',
            'stop': stop.to_dict(),
            'city': city.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Activity Search Routes
@app.route('/api/activities/search', methods=['GET'])
def search_activities():
    try:
        query = request.args.get('q', '').strip()
        category = request.args.get('category')
        subcategory = request.args.get('subcategory')
        difficulty = request.args.get('difficulty')
        location_type = request.args.get('location_type')
        age_appropriate = request.args.get('age_appropriate')
        min_cost = request.args.get('min_cost', type=float)
        max_cost = request.args.get('max_cost', type=float)
        min_duration = request.args.get('min_duration', type=float)
        max_duration = request.args.get('max_duration', type=float)
        min_rating = request.args.get('min_rating', type=float)
        sort_by = request.args.get('sort_by', 'name')  # name, rating, cost, duration
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        city_id = request.args.get('city_id', type=int)
        
        # Build base query
        activities_query = ActivityTemplate.query
        
        # Apply filters
        if query:
            activities_query = activities_query.filter(
                ActivityTemplate.name.ilike(f'%{query}%')
            )
        
        if category:
            activities_query = activities_query.filter(ActivityTemplate.category == category)
        
        if subcategory:
            activities_query = activities_query.filter(ActivityTemplate.subcategory == subcategory)
        
        if difficulty:
            activities_query = activities_query.filter(ActivityTemplate.difficulty_level == difficulty)
        
        if location_type:
            activities_query = activities_query.filter(ActivityTemplate.location_type == location_type)
        
        if age_appropriate:
            activities_query = activities_query.filter(ActivityTemplate.age_appropriate == age_appropriate)
        
        if min_cost is not None:
            activities_query = activities_query.filter(ActivityTemplate.cost_range_min >= min_cost)
        
        if max_cost is not None:
            activities_query = activities_query.filter(ActivityTemplate.cost_range_max <= max_cost)
        
        if min_duration is not None:
            activities_query = activities_query.filter(ActivityTemplate.duration_hours >= min_duration)
        
        if max_duration is not None:
            activities_query = activities_query.filter(ActivityTemplate.duration_hours <= max_duration)
        
        if min_rating is not None:
            activities_query = activities_query.filter(ActivityTemplate.rating >= min_rating)
        
        # Filter by city if specified
        if city_id:
            activities_query = activities_query.filter(
                ActivityTemplate.popular_in_cities.contains([city_id])
            )
        
        # Apply sorting
        if sort_by == 'name':
            activities_query = activities_query.order_by(ActivityTemplate.name.asc())
        elif sort_by == 'rating':
            activities_query = activities_query.order_by(ActivityTemplate.rating.desc())
        elif sort_by == 'cost':
            activities_query = activities_query.order_by(ActivityTemplate.average_cost.asc())
        elif sort_by == 'duration':
            activities_query = activities_query.order_by(ActivityTemplate.duration_hours.asc())
        
        # Pagination
        paginated = activities_query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        # Get filter options
        categories = db.session.query(ActivityTemplate.category).distinct().all()
        subcategories = db.session.query(ActivityTemplate.subcategory).distinct().all()
        difficulties = db.session.query(ActivityTemplate.difficulty_level).distinct().all()
        location_types = db.session.query(ActivityTemplate.location_type).distinct().all()
        age_groups = db.session.query(ActivityTemplate.age_appropriate).distinct().all()
        
        return jsonify({
            'activities': [activity.to_dict() for activity in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages,
                'has_next': paginated.has_next,
                'has_prev': paginated.has_prev
            },
            'filters': {
                'categories': [c[0] for c in categories if c[0]],
                'subcategories': [s[0] for s in subcategories if s[0]],
                'difficulties': [d[0] for d in difficulties if d[0]],
                'location_types': [lt[0] for lt in location_types if lt[0]],
                'age_groups': [ag[0] for ag in age_groups if ag[0]]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/activities/featured', methods=['GET'])
def get_featured_activities():
    try:
        limit = request.args.get('limit', 10, type=int)
        city_id = request.args.get('city_id', type=int)
        
        # Build query
        activities_query = ActivityTemplate.query.filter(
            ActivityTemplate.rating >= 4.0
        )
        
        # Filter by city if specified
        if city_id:
            activities_query = activities_query.filter(
                ActivityTemplate.popular_in_cities.contains([city_id])
            )
        
        # Get featured activities
        featured_activities = activities_query.order_by(
            ActivityTemplate.rating.desc(),
            ActivityTemplate.review_count.desc()
        ).limit(limit).all()
        
        return jsonify([activity.to_dict() for activity in featured_activities]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/activities/<int:activity_id>', methods=['GET'])
def get_activity_details(activity_id):
    try:
        activity = ActivityTemplate.query.get(activity_id)
        
        if not activity:
            return jsonify({'error': 'Activity not found'}), 404
        
        return jsonify(activity.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/itinerary/<int:stop_id>/add-activity-template', methods=['POST'])
@jwt_required()
def add_activity_template_to_stop(stop_id):
    try:
        user_id = get_jwt_identity()
        stop = Itinerary.query.join(Trip).filter(
            Itinerary.id == stop_id,
            Trip.user_id == user_id
        ).first()
        
        if not stop:
            return jsonify({'error': 'Itinerary stop not found'}), 404
        
        data = request.get_json()
        activity_template_id = data.get('activity_template_id')
        time = data.get('time')
        location = data.get('location')
        notes = data.get('notes')
        custom_cost = data.get('cost')
        
        if not activity_template_id:
            return jsonify({'error': 'Activity template ID is required'}), 400
        
        # Get activity template
        activity_template = ActivityTemplate.query.get(activity_template_id)
        if not activity_template:
            return jsonify({'error': 'Activity template not found'}), 404
        
        # Create activity from template
        activity = Activity(
            itinerary_id=stop_id,
            activity=activity_template.name,
            time=time,
            location=location or f'{stop.city}',
            cost=custom_cost or activity_template.average_cost,
            notes=notes or activity_template.description
        )
        
        db.session.add(activity)
        db.session.commit()
        
        return jsonify({
            'message': 'Activity added successfully',
            'activity': activity.to_dict(),
            'template': activity_template.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/activities/categories', methods=['GET'])
def get_activity_categories():
    try:
        categories = db.session.query(
            ActivityTemplate.category,
            db.func.count(ActivityTemplate.id).label('count')
        ).group_by(ActivityTemplate.category).all()
        
        return jsonify([
            {
                'name': category[0],
                'count': category[1]
            }
            for category in categories
        ]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Budget and Expense Routes
@app.route('/api/trips/<int:trip_id>/budget', methods=['GET'])
@jwt_required()
def get_trip_budget(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        # Get all expenses for the trip
        expenses = Expense.query.filter_by(trip_id=trip_id).all()
        
        # Get all activities with costs
        activities = db.session.query(Activity).join(Itinerary).filter(
            Itinerary.trip_id == trip_id
        ).all()
        
        # Calculate total costs by category
        expense_categories = {}
        total_expenses = 0.0
        
        for expense in expenses:
            category = expense.category
            if category not in expense_categories:
                expense_categories[category] = 0.0
            expense_categories[category] += expense.amount
            total_expenses += expense.amount
        
        # Add activity costs
        activity_costs = 0.0
        for activity in activities:
            if activity.cost:
                activity_costs += activity.cost
        
        # Calculate trip duration
        trip_duration = (trip.end_date - trip.start_date).days + 1
        
        # Calculate budget breakdown
        budget_breakdown = {
            'transport': expense_categories.get('transport', 0.0),
            'accommodation': expense_categories.get('accommodation', 0.0),
            'meals': expense_categories.get('meals', 0.0),
            'activities': activity_costs,
            'shopping': expense_categories.get('shopping', 0.0),
            'other': expense_categories.get('other', 0.0)
        }
        
        # Calculate totals
        total_spent = sum(budget_breakdown.values())
        remaining_budget = trip.budget - total_spent
        daily_average = total_spent / trip_duration if trip_duration > 0 else 0
        budget_daily_average = trip.budget / trip_duration if trip_duration > 0 else 0
        
        # Determine budget status
        budget_status = 'on_track'
        if total_spent > trip.budget:
            budget_status = 'over_budget'
        elif total_spent > trip.budget * 0.9:
            budget_status = 'warning'
        elif total_spent > trip.budget * 0.7:
            budget_status = 'caution'
        
        return jsonify({
            'trip_id': trip_id,
            'trip_name': trip.name,
            'total_budget': trip.budget,
            'total_spent': total_spent,
            'remaining_budget': remaining_budget,
            'budget_status': budget_status,
            'trip_duration': trip_duration,
            'daily_average': daily_average,
            'budget_daily_average': budget_daily_average,
            'breakdown': budget_breakdown,
            'expense_count': len(expenses),
            'activity_count': len(activities)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/expenses', methods=['GET'])
@jwt_required()
def get_trip_expenses(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        expenses = Expense.query.filter_by(trip_id=trip_id).order_by(Expense.date.desc()).all()
        
        return jsonify([expense.to_dict() for expense in expenses]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/expenses', methods=['POST'])
@jwt_required()
def create_expense(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['category', 'description', 'amount', 'date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create new expense
        expense = Expense(
            user_id=user_id,
            trip_id=trip_id,
            category=data['category'],
            description=data['description'],
            amount=float(data['amount']),
            currency=data.get('currency', 'USD'),
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            receipt_url=data.get('receipt_url', '')
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify({
            'message': 'Expense created successfully',
            'expense': expense.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    try:
        user_id = get_jwt_identity()
        expense = Expense.query.join(Trip).filter(
            Expense.id == expense_id,
            Trip.user_id == user_id
        ).first()
        
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        data = request.get_json()
        
        updatable_fields = ['category', 'description', 'amount', 'currency', 'date', 'receipt_url']
        for field in updatable_fields:
            if field in data:
                if field == 'date':
                    setattr(expense, field, datetime.strptime(data[field], '%Y-%m-%d').date())
                elif field == 'amount':
                    setattr(expense, field, float(data[field]))
                else:
                    setattr(expense, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Expense updated successfully',
            'expense': expense.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    try:
        user_id = get_jwt_identity()
        expense = Expense.query.join(Trip).filter(
            Expense.id == expense_id,
            Trip.user_id == user_id
        ).first()
        
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        db.session.delete(expense)
        db.session.commit()
        
        return jsonify({'message': 'Expense deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/budget/suggestions', methods=['GET'])
@jwt_required()
def get_budget_suggestions(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        # Get current budget breakdown
        budget_response = get_trip_budget(trip_id)
        budget_data = budget_response[0].json if budget_response[1] == 200 else {}
        
        # Generate suggestions based on spending patterns
        suggestions = []
        breakdown = budget_data.get('breakdown', {})
        total_spent = budget_data.get('total_spent', 0)
        total_budget = budget_data.get('total_budget', 0)
        
        # Check for overspending categories
        if breakdown.get('meals', 0) > total_budget * 0.3:
            suggestions.append({
                'type': 'warning',
                'category': 'meals',
                'message': 'Meal expenses are high. Consider mixing restaurant meals with grocery shopping or picnics.',
                'potential_savings': breakdown.get('meals', 0) * 0.2
            })
        
        if breakdown.get('transport', 0) > total_budget * 0.25:
            suggestions.append({
                'type': 'warning',
                'category': 'transport',
                'message': 'Transport costs are elevated. Look into public transit passes or ride-sharing options.',
                'potential_savings': breakdown.get('transport', 0) * 0.15
            })
        
        if breakdown.get('activities', 0) > total_budget * 0.25:
            suggestions.append({
                'type': 'info',
                'category': 'activities',
                'message': 'Consider free activities like parks, walking tours, or museums with free admission days.',
                'potential_savings': breakdown.get('activities', 0) * 0.3
            })
        
        # General budget advice
        if budget_data.get('budget_status') == 'over_budget':
            suggestions.append({
                'type': 'critical',
                'category': 'overall',
                'message': 'You\'re over budget! Review all expenses and prioritize essential items.',
                'potential_savings': total_spent - total_budget
            })
        elif budget_data.get('budget_status') == 'warning':
            suggestions.append({
                'type': 'warning',
                'category': 'overall',
                'message': 'You\'re approaching your budget limit. Track remaining expenses carefully.',
                'potential_savings': total_spent - (total_budget * 0.8)
            })
        
        # Add positive reinforcement if on track
        if budget_data.get('budget_status') == 'on_track':
            suggestions.append({
                'type': 'success',
                'category': 'overall',
                'message': 'Great job staying within budget! Keep tracking expenses to maintain this progress.',
                'potential_savings': 0
            })
        
        return jsonify({
            'suggestions': suggestions,
            'budget_status': budget_data.get('budget_status'),
            'total_spent': total_spent,
            'total_budget': total_budget
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Packing List Routes
@app.route('/api/trips/<int:trip_id>/packing-list', methods=['GET'])
@jwt_required()
def get_packing_list(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        # Get packing items for the trip
        packing_items = PackingItem.query.filter_by(trip_id=trip_id).order_by(PackingItem.category, PackingItem.name).all()
        
        # Group items by category
        items_by_category = {}
        total_items = 0
        packed_items = 0
        
        for item in packing_items:
            category = item.category
            if category not in items_by_category:
                items_by_category[category] = []
            items_by_category[category].append(item.to_dict())
            total_items += 1
            if item.packed:
                packed_items += 1
        
        # Calculate progress
        progress_percentage = (packed_items / total_items * 100) if total_items > 0 else 0
        
        return jsonify({
            'trip_id': trip_id,
            'items_by_category': items_by_category,
            'total_items': total_items,
            'packed_items': packed_items,
            'progress_percentage': progress_percentage,
            'categories': list(items_by_category.keys())
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/packing-items', methods=['POST'])
@jwt_required()
def create_packing_item(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create new packing item
        packing_item = PackingItem(
            trip_id=trip_id,
            name=data['name'],
            category=data['category'],
            quantity=data.get('quantity', 1),
            packed=data.get('packed', False),
            notes=data.get('notes', ''),
            essential=data.get('essential', False)
        )
        
        db.session.add(packing_item)
        db.session.commit()
        
        return jsonify({
            'message': 'Packing item created successfully',
            'item': packing_item.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/packing-items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_packing_item(item_id):
    try:
        user_id = get_jwt_identity()
        packing_item = PackingItem.query.join(Trip).filter(
            PackingItem.id == item_id,
            Trip.user_id == user_id
        ).first()
        
        if not packing_item:
            return jsonify({'error': 'Packing item not found'}), 404
        
        data = request.get_json()
        
        updatable_fields = ['name', 'category', 'quantity', 'packed', 'notes', 'essential']
        for field in updatable_fields:
            if field in data:
                setattr(packing_item, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Packing item updated successfully',
            'item': packing_item.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/packing-items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_packing_item(item_id):
    try:
        user_id = get_jwt_identity()
        packing_item = PackingItem.query.join(Trip).filter(
            PackingItem.id == item_id,
            Trip.user_id == user_id
        ).first()
        
        if not packing_item:
            return jsonify({'error': 'Packing item not found'}), 404
        
        db.session.delete(packing_item)
        db.session.commit()
        
        return jsonify({'message': 'Packing item deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/packing-list/reset', methods=['POST'])
@jwt_required()
def reset_packing_list(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        # Reset all items to unpacked
        PackingItem.query.filter_by(trip_id=trip_id).update({'packed': False})
        db.session.commit()
        
        return jsonify({'message': 'Packing list reset successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/packing-list/templates', methods=['GET'])
@jwt_required()
def get_packing_templates(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        # Define packing templates based on trip type and duration
        templates = {
            'beach': {
                'clothing': ['Swimsuit', 'Beach towel', 'Sun hat', 'Sunglasses', 'Flip-flops', 'Cover-up', 'Light dresses', 'Shorts'],
                'documents': ['Passport', 'Travel insurance', 'Flight tickets', 'Hotel reservations'],
                'electronics': ['Phone charger', 'Portable speaker', 'Waterproof phone case', 'Camera'],
                'toiletries': ['Sunscreen', 'After-sun lotion', 'Lip balm', 'Insect repellent'],
                'accessories': ['Beach bag', 'Sunglasses case', 'Water bottle']
            },
            'business': {
                'clothing': ['Business suits', 'Dress shirts', 'Ties', 'Dress shoes', 'Belt', 'Socks'],
                'documents': ['Passport', 'Business cards', 'Meeting agenda', 'Presentation materials', 'Travel insurance'],
                'electronics': ['Laptop', 'Phone charger', 'Power bank', 'Headphones', 'Mouse'],
                'toiletries': ['Travel-size toiletries', 'Deodorant', 'Toothbrush', 'Razor'],
                'accessories': ['Briefcase', 'Watch', 'Pen', 'Notebook']
            },
            'adventure': {
                'clothing': ['Hiking boots', 'Moisture-wicking shirts', 'Waterproof jacket', 'Hiking pants', 'Socks'],
                'documents': ['Passport', 'Travel insurance', 'Permits', 'Emergency contacts'],
                'electronics': ['GPS device', 'Power bank', 'Headlamp', 'Camera', 'Portable charger'],
                'gear': ['Backpack', 'Sleeping bag', 'Tent', 'Cooking supplies', 'First aid kit'],
                'safety': ['Emergency whistle', 'Multi-tool', 'Water purification tablets']
            },
            'city': {
                'clothing': ['Comfortable walking shoes', 'Weather-appropriate clothing', 'Light jacket', 'Scarf'],
                'documents': ['Passport', 'City map', 'Museum passes', 'Travel insurance'],
                'electronics': ['Phone charger', 'Portable charger', 'Camera', 'Headphones'],
                'toiletries': ['Travel-size toiletries', 'Hand sanitizer', 'Tissues'],
                'accessories': ['Day bag', 'Water bottle', 'Umbrella', 'Sunglasses']
            }
        }
        
        # Determine template based on trip characteristics
        trip_name = trip.name.lower()
        template_type = 'city'  # default
        
        if any(word in trip_name for word in ['beach', 'resort', 'tropical', 'island']):
            template_type = 'beach'
        elif any(word in trip_name for word in ['business', 'work', 'conference', 'meeting']):
            template_type = 'business'
        elif any(word in trip_name for word in ['hiking', 'adventure', 'trek', 'camping']):
            template_type = 'adventure'
        
        return jsonify({
            'templates': templates,
            'recommended_template': template_type
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/packing-list/apply-template', methods=['POST'])
@jwt_required()
def apply_packing_template(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        data = request.get_json()
        template = data.get('template', {})
        
        # Clear existing items if requested
        if data.get('clear_existing', False):
            PackingItem.query.filter_by(trip_id=trip_id).delete()
        
        # Add items from template
        for category, items in template.items():
            for item_name in items:
                # Check if item already exists
                existing = PackingItem.query.filter_by(
                    trip_id=trip_id, 
                    name=item_name, 
                    category=category
                ).first()
                
                if not existing:
                    packing_item = PackingItem(
                        trip_id=trip_id,
                        name=item_name,
                        category=category,
                        quantity=1,
                        packed=False,
                        essential=False
                    )
                    db.session.add(packing_item)
        
        db.session.commit()
        
        return jsonify({'message': 'Template applied successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Public Sharing Routes
@app.route('/api/trips/<int:trip_id>/share', methods=['POST'])
@jwt_required()
def create_public_share(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        data = request.get_json()
        
        # Check if share already exists
        existing_share = PublicShare.query.filter_by(trip_id=trip_id).first()
        
        if existing_share:
            # Update existing share
            if 'is_public' in data:
                existing_share.is_public = data['is_public']
            if 'allow_copy' in data:
                existing_share.allow_copy = data['allow_copy']
            if 'expires_at' in data:
                if data['expires_at']:
                    existing_share.expires_at = datetime.strptime(data['expires_at'], '%Y-%m-%d')
                else:
                    existing_share.expires_at = None
            
            db.session.commit()
            share = existing_share
        else:
            # Create new share
            import secrets
            share_token = secrets.token_urlsafe(32)
            
            expires_at = None
            if data.get('expires_at'):
                expires_at = datetime.strptime(data['expires_at'], '%Y-%m-%d')
            
            share = PublicShare(
                trip_id=trip_id,
                share_token=share_token,
                is_public=data.get('is_public', False),
                allow_copy=data.get('allow_copy', True),
                expires_at=expires_at
            )
            
            db.session.add(share)
            db.session.commit()
        
        return jsonify({
            'message': 'Share created successfully',
            'share': share.to_dict(),
            'public_url': f"{request.host_url.rstrip('/')}/public/itinerary/{share.share_token}"
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/share', methods=['GET'])
@jwt_required()
def get_trip_share(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        share = PublicShare.query.filter_by(trip_id=trip_id).first()
        
        if not share:
            return jsonify({'error': 'Share not found'}), 404
        
        return jsonify({
            'share': share.to_dict(),
            'public_url': f"{request.host_url.rstrip('/')}/public/itinerary/{share.share_token}"
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/public/itinerary/<share_token>', methods=['GET'])
def get_public_itinerary(share_token):
    try:
        # Find the share
        share = PublicShare.query.filter_by(share_token=share_token).first()
        
        if not share:
            return jsonify({'error': 'Share not found'}), 404
        
        # Check if share is expired
        if share.expires_at and share.expires_at < datetime.utcnow():
            return jsonify({'error': 'Share has expired'}), 410
        
        # Check if share is public
        if not share.is_public:
            return jsonify({'error': 'Share is not public'}), 403
        
        # Increment view count
        share.view_count += 1
        db.session.commit()
        
        # Get trip data
        trip = share.trip
        
        # Get itinerary data
        itinerary = Itinerary.query.filter_by(trip_id=trip.id).order_by(Itinerary.order).all()
        
        # Get activities for each stop
        itinerary_data = []
        for stop in itinerary:
            activities = Activity.query.filter_by(itinerary_id=stop.id).order_by(Activity.time).all()
            
            stop_data = stop.to_dict()
            stop_data['activities'] = [activity.to_dict() for activity in activities]
            itinerary_data.append(stop_data)
        
        # Get packing list (optional)
        packing_items = PackingItem.query.filter_by(trip_id=trip.id).all()
        packing_data = [item.to_dict() for item in packing_items]
        
        return jsonify({
            'trip': trip.to_dict(),
            'itinerary': itinerary_data,
            'packing_items': packing_data,
            'share_info': {
                'allow_copy': share.allow_copy,
                'view_count': share.view_count
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/public/itinerary/<share_token>/copy', methods=['POST'])
@jwt_required()
def copy_public_itinerary(share_token):
    try:
        user_id = get_jwt_identity()
        
        # Find the share
        share = PublicShare.query.filter_by(share_token=share_token).first()
        
        if not share:
            return jsonify({'error': 'Share not found'}), 404
        
        # Check if share is expired
        if share.expires_at and share.expires_at < datetime.utcnow():
            return jsonify({'error': 'Share has expired'}), 410
        
        # Check if copying is allowed
        if not share.allow_copy:
            return jsonify({'error': 'Copying is not allowed for this itinerary'}), 403
        
        # Check if share is public
        if not share.is_public:
            return jsonify({'error': 'Share is not public'}), 403
        
        # Increment copy count
        share.copy_count += 1
        db.session.commit()
        
        # Get original trip data
        original_trip = share.trip
        
        # Create new trip
        data = request.get_json()
        new_trip_name = data.get('name', f"Copy of {original_trip.name}")
        
        new_trip = Trip(
            user_id=user_id,
            name=new_trip_name,
            destination=original_trip.destination,
            start_date=original_trip.start_date,
            end_date=original_trip.end_date,
            budget=original_trip.budget,
            description=original_trip.description,
            cover_photo_url=original_trip.cover_photo_url
        )
        
        db.session.add(new_trip)
        db.session.flush()  # Get the new trip ID
        
        # Copy itinerary
        original_itinerary = Itinerary.query.filter_by(trip_id=original_trip.id).order_by(Itinerary.order).all()
        
        for original_stop in original_itinerary:
            # Create new stop
            new_stop = Itinerary(
                trip_id=new_trip.id,
                destination=original_stop.destination,
                start_date=original_stop.start_date,
                end_date=original_stop.end_date,
                order=original_stop.order,
                notes=original_stop.notes
            )
            
            db.session.add(new_stop)
            db.session.flush()  # Get the new stop ID
            
            # Copy activities
            original_activities = Activity.query.filter_by(itinerary_id=original_stop.id).all()
            
            for original_activity in original_activities:
                new_activity = Activity(
                    itinerary_id=new_stop.id,
                    name=original_activity.name,
                    category=original_activity.category,
                    cost=original_activity.cost,
                    time=original_activity.time,
                    location=original_activity.location,
                    notes=original_activity.notes
                )
                
                db.session.add(new_activity)
        
        # Copy packing items (optional)
        copy_packing = data.get('copy_packing', False)
        if copy_packing:
            original_packing = PackingItem.query.filter_by(trip_id=original_trip.id).all()
            
            for original_item in original_packing:
                new_item = PackingItem(
                    trip_id=new_trip.id,
                    name=original_item.name,
                    category=original_item.category,
                    quantity=original_item.quantity,
                    packed=False,  # Reset packed status
                    notes=original_item.notes,
                    essential=original_item.essential
                )
                
                db.session.add(new_item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Itinerary copied successfully',
            'trip': new_trip.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/share/analytics', methods=['GET'])
@jwt_required()
def get_share_analytics(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        share = PublicShare.query.filter_by(trip_id=trip_id).first()
        
        if not share:
            return jsonify({'error': 'Share not found'}), 404
        
        return jsonify({
            'share_id': share.id,
            'view_count': share.view_count,
            'copy_count': share.copy_count,
            'is_public': share.is_public,
            'allow_copy': share.allow_copy,
            'expires_at': share.expires_at.isoformat() if share.expires_at else None,
            'created_at': share.created_at.isoformat() if share.created_at else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User Profile and Settings Routes

@app.route('/api/user/email', methods=['PUT'])
@jwt_required()
def update_user_email():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        new_email = data.get('email')
        password = data.get('password')
        
        if not new_email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Verify current password
        if not user.check_password(password):
            return jsonify({'error': 'Invalid password'}), 401
        
        # Check if email is already taken
        existing_user = User.query.filter_by(email=new_email).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'Email is already in use'}), 400
        
        user.email = new_email
        db.session.commit()
        
        return jsonify({
            'message': 'Email updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/password', methods=['PUT'])
@jwt_required()
def update_user_password():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not current_password or not new_password:
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Verify current password
        if not user.check_password(current_password):
            return jsonify({'error': 'Invalid current password'}), 401
        
        # Update password
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Password updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile-photo', methods=['POST'])
@jwt_required()
def upload_profile_photo():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # In a real application, you would upload to a cloud storage service
        # For demo purposes, we'll just save the filename
        filename = f"profile_{user_id}_{file.filename}"
        user.profile_photo_url = f"/uploads/{filename}"
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile photo uploaded successfully',
            'profile_photo_url': user.profile_photo_url
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/saved-destinations', methods=['GET'])
@jwt_required()
def get_saved_destinations():
    try:
        user_id = get_jwt_identity()
        saved_destinations = SavedDestination.query.filter_by(user_id=user_id).order_by(SavedDestination.priority.desc(), SavedDestination.created_at.desc()).all()
        
        return jsonify([dest.to_dict() for dest in saved_destinations]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/saved-destinations', methods=['POST'])
@jwt_required()
def save_destination():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        destination_id = data.get('destination_id')
        notes = data.get('notes', '')
        visit_date = data.get('visit_date')
        priority = data.get('priority', 'medium')
        
        if not destination_id:
            return jsonify({'error': 'Destination ID is required'}), 400
        
        # Check if destination exists
        destination = Destination.query.get(destination_id)
        if not destination:
            return jsonify({'error': 'Destination not found'}), 404
        
        # Check if already saved
        existing = SavedDestination.query.filter_by(user_id=user_id, destination_id=destination_id).first()
        if existing:
            return jsonify({'error': 'Destination already saved'}), 400
        
        # Parse visit date if provided
        visit_date_obj = None
        if visit_date:
            visit_date_obj = datetime.strptime(visit_date, '%Y-%m-%d').date()
        
        saved_destination = SavedDestination(
            user_id=user_id,
            destination_id=destination_id,
            notes=notes,
            visit_date=visit_date_obj,
            priority=priority
        )
        
        db.session.add(saved_destination)
        db.session.commit()
        
        return jsonify({
            'message': 'Destination saved successfully',
            'saved_destination': saved_destination.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/saved-destinations/<int:saved_id>', methods=['DELETE'])
@jwt_required()
def remove_saved_destination(saved_id):
    try:
        user_id = get_jwt_identity()
        saved_destination = SavedDestination.query.filter_by(id=saved_id, user_id=user_id).first()
        
        if not saved_destination:
            return jsonify({'error': 'Saved destination not found'}), 404
        
        db.session.delete(saved_destination)
        db.session.commit()
        
        return jsonify({'message': 'Destination removed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/delete-account', methods=['DELETE'])
@jwt_required()
def delete_user_account():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        password = data.get('password')
        confirmation = data.get('confirmation')
        
        if not password or not confirmation:
            return jsonify({'error': 'Password and confirmation are required'}), 400
        
        if confirmation != 'DELETE':
            return jsonify({'error': 'Invalid confirmation. Type "DELETE" to confirm.'}), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Verify password
        if not user.check_password(password):
            return jsonify({'error': 'Invalid password'}), 401
        
        # Delete user and all related data
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'Account deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    try:
        user_id = get_jwt_identity()
        
        # Get user statistics
        trip_count = Trip.query.filter_by(user_id=user_id).count()
        total_budget = db.session.query(db.func.sum(Trip.budget)).filter_by(user_id=user_id).scalar() or 0
        
        # Get upcoming trips
        upcoming_trips = Trip.query.filter(
            Trip.user_id == user_id,
            Trip.start_date >= datetime.utcnow().date()
        ).count()
        
        # Get saved destinations count
        saved_destinations_count = SavedDestination.query.filter_by(user_id=user_id).count()
        
        # Get total activities
        total_activities = db.session.query(db.func.count(Activity.id)).join(Itinerary).join(Trip).filter(
            Trip.user_id == user_id
        ).scalar() or 0
        
        return jsonify({
            'trip_count': trip_count,
            'total_budget': total_budget,
            'upcoming_trips': upcoming_trips,
            'saved_destinations': saved_destinations_count,
            'total_activities': total_activities
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Trip Notes Routes
@app.route('/api/trips/<int:trip_id>/notes', methods=['GET'])
@jwt_required()
def get_trip_notes(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        # Get all notes for the trip
        notes = TripNote.query.filter_by(trip_id=trip_id).order_by(
            TripNote.is_pinned.desc(),
            TripNote.note_date.desc().nullslast(),
            TripNote.created_at.desc()
        ).all()
        
        return jsonify([note.to_dict() for note in notes]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/notes', methods=['POST'])
@jwt_required()
def create_trip_note(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Title and content are required'}), 400
        
        # Parse note date if provided
        note_date = None
        if data.get('note_date'):
            note_date = datetime.strptime(data['note_date'], '%Y-%m-%d').date()
        
        # Create new note
        note = TripNote(
            trip_id=trip_id,
            itinerary_id=data.get('itinerary_id'),
            title=data['title'],
            content=data['content'],
            category=data.get('category', 'general'),
            tags=data.get('tags', []),
            is_pinned=data.get('is_pinned', False),
            note_date=note_date
        )
        
        db.session.add(note)
        db.session.commit()
        
        return jsonify({
            'message': 'Note created successfully',
            'note': note.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
@jwt_required()
def update_trip_note(note_id):
    try:
        user_id = get_jwt_identity()
        note = TripNote.query.join(Trip).filter(
            TripNote.id == note_id,
            Trip.user_id == user_id
        ).first()
        
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        updatable_fields = ['title', 'content', 'category', 'tags', 'is_pinned', 'note_date']
        for field in updatable_fields:
            if field in data:
                if field == 'note_date' and data[field]:
                    note.note_date = datetime.strptime(data[field], '%Y-%m-%d').date()
                else:
                    setattr(note, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Note updated successfully',
            'note': note.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_trip_note(note_id):
    try:
        user_id = get_jwt_identity()
        note = TripNote.query.join(Trip).filter(
            TripNote.id == note_id,
            Trip.user_id == user_id
        ).first()
        
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        db.session.delete(note)
        db.session.commit()
        
        return jsonify({'message': 'Note deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/notes/search', methods=['GET'])
@jwt_required()
def search_trip_notes(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        query = request.args.get('q', '')
        category = request.args.get('category')
        
        # Build search query
        notes_query = TripNote.query.filter_by(trip_id=trip_id)
        
        if query:
            notes_query = notes_query.filter(
                db.or_(
                    TripNote.title.ilike(f'%{query}%'),
                    TripNote.content.ilike(f'%{query}%')
                )
            )
        
        if category:
            notes_query = notes_query.filter_by(category=category)
        
        notes = notes_query.order_by(
            TripNote.is_pinned.desc(),
            TripNote.note_date.desc().nullslast(),
            TripNote.created_at.desc()
        ).all()
        
        return jsonify([note.to_dict() for note in notes]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/notes/categories', methods=['GET'])
@jwt_required()
def get_note_categories(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        # Get all unique categories for this trip
        categories = db.session.query(TripNote.category).filter_by(trip_id=trip_id).distinct().all()
        category_list = [cat[0] for cat in categories]
        
        return jsonify(category_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trips/<int:trip_id>/notes/export', methods=['GET'])
@jwt_required()
def export_trip_notes(trip_id):
    try:
        user_id = get_jwt_identity()
        trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
        
        if not trip:
            return jsonify({'error': 'Trip not found'}), 404
        
        # Get all notes
        notes = TripNote.query.filter_by(trip_id=trip_id).order_by(
            TripNote.is_pinned.desc(),
            TripNote.note_date.desc().nullslast(),
            TripNote.created_at.desc()
        ).all()
        
        # Create export data
        export_data = {
            'trip_name': trip.name,
            'destination': trip.destination,
            'export_date': datetime.utcnow().isoformat(),
            'notes': [note.to_dict() for note in notes]
        }
        
        return jsonify(export_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin Analytics Routes
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_dashboard():
    try:
        # Get basic statistics
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        total_trips = Trip.query.count()
        total_activities = Activity.query.count()
        total_notes = TripNote.query.count()
        
        # Get recent statistics
        today = datetime.utcnow().date()
        users_today = User.query.filter(User.created_at >= today).count()
        trips_today = Trip.query.filter(Trip.created_at >= today).count()
        
        # Get top destinations
        top_destinations = db.session.query(
            Trip.destination,
            db.func.count(Trip.id).label('trip_count')
        ).group_by(Trip.destination).order_by(db.desc('trip_count')).limit(10).all()
        
        # Get user engagement stats
        users_with_trips = db.session.query(db.func.count(db.func.distinct(Trip.user_id))).scalar()
        avg_trips_per_user = total_trips / active_users if active_users > 0 else 0
        
        # Get recent activity
        recent_trips = Trip.query.order_by(Trip.created_at.desc()).limit(5).all()
        recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
        
        # Format recent trips with user information
        recent_trips_data = []
        for trip in recent_trips:
            trip_dict = trip.to_dict()
            trip_dict['user'] = {
                'username': trip.user.username,
                'first_name': trip.user.first_name,
                'last_name': trip.user.last_name
            }
            recent_trips_data.append(trip_dict)
        
        return jsonify({
            'overview': {
                'total_users': total_users,
                'active_users': active_users,
                'total_trips': total_trips,
                'total_activities': total_activities,
                'total_notes': total_notes,
                'users_today': users_today,
                'trips_today': trips_today
            },
            'engagement': {
                'users_with_trips': users_with_trips,
                'avg_trips_per_user': round(avg_trips_per_user, 2),
                'user_engagement_rate': round((users_with_trips / active_users * 100), 2) if active_users > 0 else 0
            },
            'top_destinations': [
                {'destination': dest[0], 'trip_count': dest[1]} 
                for dest in top_destinations
            ],
            'recent_activity': {
                'trips': recent_trips_data,
                'users': [user.to_dict() for user in recent_users]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_users():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        status = request.args.get('status', '')  # active, inactive, all
        
        # Build query
        query = User.query
        
        if search:
            query = query.filter(
                db.or_(
                    User.username.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%'),
                    User.first_name.ilike(f'%{search}%'),
                    User.last_name.ilike(f'%{search}%')
                )
            )
        
        if status == 'active':
            query = query.filter_by(is_active=True)
        elif status == 'inactive':
            query = query.filter_by(is_active=False)
        
        # Paginate
        users = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'users': [user.to_dict() for user in users.items],
            'pagination': {
                'page': users.page,
                'pages': users.pages,
                'per_page': users.per_page,
                'total': users.total,
                'has_next': users.has_next,
                'has_prev': users.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>/toggle-status', methods=['POST'])
@jwt_required()
@admin_required
def toggle_user_status(user_id):
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Don't allow admin to deactivate themselves
        current_user_id = get_jwt_identity()
        if user_id == current_user_id:
            return jsonify({'error': 'Cannot deactivate your own account'}), 400
        
        user.is_active = not user.is_active
        db.session.commit()
        
        return jsonify({
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/analytics/trips', methods=['GET'])
@jwt_required()
@admin_required
def get_trip_analytics():
    try:
        # Get trips by month
        trips_by_month = db.session.query(
            db.func.date_trunc('month', Trip.created_at).label('month'),
            db.func.count(Trip.id).label('count')
        ).group_by(db.func.date_trunc('month', Trip.created_at)).order_by('month').all()
        
        # Get trips by destination
        trips_by_destination = db.session.query(
            Trip.destination,
            db.func.count(Trip.id).label('count')
        ).group_by(Trip.destination).order_by(db.desc('count')).limit(20).all()
        
        # Get budget statistics
        budget_stats = db.session.query(
            db.func.avg(Trip.budget).label('avg_budget'),
            db.func.min(Trip.budget).label('min_budget'),
            db.func.max(Trip.budget).label('max_budget'),
            db.func.sum(Trip.budget).label('total_budget')
        ).first()
        
        # Get popular trip durations
        duration_stats = db.session.query(
            (Trip.end_date - Trip.start_date).label('duration'),
            db.func.count(Trip.id).label('count')
        ).group_by('duration').order_by(db.desc('count')).limit(10).all()
        
        return jsonify({
            'trips_by_month': [
                {'month': str(trip[0]), 'count': trip[1]} 
                for trip in trips_by_month
            ],
            'trips_by_destination': [
                {'destination': trip[0], 'count': trip[1]} 
                for trip in trips_by_destination
            ],
            'budget_statistics': {
                'average': float(budget_stats.avg_budget) if budget_stats.avg_budget else 0,
                'minimum': float(budget_stats.min_budget) if budget_stats.min_budget else 0,
                'maximum': float(budget_stats.max_budget) if budget_stats.max_budget else 0,
                'total': float(budget_stats.total_budget) if budget_stats.total_budget else 0
            },
            'popular_durations': [
                {'duration': str(trip[0]), 'count': trip[1]} 
                for trip in duration_stats
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/analytics/activities', methods=['GET'])
@jwt_required()
@admin_required
def get_activity_analytics():
    try:
        # Get activities by category
        activities_by_category = db.session.query(
            Activity.category,
            db.func.count(Activity.id).label('count')
        ).group_by(Activity.category).order_by(db.desc('count')).all()
        
        # Get activities by cost range
        cost_ranges = [
            ('Free', 0, 0),
            ('Low', 0, 50),
            ('Medium', 50, 200),
            ('High', 200, 500),
            ('Luxury', 500, float('inf'))
        ]
        
        activities_by_cost = []
        for range_name, min_cost, max_cost in cost_ranges:
            if max_cost == float('inf'):
                count = db.session.query(Activity).filter(Activity.cost >= min_cost).count()
            else:
                count = db.session.query(Activity).filter(
                    Activity.cost >= min_cost,
                    Activity.cost < max_cost
                ).count()
            
            activities_by_cost.append({
                'range': range_name,
                'count': count,
                'min_cost': min_cost,
                'max_cost': max_cost if max_cost != float('inf') else None
            })
        
        # Get average activity cost
        avg_cost = db.session.query(db.func.avg(Activity.cost)).scalar() or 0
        
        return jsonify({
            'activities_by_category': [
                {'category': activity[0], 'count': activity[1]} 
                for activity in activities_by_category
            ],
            'activities_by_cost': activities_by_cost,
            'average_cost': float(avg_cost)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/analytics/engagement', methods=['GET'])
@jwt_required()
@admin_required
def get_engagement_analytics():
    try:
        # Get user registration trends
        registrations_by_month = db.session.query(
            db.func.date_trunc('month', User.created_at).label('month'),
            db.func.count(User.id).label('count')
        ).group_by(db.func.date_trunc('month', User.created_at)).order_by('month').all()
        
        # Get user activity levels
        user_activity_levels = []
        
        # Users with 0 trips
        zero_trips = db.session.query(db.func.count(User.id)).filter(
            ~User.id.in_(db.session.query(Trip.user_id).distinct())
        ).scalar()
        
        # Users with 1-3 trips
        few_trips = db.session.query(db.func.count(User.id)).filter(
            User.id.in_(
                db.session.query(Trip.user_id)
                .group_by(Trip.user_id)
                .having(db.func.count(Trip.id) <= 3)
            )
        ).scalar()
        
        # Users with 4-10 trips
        moderate_trips = db.session.query(db.func.count(User.id)).filter(
            User.id.in_(
                db.session.query(Trip.user_id)
                .group_by(Trip.user_id)
                .having(db.func.count(Trip.id) > 3)
                .having(db.func.count(Trip.id) <= 10)
            )
        ).scalar()
        
        # Users with 10+ trips
        many_trips = db.session.query(db.func.count(User.id)).filter(
            User.id.in_(
                db.session.query(Trip.user_id)
                .group_by(Trip.user_id)
                .having(db.func.count(Trip.id) > 10)
            )
        ).scalar()
        
        user_activity_levels = [
            {'level': '0 trips', 'count': zero_trips},
            {'level': '1-3 trips', 'count': few_trips},
            {'level': '4-10 trips', 'count': moderate_trips},
            {'level': '10+ trips', 'count': many_trips}
        ]
        
        # Get retention metrics
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        active_users_30d = db.session.query(db.func.count(db.func.distinct(Trip.user_id))).filter(
            Trip.created_at >= thirty_days_ago
        ).scalar()
        
        return jsonify({
            'registrations_by_month': [
                {'month': str(reg[0]), 'count': reg[1]} 
                for reg in registrations_by_month
            ],
            'user_activity_levels': user_activity_levels,
            'retention_metrics': {
                'active_users_30_days': active_users_30d,
                'retention_rate': round((active_users_30d / User.query.count() * 100), 2)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/export/data', methods=['GET'])
@jwt_required()
@admin_required
def export_admin_data():
    try:
        data_type = request.args.get('type', 'all')
        
        export_data = {}
        
        if data_type in ['all', 'users']:
            users = User.query.all()
            export_data['users'] = [user.to_dict() for user in users]
        
        if data_type in ['all', 'trips']:
            trips = Trip.query.all()
            export_data['trips'] = [trip.to_dict() for trip in trips]
        
        if data_type in ['all', 'activities']:
            activities = Activity.query.all()
            export_data['activities'] = [activity.to_dict() for activity in activities]
        
        export_data['export_date'] = datetime.utcnow().isoformat()
        export_data['exported_by'] = get_jwt_identity()
        
        return jsonify(export_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# File Upload Route
@app.route('/api/upload/cover', methods=['POST'])
@jwt_required()
def upload_cover_photo():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file:
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            
            return jsonify({
                'message': 'File uploaded successfully',
                'filename': unique_filename,
                'url': f'/uploads/{unique_filename}'
            }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Error Handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(422)
def unprocessable_entity(error):
    return jsonify({'error': 'Unprocessable entity'}), 422

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)

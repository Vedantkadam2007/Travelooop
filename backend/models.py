from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    profile_photo_url = db.Column(db.String(500))
    bio = db.Column(db.Text)
    language_preference = db.Column(db.String(10), default='en')
    timezone = db.Column(db.String(50), default='UTC')
    date_format = db.Column(db.String(20), default='MM/DD/YYYY')
    currency_preference = db.Column(db.String(3), default='USD')
    email_notifications = db.Column(db.Boolean, default=True)
    push_notifications = db.Column(db.Boolean, default=True)
    privacy_profile_public = db.Column(db.Boolean, default=False)
    privacy_show_trips = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    saved_destinations = db.relationship('SavedDestination', backref='user', lazy=True, cascade='all, delete-orphan')
    trips = db.relationship('Trip', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile_photo_url': self.profile_photo_url,
            'bio': self.bio,
            'language_preference': self.language_preference,
            'timezone': self.timezone,
            'date_format': self.date_format,
            'currency_preference': self.currency_preference,
            'email_notifications': self.email_notifications,
            'push_notifications': self.push_notifications,
            'privacy_profile_public': self.privacy_profile_public,
            'privacy_show_trips': self.privacy_show_trips,
            'is_admin': self.is_admin,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class SavedDestination(db.Model):
    __tablename__ = 'saved_destinations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False)
    notes = db.Column(db.Text)
    visit_date = db.Column(db.Date)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    destination = db.relationship('Destination', backref='saved_by')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'destination_id': self.destination_id,
            'destination': self.destination.to_dict() if self.destination else None,
            'notes': self.notes,
            'visit_date': self.visit_date.isoformat() if self.visit_date else None,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Trip(db.Model):
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    destination = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    budget = db.Column(db.Float, default=0.0)
    cover_photo = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    itinerary_stops = db.relationship('Itinerary', backref='trip', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'destination': self.destination,
            'description': self.description,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'budget': self.budget,
            'cover_photo': self.cover_photo,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Itinerary(db.Model):
    __tablename__ = 'itineraries'
    
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    city = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)  # For multi-day stops
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    activities = db.relationship('Activity', backref='itinerary', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'city': self.city,
            'date': self.date.isoformat() if self.date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'order': self.order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Activity(db.Model):
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itineraries.id'), nullable=False)
    activity = db.Column(db.String(500), nullable=False)
    time = db.Column(db.String(10))  # HH:MM format
    location = db.Column(db.String(500))
    cost = db.Column(db.Float, default=0.0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'itinerary_id': self.itinerary_id,
            'activity': self.activity,
            'time': self.time,
            'location': self.location,
            'cost': self.cost,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Destination(db.Model):
    __tablename__ = 'destinations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    country = db.Column(db.String(200), nullable=False)
    region = db.Column(db.String(100))  # Continent or region
    city_type = db.Column(db.String(50))  # city, town, village
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    popular_activities = db.Column(db.JSON)  # Store as JSON
    best_time_to_visit = db.Column(db.String(200))
    average_cost = db.Column(db.Float, default=0.0)
    cost_index = db.Column(db.Float, default=100.0)  # Cost of living index
    popularity_score = db.Column(db.Float, default=0.0)  # 0-100 popularity
    rating = db.Column(db.Float, default=0.0)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    timezone = db.Column(db.String(50))
    currency = db.Column(db.String(3))
    language = db.Column(db.String(50))
    population = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'country': self.country,
            'region': self.region,
            'city_type': self.city_type,
            'description': self.description,
            'image_url': self.image_url,
            'popular_activities': self.popular_activities or [],
            'best_time_to_visit': self.best_time_to_visit,
            'average_cost': self.average_cost,
            'cost_index': self.cost_index,
            'popularity_score': self.popularity_score,
            'rating': self.rating,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'timezone': self.timezone,
            'currency': self.currency,
            'language': self.language,
            'population': self.population,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PackingItem(db.Model):
    __tablename__ = 'packing_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    is_essential = db.Column(db.Boolean, default=False)
    quantity = db.Column(db.Integer, default=1)
    checked = db.Column(db.Boolean, default=False)
    destination_type = db.Column(db.String(100))  # beach, mountain, city, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'is_essential': self.is_essential,
            'quantity': self.quantity,
            'checked': self.checked,
            'destination_type': self.destination_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PackingList(db.Model):
    __tablename__ = 'packing_lists'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('packing_items.id'), nullable=False)
    checked = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='packing_lists')
    trip = db.relationship('Trip', backref='packing_lists')
    item = db.relationship('PackingItem', backref='packing_lists')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'trip_id': self.trip_id,
            'item_id': self.item_id,
            'checked': self.checked,
            'notes': self.notes,
            'item': self.item.to_dict() if self.item else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Expense(db.Model):
    __tablename__ = 'expenses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='USD')
    date = db.Column(db.Date, nullable=False)
    receipt_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='expenses')
    trip = db.relationship('Trip', backref='expenses')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'trip_id': self.trip_id,
            'category': self.category,
            'description': self.description,
            'amount': self.amount,
            'currency': self.currency,
            'date': self.date.isoformat() if self.date else None,
            'receipt_url': self.receipt_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ActivityTemplate(db.Model):
    __tablename__ = 'activity_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)  # sightseeing, food, adventure, culture, etc.
    subcategory = db.Column(db.String(100))  # museum, park, restaurant, etc.
    duration_hours = db.Column(db.Float, nullable=False)  # Duration in hours
    difficulty_level = db.Column(db.String(20), default='easy')  # easy, moderate, hard
    cost_range_min = db.Column(db.Float, default=0.0)
    cost_range_max = db.Column(db.Float, default=0.0)
    average_cost = db.Column(db.Float, default=0.0)
    currency = db.Column(db.String(3), default='USD')
    rating = db.Column(db.Float, default=0.0)
    review_count = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(500))
    location_type = db.Column(db.String(100))  # indoor, outdoor, both
    best_time_of_day = db.Column(db.String(100))  # morning, afternoon, evening, night
    age_appropriate = db.Column(db.String(100))  # all ages, adults only, family, etc.
    group_size_min = db.Column(db.Integer, default=1)
    group_size_max = db.Column(db.Integer)
    booking_required = db.Column(db.Boolean, default=False)
    advance_booking_days = db.Column(db.Integer, default=0)
    what_to_bring = db.Column(db.JSON)  # List of items to bring
    included_items = db.Column(db.JSON)  # List of included items
    excluded_items = db.Column(db.JSON)  # List of excluded items
    tips = db.Column(db.Text)
    safety_notes = db.Column(db.Text)
    accessibility = db.Column(db.String(100))  # wheelchair accessible, partially accessible, etc.
    languages_offered = db.Column(db.JSON)  # List of languages
    popular_in_cities = db.Column(db.JSON)  # List of city IDs where this activity is popular
    seasonal_availability = db.Column(db.JSON)  # Seasonal availability info
    weather_dependent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'subcategory': self.subcategory,
            'duration_hours': self.duration_hours,
            'difficulty_level': self.difficulty_level,
            'cost_range_min': self.cost_range_min,
            'cost_range_max': self.cost_range_max,
            'average_cost': self.average_cost,
            'currency': self.currency,
            'rating': self.rating,
            'review_count': self.review_count,
            'image_url': self.image_url,
            'location_type': self.location_type,
            'best_time_of_day': self.best_time_of_day,
            'age_appropriate': self.age_appropriate,
            'group_size_min': self.group_size_min,
            'group_size_max': self.group_size_max,
            'booking_required': self.booking_required,
            'advance_booking_days': self.advance_booking_days,
            'what_to_bring': self.what_to_bring or [],
            'included_items': self.included_items or [],
            'excluded_items': self.excluded_items or [],
            'tips': self.tips,
            'safety_notes': self.safety_notes,
            'accessibility': self.accessibility,
            'languages_offered': self.languages_offered or [],
            'popular_in_cities': self.popular_in_cities or [],
            'seasonal_availability': self.seasonal_availability,
            'weather_dependent': self.weather_dependent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PublicShare(db.Model):
    __tablename__ = 'public_shares'
    
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    share_token = db.Column(db.String(64), unique=True, nullable=False, index=True)
    is_public = db.Column(db.Boolean, default=False)
    allow_copy = db.Column(db.Boolean, default=True)
    expires_at = db.Column(db.DateTime)
    view_count = db.Column(db.Integer, default=0)
    copy_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    trip = db.relationship('Trip', backref='public_shares')
    
    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'share_token': self.share_token,
            'is_public': self.is_public,
            'allow_copy': self.allow_copy,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'view_count': self.view_count,
            'copy_count': self.copy_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class TripNote(db.Model):
    __tablename__ = 'trip_notes'
    
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    itinerary_id = db.Column(db.Integer, db.ForeignKey('itineraries.id'), nullable=True)  # Optional, for stop-specific notes
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='general')  # general, hotel, transport, contacts, reminders, etc.
    tags = db.Column(db.JSON)  # List of tags for better organization
    is_pinned = db.Column(db.Boolean, default=False)  # Pin important notes to top
    note_date = db.Column(db.Date, nullable=True)  # Optional date for day-specific notes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    trip = db.relationship('Trip', backref='notes')
    itinerary = db.relationship('Itinerary', backref='notes')
    
    def to_dict(self):
        return {
            'id': self.id,
            'trip_id': self.trip_id,
            'itinerary_id': self.itinerary_id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'tags': self.tags or [],
            'is_pinned': self.is_pinned,
            'note_date': self.note_date.isoformat() if self.note_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

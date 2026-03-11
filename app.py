from flask import Flask,redirect,url_for,render_template, request, flash, jsonify
import requests
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  


BASE_URL = "https://api.jikan.moe/v4"

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://192.168.0.2:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]  #important
    }
})

app.config['SECRET_KEY'] = 'f3cfe9ed68c3e1e7d64f24b93e36a5d8'  
app.config['JWT_SECRET_KEY'] = 'a9f8d7s6h5k4j3l2o1i0u9y8t7r6e5w4'  
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///anime.db'      # persistent file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)  # Token valid for 7 days

db = SQLAlchemy(app)
jwt = JWTManager(app)

# database model

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  

    anime_list = db.relationship("ListAnime", backref="user", lazy=True)

class ListAnime(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mal_id = db.Column(db.Integer, nullable=False, index=True)   # MyAnimeList id
    title = db.Column(db.String(300), nullable=False)
    image_url = db.Column(db.String(1000))
    anime_type = db.Column(db.String(50))
    episodes = db.Column(db.Integer)
    status = db.Column(db.String(50), nullable = False) # type of list {Favourite, Watch List}
    added_at = db.Column(db.DateTime, default=datetime.utcnow)


# Create tables if missing (safe to run on every start)
with app.app_context():
    db.create_all()

a = True
def search_anime(name, limit=None):
    """Search anime by name and return list of results."""
    url = f"{BASE_URL}/anime"
    params = {"q": name, "limit": limit}
    response = requests.get(url, params=params)
    print(response.status_code)
    if response.status_code == 200:
        data = response.json()
        return data["data"]  # returns a list of anime objects
    else:
        print(f"Failed to retrieve data {response.status_code}")
        return [] 

def get_top_anime_name():
    top_anime_url = BASE_URL + "/top/anime"
    response = requests.get(top_anime_url)
    if response.status_code == 200:
        anime_data = response.json()
        return anime_data["data"]
    else:
        print(f"Failed to retrieve data {response.status_code}")

def get_anime_name(id):
    url = f"{BASE_URL}/anime/{id}"
    print(url)
    response = requests.get(url)
    if response.status_code == 200:
        anime_data = response.json()
        return anime_data["data"]
    else:
        print(f"Failed to retrieve data {response.status_code}")

@app.route("/register", methods=["POST"])
def register():
    if request.method == "POST":
        data = request.json
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400
        
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400
        
        if Users.query.filter_by(username=username).first():
            return jsonify({"error" : "Username already taken"}), 400
        
        if Users.query.filter_by(email=email).first():
            return jsonify({"error" : "Email already registered"}), 400
        
        user = Users(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered successfully", "user" : {"id": user.id, "username": user.username, "email": user.email}}), 201

@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    data = request.json
    username = data.get("username")
    # email = data.get("email")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    user = Users.query.filter_by(username=username).first()

    # check if user exists with password validation

    if user and check_password_hash(user.password_hash, password):
        token = create_access_token(identity=str(user.id))
        return jsonify({"message": "Login successful", "token": token, "user":{"id": user.id, "username": user.username}}), 200

    return jsonify({"error": "Invalid username or password"}), 401

# @app.route("/profile")
# @jwt_required()
# def profile():
#     user_id = get_jwt_identity()
#     user_id = int(user_id)
#     user = Users.query.get(user_id)

#     if not user:
#         return jsonify({"error": "User not found"}), 404
    
#     return jsonify({
#         "id": user.id,
#         "username": user.username,
#         "email": user.email,
#         "created_at": user.created_at.isoformat()
#     })

@app.route("/profile")
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user_id = int(user_id)
    user = Users.query.get(user_id)

    total_favourite = ListAnime.query.filter_by(user_id=user_id, status="favourite").count()
    total_watchlist = ListAnime.query.filter_by(user_id=user_id, status="watchlist").count()

    recent_anime = ListAnime.query.filter_by(user_id=user_id).order_by(ListAnime.added_at.desc()).limit(3).all()

    return jsonify({
        "users": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at.isoformat()
        },
        "stats": {
            "total_fav": total_favourite,
            "total_watch": total_watchlist,
            "total_anime_saved": total_watchlist + total_favourite 
        },
        "recent_anime": [{
            "id": anime.id,
            "mal_id": anime.mal_id,
            "title": anime.title,
            "image_url": anime.image_url,
            "status": anime.status,
            "added_at": anime.added_at.isoformat()
        } for anime in recent_anime]
    })

#hello

@app.route("/")
def home():
    results = get_top_anime_name()
    return jsonify(results)   

@app.route("/search", methods = ["GET"])
def search():
    q = request.args.get("search","").strip()
    print("this is q: " + q)

    if q:
        print("test")
        results = search_anime(q)
        print(results)
    return jsonify(results)

@app.route("/anime/<int:anime_id>")
@jwt_required(optional=True)
def anime_details(anime_id):
    results = get_anime_name(anime_id)
    
    if not results:
        return jsonify({"error": "Anime not found"}), 404
    
    # check if user logged in
    user_id = get_jwt_identity()
    exists = None

    if user_id is not None:
        user_id = int(user_id)
        print(user_id)
        exists = ListAnime.query.filter_by(mal_id=anime_id, user_id=user_id).first()
    
    is_exists = exists is not None
    db_id = exists.id if exists else None
    validate_status = exists.status if exists else None

    return jsonify({
        "anime_details": results,
        "in_database": is_exists,
        "db_id": db_id,
        "status": validate_status
    })

@app.route("/add_favourite", methods=["POST"])
@jwt_required()
def add_favourite():
    data = request.json
    user_id = get_jwt_identity()
    user_id = int(user_id)

    mal_id = data.get("mal_id")
    title = data.get("title", "")[:300]
    image_url = data.get("image_url", "")
    anime_type = data.get("anime_type", "")
    episodes = data.get("episodes")
    status = data.get("status")  # "favourite" or "watchlist"

    if not mal_id or not title or not status:
        return jsonify({"error": "Missing required fields"}), 400

    # prevent duplicate (simple approach)
    exists = ListAnime.query.filter_by(mal_id=mal_id, user_id=user_id).first() #this code checks the first occurance of the anime in the database
    

    if exists:
        # Update status (move between lists)
        exists.status = status
        db.session.commit()
        return jsonify({
            "message": f"Moved '{title}' to {status}",
            "anime": {
                "id": exists.id,
                "mal_id": exists.mal_id,
                "status": exists.status
            }
        })
    else:
        # Create new entry
        anime = ListAnime(
            user_id=user_id,
            mal_id=mal_id,
            title=title,
            image_url=image_url,
            anime_type=anime_type,
            episodes=episodes,
            status=status
        )
        db.session.add(anime)
        db.session.commit()
        
        return jsonify({
            "anime": {
                "id": anime.id,
                "mal_id": anime.mal_id,
                "status": anime.status
            }
        }), 201

    # go back where the request came from (or home)
    return redirect(url_for('home'))

@app.route("/remove/<int:fav_id>", methods = ["DELETE"])
@jwt_required()
def remove_favourite(fav_id):
    user_id = get_jwt_identity()    
    user_id = int(user_id)

    fav = ListAnime.query.filter_by(id=fav_id, user_id=user_id).first()
    if fav:
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"message": "Anime removed from list"}), 200
    return jsonify({"error": "Anime not found"}), 404

@app.route("/move/<int:fav_id>", methods = ["PUT"])
@jwt_required()
def move_favourite(fav_id):
    user_id = get_jwt_identity()
    user_id = int(user_id)

    fav = ListAnime.query.filter_by(id=fav_id, user_id=user_id).first()
    if fav:
        # Toggle status
        fav.status = "watchlist" if fav.status == "favourite" else "favourite"
        db.session.commit()
        return jsonify({
            "anime": {
                "id": fav.id,
                "mal_id": fav.mal_id,
                "status": fav.status
            }
        }), 200
    return jsonify({"error": "Anime not found"}), 404
# View Favourites
# @app.route("/favourites")
# def favourites():
#     favs = ListAnime.query.filter_by(status="favourite").order_by(ListAnime.added_at.desc()).all()
#     return jsonify([{
#         "id": fav.id,
#         "mal_id": fav.mal_id,
#         "title": fav.title,
#         "image_url": fav.image_url,
#         "anime_type": fav.anime_type,
#         "episodes": fav.episodes,
#         "added_at": fav.added_at.isoformat(),
#         "status" : fav.status
#     } for fav in favs])

# @app.route("/watchlist")
# def watchlist():
#     watchlist = ListAnime.query.filter_by(status = "watchlist").order_by(ListAnime.added_at.desc()).all()
#     return jsonify(
#         [{
#             "id": w.id,
#             "mal_id": w.mal_id,
#             "title": w.title,
#             "image_url": w.image_url,
#             "anime_type": w.anime_type,
#             "episodes": w.episodes,
#             "added_at": w.added_at.isoformat()
#         } for w in watchlist]
#     )

@app.route("/mylist", methods = ["GET"])
@jwt_required()
def get_list():
    status_filter = request.args.get("status")
    user_id = get_jwt_identity()
    user_id = int(user_id)
    print(status_filter)

    if status_filter:
        items = ListAnime.query.filter_by(status=status_filter, user_id=user_id).order_by(ListAnime.added_at.desc()).all()
    else:
        items = ListAnime.query.filter_by(user_id=user_id).order_by(ListAnime.added_at.desc()).all()

    return jsonify(
        [{
            "id": item.id,
            "mal_id": item.mal_id,
            "title": item.title,
            "image_url": item.image_url,
            "anime_type": item.anime_type,
            "episodes": item.episodes,
            "added_at": item.added_at.isoformat(),
            "status": item.status,
            "user_id": item.user_id
        } for item in items]
    )

if __name__ == "__main__":
    app.run(debug=True, port=5000)


# @app.route("/<name>")
# def user(name):
#     if name == "admin":
#         return redirect(url_for("admin"), a = True, content = name)
#     else:
#         return render_template("index.html", a = True, content = name)
    

# @app.route("/admin")
# def admin():
#     if not a:
#         return redirect(url_for("home"))
#     else:
#         return "<h1>ADMIN PAGE</h1>\nFUCK YOU BITCHES"
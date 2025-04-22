from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

app = Flask(__name__) 
CORS(app)

data = {
    'user_id': [1, 1, 2, 2, 3, 3, 3, 4, 4, 4],
    'movie_id': [1, 2, 1, 3, 2, 3, 4, 1, 2, 4],
    'rating': [5, 4, 3, 5, 2, 4, 5, 3, 4, 5]
}
df = pd.DataFrame(data)

X = df[['user_id', 'movie_id']]
y = df['rating']
dt_model = DecisionTreeClassifier()
dt_model.fit(X, y)

def recommend_movies(user_id, num_recommendations=5):
    all_movie_ids = df['movie_id'].unique()
    predicted_ratings = [(movie_id, dt_model.predict([[user_id, movie_id]])[0])
                         for movie_id in all_movie_ids]
    rated = df[df['user_id'] == user_id]['movie_id'].tolist()
    filtered = [{"movie_id": m, "predicted_rating": int(r)}
                for m, r in predicted_ratings if m not in rated]
    filtered.sort(key=lambda x: x['predicted_rating'], reverse=True)
    return filtered[:num_recommendations]

@app.route('/recommend', methods=['GET', 'POST'])
def recommend():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        # Your logic here
        return jsonify({
            "user_id": user_id,
            "recommendations": ["Movie A", "Movie B"]
        })

    elif request.method == 'POST':
        data = request.get_json()
        # Handle POST data
        return jsonify({"recommendations": ["Movie A", "Movie B"]})

if __name__ == '__main__':
    app.run(port=5001)

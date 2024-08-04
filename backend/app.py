from flask import Flask, jsonify, request
from flask_cors import CORS
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from Sentiment import get_youtube_sentiments
from Summary import get_video_summary
from Summary import get_video_transcript
from youtube_results import search_and_fetch_videos

app = Flask(__name__)
CORS(app)

pinecone = Pinecone(api_key="6acb0685-3e9c-4128-8c17-df9997f70cf7", environment="us-west1-gcp")
index = pinecone.Index('youtube-search')

retriever = SentenceTransformer('flax-sentence-embeddings/all_datasets_v3_mpnet-base')

@app.route("/search", methods=["POST"])
def search():
    query = request.json.get("query")

    if query:
        xq = retriever.encode([query]).tolist()
        xc = index.query(vector=xq, top_k=5, include_metadata=True)
        xc_dict = xc.to_dict()
        
        return jsonify(xc_dict), 200
    else:
        return jsonify({"error": "Query is required"}), 400
    
@app.route("/sentiment/<video_id>")
def sentiment(video_id):
    if video_id:
        print(video_id)
        sentiments = get_youtube_sentiments(video_id)
        
        return jsonify(sentiments), 200
    else:
        return jsonify({"error": "Video ID is required"}), 400

@app.route("/summary/<video_id>")
def summary(video_id):
    if video_id:
        summ = get_video_summary(video_id)
        
        return jsonify({"summary":summ}), 200
    else:
        return jsonify({"error": "Video ID is required"}), 400
    
@app.route("/transcript/<video_id>")
def transcript(video_id):
    if video_id:
        trans = get_video_transcript(video_id)
        
        return jsonify({"transcript":trans}), 200
    else:
        return jsonify({"error": "Video ID is required"}), 400

@app.route("/ytsearch/<query>")
def ytsearch(query):
    if query:
        videos = search_and_fetch_videos(query, max_results=1)
        
        return jsonify({"videos":videos}), 200
    else:
        return jsonify({"error": "Search query is required"}), 400

if __name__ == "__main__":
    app.run(debug=True)
   
from flask import Flask, render_template, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline
import tf_keras as keras
app = Flask(__name__)

# Load the summarization pipeline
summarizer = pipeline("summarization")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/summarize", methods=["POST"])
def summarize_transcript():
    try:
        video_url = request.form["video_url"]
        video_id = video_url.split("watch?v=")[1]  # Basic ID extraction

        # Fetch the transcript
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        full_transcript = " ".join([entry['text'] for entry in transcript])

        # Summarize the transcript (using a sliding window approach for long transcripts)
        max_chunk = 500
        summaries = []
        for i in range(0, len(full_transcript), max_chunk):
          chunk = full_transcript[i:i + max_chunk]
          if len(chunk) > 50: # Only summarize if chunk length is reasonable.
            summary = summarizer(chunk, max_length=150, min_length=30, do_sample=False)[0]['summary_text']
            summaries.append(summary)
        
        final_summary = " ".join(summaries)


        return jsonify({"summary": final_summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

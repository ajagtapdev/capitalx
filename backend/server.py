# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import base64
from flask import (
    Flask,
    request,
    Response,
    stream_with_context
)
from flask_cors import CORS
import google.generativeai as genai
from google.genai import types
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
from google import genai as google_genai
from dotenv import load_dotenv
import os
from google.cloud import vision
from pydantic import BaseModel

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="You are a helpful assistant in an app that helps users choose the best credit card for each transaction depending on the card's rewards and benefits."
)

class Details(BaseModel):
    apr: str
    benefits: list[str]

class CardResponse(BaseModel):
    couldIdentify: bool
    name: str
    details: Details

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    msg = data.get('chat', '')
    chat_history = data.get('history', [])

    chat_session = model.start_chat(history=chat_history)

    response = chat_session.send_message(msg)

    return {"text": response.text}

@app.route('/identify-card', methods=['POST'])
def identify_card():
    if 'image' not in request.files:
        return {"error": "No image file provided"}, 400
    
    file = request.files['image']
    if file.filename == '':
        return {"error": "No selected file"}, 400

    client = google_genai.Client()

    google_search_tool = Tool(
        google_search=GoogleSearch()
    )
    
    try:
        # Read the file data
        image_data = file.read()
        
        # Create Gemini prompt with grounding
        prompt = """Search for this card, and if it can be identified as a specific card, list the card benefits/rewards and state the name of the type of card. Keep each field as concise as possible.
        Use this JSON schema:
        
        {
            "type": "object",
            "properties": {
                "name": {
                "type": "string",
                "description": "The name of the item or entity."
                },
                "details": {
                "type": "object",
                "description": "An object containing APR and a list of benefits.",
                "properties": {
                    "apr": {
                    "type": "string",
                    "description": "The APR value as a string."
                    },
                    "benefits": {
                    "type": "array",
                    "description": "An array of strings listing benefits.",
                    "items": {
                        "type": "string"
                    }
                    }
                },
                "required": [
                    "apr",
                    "benefits"
                ]
                },
                "couldIdentify": {
                "type": "boolean",
                "description": "A boolean indicating whether the entity could be identified."
                }
            },
            "required": [
                "name",
                "details",
                "couldIdentify"
            ]
        }
        """
        
        # Generate content with image
        response = client.models.generate_content(
            contents=[prompt, types.Part.from_bytes(data=image_data, mime_type=file.content_type)],
            model="gemini-2.0-flash",
            config=GenerateContentConfig(
                tools=[google_search_tool],
                temperature=0,
            ),
        )
        
        # Parse the response to extract card information
        response_text = response.text
        
        return response_text
        
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(port=3001)
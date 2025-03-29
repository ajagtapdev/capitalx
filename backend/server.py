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
from flask import (
    Flask,
    request,
    Response,
    stream_with_context
)
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="You are a helpful assistant in an app that helps users choose the best credit card for each transaction depending on the card's rewards and benefits."
)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    msg = data.get('chat', '')
    chat_history = data.get('history', [])

    chat_session = model.start_chat(history=chat_history)

    response = chat_session.send_message(msg)

    return {"text": response.text}

if __name__ == '__main__':
    app.run(port=3001)
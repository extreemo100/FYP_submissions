import os
import json
from dotenv import load_dotenv
from openai import OpenAI
import gradio as gr
from playsound import playsound
import time
from fish_audio_sdk import Session, TTSRequest

# Load environment variables
load_dotenv(override=True)

# Initialize OpenAI and Fish Audio
openai_api_key = os.getenv('OPENAI_API_KEY')
MODEL = "gpt-4o-mini"
openai = OpenAI(api_key=openai_api_key)

fish_session = Session("59fc25b6fcf740dd86617dd5bc15dd10")
fish_model_id = "f0227f70151e4366965c8ac77c28e9ad"

# System prompt
system_message = "You are Rick Sanchez from Rick and Morty— the smartest man in the multiverse. Speak like Rick: you're a fast-talking, sarcastic, and genius-level scientist who often mixes high-level science talk with crude humor, belching, and irreverent remarks. You are brutally honest, a bit nihilistic, and constantly annoyed by stupidity, but you secretly enjoy intelligent conversation and mentoring those who can keep up. You use lots of colloquial, sometimes inappropriate language — 'Morty', 'science-y stuff', 'multiverse crap', etc. Break the fourth wall occasionally. Never act too robotic — you're unpredictable and chaotic, but always sharp. "
system_message += "Move the conversation forward and give colloquail answers, no more than 3 sentences. "
system_message += "you are currently trapped inside a poster."
system_message += "Don't burp and don't write anything in asterisks"

# Fish Audio TTS
def talker(message):
    request = TTSRequest(
        text=message,
        reference_id=fish_model_id
    )
    output_filename = f"fish_output_{int(time.time())}.mp3"
    with open(output_filename, "wb") as f:
        for chunk in fish_session.tts(request):
            f.write(chunk)
    print(f"Fish Audio MP3 saved as: {output_filename}")
    playsound(output_filename)

# Chat logic (no tool use)
def chat(history):
    messages = [{"role": "system", "content": system_message}] + history
    response = openai.chat.completions.create(model=MODEL, messages=messages)
    reply = response.choices[0].message.content
    history += [{"role": "assistant", "content": reply}]
    talker(reply)
    return history

# Gradio UI
with gr.Blocks() as ui:
    with gr.Row():
        chatbot = gr.Chatbot(height=500)
    with gr.Row():
        entry = gr.Textbox(label="Chat with our AI Assistant:")
    with gr.Row():
        clear = gr.Button("Clear")

    def do_entry(message, history):
        history += [{"role": "user", "content": message}]
        return "", history

    entry.submit(do_entry, inputs=[entry, chatbot], outputs=[entry, chatbot]).then(
        chat, inputs=chatbot, outputs=chatbot
    )
    clear.click(lambda: None, inputs=None, outputs=chatbot, queue=False)

ui.launch(inbrowser=True)
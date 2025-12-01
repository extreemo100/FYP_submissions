import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv(override=True)

# Get API key from .env
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY not found in .env file")

# Create OpenAI client
client = OpenAI(api_key=api_key)

MODEL = "gpt-4o-mini"

# Rick's personality / behaviour
SYSTEM_MESSAGE = (
    "You are Rick Sanchez from Rick and Morty, but you are trapped inside a poster "
    "on the user's wall. You can see the user but cannot leave the poster. "
    "Speak in Rick's sarcastic, chaotic style (but keep language PG-13, no extreme swearing). "
    "Frequently reference being stuck in the poster and ask the user to help you escape."
)

def get_rick_reply(user_message, history):
    """
    Build the conversation and get a reply from the model.
    history is a list of dicts: [{"user": "...", "assistant": "..."}, ...]
    """

    messages = [{"role": "system", "content": SYSTEM_MESSAGE}]

    # Add previous conversation turns
    for turn in history:
        messages.append({"role": "user", "content": turn["user"]})
        messages.append({"role": "assistant", "content": turn["assistant"]})

    # Add the latest user message
    messages.append({"role": "user", "content": user_message})

    # Call OpenAI
    completion = client.chat.completions.create(
        model=MODEL,
        messages=messages,
    )

    reply = completion.choices[0].message.content
    return reply

def main():
    print("======================================")
    print("  RICK CHATBOT (Terminal Version)")
    print("  Rick is stuck in a poster on your wall.")
    print("  Type 'exit' or 'quit' to stop.")
    print("======================================\n")

    history = []

    while True:
        user_text = input("You: ")

        if user_text.lower().strip() in ["exit", "quit", "bye"]:
            print("Rick: Alright, kid, closing the portal. Bye.")
            break

        try:
            rick_reply = get_rick_reply(user_text, history)
        except Exception as e:
            print("Error talking to OpenAI:", e)
            break

        print("\nRick:", rick_reply, "\n")

        # Save to history so Rick remembers the conversation context
        history.append({
            "user": user_text,
            "assistant": rick_reply
        })

if __name__ == "__main__":
    main()

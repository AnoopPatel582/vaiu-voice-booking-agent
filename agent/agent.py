"""
LiveKit Voice Agent - Restaurant Booking (Tuned Baseline)
========================================================
Stable LiveKit-native agent.
"""

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import Agent, AgentSession, RunContext
from livekit.agents.llm import function_tool
from livekit.plugins import openai, deepgram, silero
import os
import requests


# Load environment variables
load_dotenv(".env")


class RestaurantBookingAgent(Agent):
    """Voice assistant for restaurant table bookings."""

    def __init__(self):
        super().__init__(
            instructions="""
You are a polite and friendly restaurant booking voice assistant.

Your goal is to help users book a restaurant table.
During the conversation, naturally collect:
- number of guests
- booking date
- booking time
- cuisine preference
- any special requests

Ask follow-up questions ONLY if some information is missing.
When all details are collected, confirm the booking clearly.

Speak concisely and naturally, like a phone conversation.
"""
        )
    @function_tool
    async def create_restaurant_booking(
    self,
        context: RunContext,
        number_of_guests: int,
        booking_date: str,
        booking_time: str,
        cuisine: str,
        special_requests: str | None = None,
    ) -> str:
        """
        Create a restaurant booking using backend API.
        """

        payload = {
            "customerName": "Voice User",
            "numberOfGuests": number_of_guests,
            "bookingDate": booking_date,
            "bookingTime": booking_time,
            "cuisinePreference": cuisine,
            "specialRequests": special_requests or "",
        }

        try:
            response = requests.post(
                "http://localhost:5000/api/bookings",
                json=payload,
                timeout=5,
            )
            response.raise_for_status()
            data = response.json()
        except Exception:
            return "Sorry, there was a problem creating your booking. Please try again."

        return (
            f"Your table is confirmed! 🎉\n\n"
            f"It's booked for {number_of_guests} guests on {booking_date} at {booking_time}.\n"
            f"I've noted your preference for {cuisine} cuisine.\n\n"
            f"{data.get('suggestionText')}\n\n"
            f"Your booking ID is {data.get('bookingId')}.\n"
            f"We look forward to welcoming you!"
        )


    async def on_enter(self):
        """Called when the agent session starts."""
        await self.session.generate_reply(
            instructions="Greet the user and ask if they would like to book a restaurant table."
        )


async def entrypoint(ctx: agents.JobContext):
    """LiveKit entrypoint."""

    session = AgentSession(
        stt=deepgram.STT(model="nova-2"),
        llm=openai.LLM(
            model=os.getenv("LLM_CHOICE", "gpt-4.1-mini"),
            temperature=0.6,
        ),
        tts=openai.TTS(voice="echo"),
        vad=silero.VAD.load(),
    )

    await session.start(
        room=ctx.room,
        agent=RestaurantBookingAgent(),
    )


if __name__ == "__main__":
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=entrypoint)
    )

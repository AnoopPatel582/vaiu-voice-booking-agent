import { Room, RoomEvent } from "livekit-client";
import { useRef, useState } from "react";

export function useLiveKit() {
  const roomRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const connect = async () => {
    try {
      setError(null);

      // 1️⃣ Fetch connection details from backend
      const res = await fetch("http://localhost:5000/api/livekit-token", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch LiveKit token");
      }

      const { serverUrl, participantToken } = await res.json();

      // 2️⃣ Create LiveKit room
      const room = new Room();
      roomRef.current = room;

      // 3️⃣ Subscribe to transcription events BEFORE connecting
      room.on(RoomEvent.TranscriptionReceived, (segments) => {
        setMessages((prev) => {
          const updated = [...prev];

          segments.forEach((seg) => {
            if (!seg.text) return;

            const speaker =
              seg.participant?.identity?.startsWith("frontend_user")
                ? "user"
                : "agent";

            updated.push({
              speaker,
              text: seg.text,
              isFinal: seg.isFinal,
              timestamp: new Date().toLocaleTimeString(),
            });
          });

          return updated;
        });
      });


      // 4️⃣ Connect to LiveKit 
      await room.connect(serverUrl, participantToken);
      console.log("CONNECTED");
      room.on("trackSubscribed", (track, publication, participant) => {
        if (track.kind === "audio") {
          console.log("🔊 Remote audio track from:", participant.identity);

          const audioEl = document.createElement("audio");
          audioEl.srcObject = new MediaStream([track.mediaStreamTrack]);
          audioEl.autoplay = true;
          audioEl.playsInline = true;

          document.body.appendChild(audioEl);
        }
      });


      // 5️⃣ Enable microphone
      await room.localParticipant.setMicrophoneEnabled(true);

      setIsConnected(true);
      setIsListening(true);
    } catch (err) {
      console.error("LiveKit connection error:", err);
      setError("Failed to connect to voice agent");
    }
  };

  const disconnect = () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }

    setIsConnected(false);
    setIsListening(false);
  };

  return {
    connect,
    disconnect,
    isConnected,
    isListening,
    messages,
    error,
  };
}

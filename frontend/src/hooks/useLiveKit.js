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

      // Basic room lifecycle hooks (no logging needed in production)
      room.on(RoomEvent.Connected, () => {});
      room.on(RoomEvent.Reconnecting, () => {});
      room.on(RoomEvent.Reconnected, () => {});
      room.on(RoomEvent.Disconnected, () => {});

      // 3️⃣ Helper function to process transcription segments
      const processTranscriptionSegment = (seg, speaker) => {
        if (!seg.text) return;

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          // Use seg.final (not seg.isFinal) - this is the correct property name
          const isFinal = seg.final === true;

          // Only update if:
          // 1. There is a last message
          // 2. It's from the same speaker
          // 3. It's NOT final (once final, never update it again)
          if (last && last.speaker === speaker && !last.isFinal) {
            // Update the existing non-final message
            updated[updated.length - 1] = {
              ...last,
              text: seg.text,
              isFinal: isFinal,
              timestamp: new Date().toLocaleTimeString(),
            };
          } else {
            // Append a new message (different speaker, or last message is final, or no last message)
            updated.push({
              speaker,
              text: seg.text,
              isFinal: isFinal,
              timestamp: new Date().toLocaleTimeString(),
            });
          }

          return updated;
        });
      };

      // 4️⃣ Subscribe to transcription events at the room level
      room.on(
        RoomEvent.TranscriptionReceived,
        (segments, participant /*, publication */) => {
          const segmentsArray = Array.isArray(segments)
            ? segments
            : segments?.segments ||
              segments?.transcriptionSegments ||
              [];

          const local = room.localParticipant;

          let isUser = false;
          if (participant && local) {
            if (
              participant.identity &&
              local.identity &&
              participant.identity === local.identity
            ) {
              isUser = true;
            } else if (
              participant.sid &&
              local.sid &&
              participant.sid === local.sid
            ) {
              isUser = true;
            } else if (
              typeof participant.identity === "string" &&
              participant.identity.startsWith("frontend_user")
            ) {
              isUser = true;
            }
          }

          const speaker = isUser ? "user" : "agent";

          segmentsArray.forEach((seg) => {
            processTranscriptionSegment(seg, speaker);
          });
        }
      );

      // 5️⃣ Connect to LiveKit 
      await room.connect(serverUrl, participantToken);

      // 6️⃣ Handle audio track subscriptions for playback
      room.on("trackSubscribed", (track, publication, participant) => {
        if (track.kind === "audio") {
          // Set up audio playback
          const audioEl = document.createElement("audio");
          audioEl.srcObject = new MediaStream([track.mediaStreamTrack]);
          audioEl.autoplay = true;
          audioEl.playsInline = true;
          document.body.appendChild(audioEl);
        }
      });
      
      // 7️⃣ Enable microphone
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
    setMessages([]); // Clear messages on disconnect
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

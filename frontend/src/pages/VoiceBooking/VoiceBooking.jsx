import Controls from "./Controls";
import TranscriptPanel from "./TranscriptPanel";
import { useLiveKit } from "../../hooks/useLiveKit";

function VoiceBooking() {

  const {
  connect,
  disconnect,
  isConnected,
  isListening,
  messages,
  error,
} = useLiveKit();

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Voice Booking</h2>

      <Controls
        onStart={connect}
        onStop={disconnect}
        isConnected={isConnected}
        isListening={isListening}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <TranscriptPanel messages={messages} />
    </div>
  );
}

export default VoiceBooking;

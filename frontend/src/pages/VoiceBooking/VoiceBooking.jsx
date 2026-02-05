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
    <section className="voice-booking-card">
      <h2>Voice Booking</h2>

      <Controls
        onStart={connect}
        onStop={disconnect}
        isConnected={isConnected}
        isListening={isListening}
      />

      {error && <p className="error-text">{error}</p>}

      <TranscriptPanel messages={messages} />
    </section>
  );
}

export default VoiceBooking;

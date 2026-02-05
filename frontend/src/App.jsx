import VoiceBooking from "./pages/VoiceBooking/VoiceBooking";

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Restaurant Booking Voice Agent</h1>
        <p className="app-subtitle">
          Speak to an AI agent to book a table in seconds.
        </p>
      </header>

      <VoiceBooking />
    </div>
  );
}

export default App;

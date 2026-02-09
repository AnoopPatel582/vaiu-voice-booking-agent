function Controls({ onStart, onStop, isConnected, isListening }) {
  return (
    <div className="controls">
      <div className="controls-buttons">
        <button className="primary" onClick={onStart} disabled={isConnected}>
          Start Booking
        </button>

        <button className="secondary" onClick={onStop} disabled={!isConnected}>
          Stop
        </button>
      </div>

      <div className="status-text">
        Status: {isListening ? "Listening..." : "Idle"}
      </div>
    </div>
  );
}

export default Controls;

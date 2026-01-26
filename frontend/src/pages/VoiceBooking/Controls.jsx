function Controls({ onStart, onStop, isConnected, isListening }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={onStart} disabled={isConnected}>
        Start Booking
      </button>

      <button onClick={onStop} disabled={!isConnected} style={{ marginLeft: "10px" }}>
        Stop
      </button>

      <div style={{ marginTop: "10px", fontSize: "14px" }}>
        Status: {isListening ? "Listening..." : "Idle"}
      </div>
    </div>
  );
}

export default Controls;

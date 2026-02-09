function TranscriptPanel({ messages }) {
  return (
    <div className="transcript-panel">
      {messages.map((msg, index) => (
        <div key={index} className="transcript-message">
          <span
            className={
              "transcript-speaker " +
              (msg.speaker === "user" ? "user" : "agent")
            }
          >
            {msg.speaker === "user" ? "You" : "Agent"}:
          </span>
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export default TranscriptPanel;

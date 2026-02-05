// function TranscriptPanel({ messages }) {
//   return (
//     <div
//       style={{
//         border: "1px solid #ccc",
//         padding: "10px",
//         height: "250px",
//         overflowY: "auto",      
//       }}
//     >
//       {messages.map((msg, index) => (
//         <div key={index} style={{ marginBottom: "8px" }}>
//           <strong>{msg.speaker === "user" ? "You" : "Agent"}:</strong>{" "}
//           {msg.text}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default TranscriptPanel;
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

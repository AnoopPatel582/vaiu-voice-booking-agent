const express = require("express");
const { AccessToken } = require("livekit-server-sdk");
const { RoomConfiguration } = require("@livekit/protocol");

const router = express.Router();

router.post("/livekit-token", async (req, res) => {
  try {
    // 1️⃣ Validate env vars
    if (!process.env.LIVEKIT_API_KEY) {
      throw new Error("LIVEKIT_API_KEY is not defined");
    }
    if (!process.env.LIVEKIT_API_SECRET) {
      throw new Error("LIVEKIT_API_SECRET is not defined");
    }
    if (!process.env.LIVEKIT_URL) {
      throw new Error("LIVEKIT_URL is not defined");
    }

    // 2️⃣ Create unique room + participant identity
    const roomName = `restaurant_room_${Date.now()}`;
    const participantIdentity = `frontend_user_${Math.floor(
      Math.random() * 10_000
    )}`;

    // 3️⃣ Create access token
    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantIdentity,
        ttl: 15*60,
      }
    );
    // 4️⃣ Add REQUIRED grants
    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });

    // 5️⃣ 🔥 Attach agent dynamically (CRITICAL)
    token.roomConfig = new RoomConfiguration({
      agents: [
        {
          agentName: "restaurant-booking-agent", // must match agent name
        },
      ],
    });

    // 6️⃣ Sign JWT
    const jwt = await token.toJwt();

    // 7️⃣ Return FULL connection details
    res.json({
      serverUrl: process.env.LIVEKIT_URL,
      roomName,
      participantToken: jwt,
      participantIdentity,
    });
  } catch (err) {
    console.error("LiveKit token error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

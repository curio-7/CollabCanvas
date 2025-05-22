import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

// Enum-style message types for type safety
const MESSAGE_TYPES = {
  JOIN: "join_room",
  LEAVE: "leave_room",
  CHAT: "chat",
} as const;

// User structure
interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

// Use a Map instead of an array for O(1) access
const users = new Map<WebSocket, User>();

// Verify JWT and return userId
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded || !("userId" in decoded)) {
      return null;
    }
    return (decoded as any).userId;
  } catch (e) {
    return null;
  }
}

// Broadcast helper to send message to all users in a room
function broadcastToRoom(roomId: string, payload: any) {
  for (const user of users.values()) {
    if (user.rooms.includes(roomId)) {
      user.ws.send(JSON.stringify(payload));
    }
  }
}

const wss = new WebSocketServer({ port: 8080 });

// Heartbeat mechanism setup
wss.on("connection", function connection(ws, request) {
  console.log("New WebSocket connection established");

  // Setup heartbeat
  (ws as any).isAlive = true;
  ws.on("pong", () => {
    (ws as any).isAlive = true;
  });

  const url = request.url;
  if (!url) {
    console.error("No URL provided in request");
    ws.close(1008, "No URL provided");
    return;
  }

  const params = new URLSearchParams(url.split("?")[1]);
  const token = params.get("token");
  if (!token) {
    console.error("No token provided in request");
    ws.close(1008, "No token provided");
    return;
  }

  const userId = checkUser(token);
  if (userId == null) {
    console.error("Invalid token, closing connection");
    ws.close(1008, "Unauthorized");
    return;
  }

  // Store user in Map
  users.set(ws, {
    userId,
    rooms: [],
    ws,
  });

  console.log(`User ${userId} connected`);

  // On WebSocket close, clean up user
  ws.on("close", () => {
    users.delete(ws);
    console.log(`Connection closed for user ${userId}`);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  // Handle incoming messages
  ws.on("message", async function message(data) {
    console.log("message received")
  console.log(data);
    let parsedData: any;

    try {
      parsedData = typeof data === "string" ? JSON.parse(data) : JSON.parse(data.toString());
    } catch (err) {
      console.error("Invalid JSON received:", err);
      ws.send(JSON.stringify({ error: "Invalid JSON format" }));
      return;
    }

    console.log("Parsed data:", parsedData);
    if (!parsedData.type) {
      ws.send(JSON.stringify({ error: "Missing message type" }));
      return;
    }

    const user = users.get(ws);
    if (!user) return;

    switch (parsedData.type) {
      case MESSAGE_TYPES.JOIN:
        if (parsedData.roomId) {
          user.rooms.push(parsedData.roomId);
          console.log(`User ${user.userId} joined room ${parsedData.roomId}`);
        }
        break;

      case MESSAGE_TYPES.LEAVE:
        if (parsedData.room) {
          user.rooms = user.rooms.filter((roomId) => roomId !== parsedData.room);
          console.log(`User ${user.userId} left room ${parsedData.room}`);
        }
        break;

      case MESSAGE_TYPES.CHAT:
        //add redis here to pubsub and stuffs
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        if (!roomId || !message) {
          ws.send(JSON.stringify({ error: "Missing roomId or message in chat" }));
          return;
        }

        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId: user.userId,
          },
        });

        broadcastToRoom(roomId, {
          type: MESSAGE_TYPES.CHAT,
          message,
          roomId,
        });

        break;

      default:
        ws.send(JSON.stringify({ error: "Unknown message type" }));
    }
  });

  // Initial ping
  ws.send(JSON.stringify({ type: "connection_acknowledged" }));
});

// Periodic ping to detect dead clients
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if ((ws as any).isAlive === false) {
      console.log("Terminating stale connection");
      return ws.terminate();
    }

    (ws as any).isAlive = false;
    ws.ping();
  });
}, 300000);

// Clear interval on server shutdown
wss.on("close", () => {
  clearInterval(interval);
});

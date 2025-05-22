"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/room/${roomId}`);
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === "Enter" && roomId.trim()) {
      handleJoinRoom();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-black">
      <div className="w-full max-w-xs">
        <h1 className="text-2xl font-bold mb-4 text-white">Join a Room</h1>
        
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter room ID"
          className="w-full p-2 mb-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
        />
        
        <button
          onClick={handleJoinRoom}
          disabled={!roomId.trim()}
          className="w-full p-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Join Room
        </button>
        
        <p className="mt-4 text-sm text-gray-400">
          Need a room ID? Create a new room or ask a friend to share theirs.
        </p>
      </div>
    </div>
  );
}
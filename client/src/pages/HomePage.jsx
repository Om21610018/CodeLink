import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  function joinRoom() {
    if (!roomId && !username) {
      toast.error("Both the field are required");
      return;
    }
    setRoomId(roomId);
    navigate(`/editor/${roomId}`, {
      state: {
        username,
        roomId,
      },
    });
    toast.success("Room Created Successfully");
  }
  console.log(roomId);

  function generateRoomId(e) {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("RoomId Generated Successfully!!!");
  }
  return (
    <div className=" h-screen w-full flex flex-col justify-center items-center text-white">
      <div className=" flex flex-col w-[500px] max-w-[90%]   justify-center py-5 px-8 bg-slate-700 rounded-lg">
        <p className=" text-4xl font-bold mb-4">CodeLink 🔗 </p>
        <h4 className=" mb-5">Paste Invitation Room Id : </h4>
        <div className=" flex flex-col gap-y-3">
          <input
            className=" px-3 py-1 rounded-md outline-none border-none bg-gray-300 text-black"
            type="text"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            className=" px-3 py-1 rounded-md outline-none border-none bg-gray-300 text-black"
            type="text"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={joinRoom}
            className=" font-bold hover:bg-green-600 transition-all duration-200 py-2 px-5 rounded-xl bg-green-500"
          >
            Join
          </button>
          <span>
            If you don't have an invite then create{" "}
            <a
              onClick={generateRoomId}
              href=""
              className=" hover:text-green-700 transition-all duration-200 underline text-green-700 createNewBtn"
            >
              new room
            </a>
          </span>
        </div>
      </div>
      <footer className=" fixed bottom-2">
        <h4 className=" opacity-50 ">
          Build with ❤️ by <span className="  text-green-500">namo</span>
        </h4>
      </footer>
    </div>
  );
}

export default HomePage;

import React, { useEffect, useRef, useState } from "react";
import Editor from "../component/Editor";
import Client from "../component/Client";
import { initSocket } from "../socket";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
function EditorPage() {
  const codeRef = useRef(null);
  const [clients, setClients] = useState([]);
  const location = useLocation();
  const roomId = location.state.roomId;
  const socketRef = useRef(null);
  const navigate = useNavigate();

  //when the value in it changes then page will not get render
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (error) => {
        handleError(err);
      });
      socketRef.current.on("connect_failed", (err) => {
        handleError(err);
      });
      const handleError = (e) => {
        console.log(`socket error ${e}`);
        toast.error("Failed to connect");
        <Navigate to={"/"}></Navigate>;
      };
      socketRef.current.emit("join", {
        roomId: roomId,
        username: location.state?.username,
      });
      socketRef.current.on(
        "joined",
        async ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
          }
          setClients(clients);

          socketRef.current.emit("synccode", {
            code: codeRef.current,
            socketId: socketId,
          });
        }
      );
      //disconnecting code
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} leaved the room`);
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off();
    };
  }, []);

  async function copyRoomId() {
    try {
      // console.log(roomId);
      const id = await navigator.clipboard.writeText(location.state.roomId);
      toast.success("RoomId Copied", id);
    } catch (err) {
      toast.error("Could not copy RoomId");
      console.log(err);
    }
  }

  function leaveRoom() {
    navigate("/");
  }
  if (!location.state) return <Navigate to={"/"}></Navigate>;

  return (
    <div className="text-white flex flex-col md:flex-row lg:flex-row">
      <div className="leftwalapart  md:h-screen lg:h-screen md:w-1/3 lg:w-1/4 w-full bg-black p-8 flex-grow flex-shrink overflow-auto">
        <div className="asroomIdeInner flex flex-col">
          <p className="text-3xl font-bold mb-3">CodeLink</p>
          <h3 className="font-semibold text-lg">Connected</h3>
          <div className="mt-2 mb-4 flex flex-wrap gap-3 max-h-60vh overflow-y-auto">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <div className="flex justify-center flex-col lg:fixed md:fixed bottom-5 gap-y-3">
          <button
            onClick={copyRoomId}
            className="font-bold hover:bg-green-600 transition-all duration-200 py-2 px-5 rounded-xl bg-green-500"
          >
            Copy ROOM roomId
          </button>
          <button
            onClick={leaveRoom}
            className="font-bold hover:bg-red-600 transition-all duration-200 py-2 px-5 rounded-xl bg-red-500"
          >
            Leave
          </button>
        </div>
      </div>
      <div className=" max-w-[100%] md:w-2/3 lg:w-3/4 Rightwalapart h-screen bg-red-400 flex-grow">
        <Editor
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          socketRef={socketRef}
          roomId={roomId}
        />
      </div>
    </div>
  );
}

export default EditorPage;

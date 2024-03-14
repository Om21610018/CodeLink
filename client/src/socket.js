import { io } from "socket.io-client";

export const initSocket = async () => {
  const option = {
    "force new connection": true,
    transports: ["websocket"],
    reconnectionAttemp: "infinity",
    timeout: 10000,
  };
  return io("http://localhost:5000", option);
};

import React from "react";
import Avatar from "react-avatar";

function Client({ username }) {
  // Get the first ten letters of the username
  const truncatedUsername = username.slice(0, 8);

  // Check if the username is longer than ten letters
  const isLongUsername = username.length > 8;

  return (
    <div className="cursor-pointer flex flex-col w-fit justify-center items-center">
      <Avatar name={username} size={50} className="rounded-xl" />
      <span className="text-xs font-semibold">
        {isLongUsername ? truncatedUsername + ".." : username}
      </span>
    </div>
  );
}

export default Client;

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = ({ match }) => {
  const [chatName, setchatName] = useState("");
  useEffect(async () => {
    console.log("Hello");
    apiCall();
  }, []);

  const apiCall = async () => {
    const { data } = await axios.get(`/api/chats/${match.params.id}`);
    setchatName(data);
    // console.log(data);
  };

  return <div>{chatName}</div>;
};

export default ChatPage;

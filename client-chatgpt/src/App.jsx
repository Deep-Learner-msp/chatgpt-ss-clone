import { useState } from "react";
import ChatBody from "./components/ChatBody";
import ChatInput from "./components/ChatInput";
import { useMutation } from "react-query";
import { fetchResponse } from "./api";
import ResponseItem from "./components/ResponseItem";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Typewriter from "typewriter-effect";

function App() {
  const [chat, setChat] = useState([]);
  const [stopResponse, setStopResponse] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      return fetchResponse(chat);
    },
    onSuccess: (data) => {
      console.log("Data:", data);
      if (!stopResponse && data && data.message) {
        const aiMessage = data.message.replace(/^\n\n/, "");
        console.log("AI Message:", aiMessage);
      
        setChat((prev) => [
          ...prev,
          {
            sender: "ai",
            message: aiMessage,
            feedback: "",
          },
        ]);
      } else {
        console.error(
          "Data is undefined or missing the 'content' property:",
          data
        );
      }
      
    },
    
  });

  const sendFeedback = async (userQuery, response, message, feedback) => {
    try {
      await fetch("http://localhost:3080/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_query: userQuery,
          response: response,
          message: message, // Add message field to the request body
          feedback: feedback,
        }),
      });
      console.log("Feedback sent:", userQuery, response, message, feedback);
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };
  
  const handleFeedback = async (feedback) => {
    const user_query = chat[chat.length - 2].message;
    const response = chat[chat.length - 1].message;
    const newChat = [...chat];
    newChat[newChat.length - 1] = {
      ...newChat[newChat.length - 1],
      feedback: feedback === "dislike" ? "dislike" : "",
    };
    setChat(newChat);
    await Promise.resolve(sendFeedback(user_query, response, newChat[newChat.length - 2].message, feedback === "dislike" ? "dislike" : ""));
  };
  
  const sendMessage = async (message) => {
    await Promise.resolve(setChat((prev) => [...prev, message]));
    mutation.mutate();
  };
  return (
    <div className="bg-[#1A232E] h-screen py-6 relative sm:px-16 px-12 text-white overflow-hidden flex flex-col justify-between align-middle">
      {/* gradients */}
      <div className="gradient-01 z-0 absolute"></div>
      <div className="gradient-02 z-0 absolute"></div>
  
      {/* header */}
      <header className="text-center mb-3">
        <h1 className="font-bold text-3xl md:text-4xl text-[#FBFFFF] mb-1 tracking-wider">StateStreet GenAIus</h1>
        <p className="text-base md:text-lg font-light text-[#FBFFFF] opacity-60 tagline" style={{ fontFamily: 'San Francisco' }}>Discover the Boundless Potential of Generative AI</p>
      </header>
  
      {/* body */}
      <div className="h-[90%] overflow-auto w-full max-w-4xl min-w-[20rem] py-8 px-4 self-center scrollbar-thumb-slate-400 scrollbar-thin scrollbar-track-gray-tranparent scrollbar-thumb-rounded-md">
        <ChatBody chat={chat} handleFeedback={handleFeedback} />
      </div>
  
      {/* input */}
      <div className="w-full max-w-4xl min-w-[20rem] self-center">
        <ChatInput sendMessage={sendMessage} loading={mutation.isLoading} />
      </div>
    </div>
  );
  
  
  
  
  
}

export default App;
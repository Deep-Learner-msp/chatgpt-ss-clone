import React, { useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { useEffect } from "react";
import ResponseItem from "./ResponseItem";

const ChatBody = ({ chat = [], handleFeedback }) => {
  const aiStyle =
    "bg-white bg-opacity-40 backdrop-blur-lg dropshadow-md mr-auto";

  const parent = useRef(null);
  const bottomRef = useRef(null);

  // only for auto animations
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  // for scrolling bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="flex flex-col gap-4" ref={parent}>
      {chat.map((message, i) => {
  if (message.sender === "ai") {
    console.log("Rendering AI message:", message.message); // Add this line
    return (
      <ResponseItem
        key={i}
        message={message.message}
        aiStyle={aiStyle}
        onFeedback={handleFeedback} // pass the handleFeedback prop
      />
    );
  } else {
    return (
      <div
        key={i}
        className={`border-[#999999] break-words border-2 rounded-xl self-end px-3 py-3 max-w-[80%]`}
      >
        <pre className="whitespace-pre-wrap">
          <span>{message.message}</span>
        </pre>
      </div>
    );
  }
})}


      <div ref={bottomRef} className="h-3"></div>
    </div>
  );
};

export default ChatBody;

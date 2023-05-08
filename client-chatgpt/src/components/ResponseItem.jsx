import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const useTypewriterEffect = (text, typingSpeed = 30) => {
  const [displayText, setDisplayText] = useState("");
  let index = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prevText) => prevText + text[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [text, typingSpeed]);

  return displayText;
};

const pythonCodeRegex = /(?:def|class|import|from|if|elif|else|while|for|return|try|except|with|print|yield)\b/;

const ResponseItem = ({ message, index, onFeedback, aiStyle }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleLike = () => {
    setLiked(true);
    setDisliked(false);
    onFeedback("like", index);
  };

  const handleDislike = () => {
    setLiked(false);
    setDisliked(true);
    onFeedback("dislike", index);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

    // const displayMessage = useTypewriterEffect(message);
  const displayMessage = message ;
  const isCodeSnippet = pythonCodeRegex.test(message);

  return (
    <div className={`border-[#999999] break-words border-2 rounded-xl self-start px-3 py-3 max-w-[80%] ${aiStyle}`}>
      <pre className="whitespace-pre-wrap">
        <span>{displayMessage}</span>
      </pre>
      {isCodeSnippet && (
        <div className="copy-code">
          <button onClick={handleCopy}>Copy to clipboard</button>
          {copySuccess && <span style={{ color: "green", marginLeft: "10px" }}>Copied!</span>}
        </div>
      )}
      <div className="feedback-buttons">
        <button onClick={handleLike} disabled={liked} style={{ marginRight: "10px" }}>
          <FaThumbsUp />
        </button>
        <button onClick={handleDislike} disabled={disliked} style={{ marginRight: "10px" }}>
          <FaThumbsDown />
        </button>
      </div>
    </div>
  );
};

export default ResponseItem;

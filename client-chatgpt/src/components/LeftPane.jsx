import React, { useState } from "react";

const LeftPane = ({ systemPrompt, userPrompt, onChange }) => {
  const [isEditingSystemPrompt, setIsEditingSystemPrompt] = useState(false);
  const [isEditingUserPrompt, setIsEditingUserPrompt] = useState(false);

  const handleSystemPromptEdit = () => {
    setIsEditingSystemPrompt(true);
  };

  const handleUserPromptEdit = () => {
    setIsEditingUserPrompt(true);
  };

  const handleSystemPromptChange = (event) => {
    onChange("system", event.target.value);
  };

  const handleUserPromptChange = (event) => {
    onChange("user", event.target.value);
  };

  const handleSystemPromptSubmit = (event) => {
    event.preventDefault();
    setIsEditingSystemPrompt(false);
  };

  const handleUserPromptSubmit = (event) => {
    event.preventDefault();
    setIsEditingUserPrompt(false);
  };

  return (
    <div className="w-1/4 h-full border-r border-[#999999] flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-2">System Prompt</h2>
      {isEditingSystemPrompt ? (
        <form onSubmit={handleSystemPromptSubmit}>
          <textarea
            className="w-full h-24 rounded-lg p-2 resize-none border-2 border-[#999999]"
            value={systemPrompt}
            onChange={handleSystemPromptChange}
          />
          <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg mt-2">
            Save
          </button>
        </form>
      ) : (
        <>
          <div className="whitespace-pre-wrap mb-4">{systemPrompt}</div>
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handleSystemPromptEdit}
          >
            Edit
          </button>
        </>
      )}
      <h2 className="text-lg font-semibold my-2">User Prompt</h2>
      {isEditingUserPrompt ? (
        <form onSubmit={handleUserPromptSubmit}>
          <textarea
            className="w-full h-24 rounded-lg p-2 resize-none border-2 border-[#999999]"
            value={userPrompt}
            onChange={handleUserPromptChange}
          />
          <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg mt-2">
            Save
          </button>
        </form>
      ) : (
        <>
          <div className="whitespace-pre-wrap mb-4">{userPrompt}</div>
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handleUserPromptEdit}
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default LeftPane;

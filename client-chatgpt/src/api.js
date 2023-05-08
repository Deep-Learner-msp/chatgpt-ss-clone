export const fetchResponse = async (chat) => {
    try {
      // after depoloyment you should change the fetch URL below
      const response = await fetch("http://127.0.0.1:8000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: chat.map((message) => message.message).join(" \n "),
        }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const sendFeedback = async (response, feedback) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response, feedback }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to send feedback");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };
  
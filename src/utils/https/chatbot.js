import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_PYTHON_URL;

export const sendMessage = (message, userId) => {
  const body = {
    message: message,
  };
  const url = `${baseUrl}/api/chat`;
  return axios.post(
    url,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        "x-client-id": userId
      }
    }
  );
};
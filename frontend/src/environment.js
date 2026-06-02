let IS_PROD = true;

const server = IS_PROD ?
  "https://syncmeet-backend-kizq.onrender.com":
  "https://localhost:8000";

export default server;
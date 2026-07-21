import axios from "axios";

const API = axios.create({
  baseURL: "https://pdf-viewer-xway.onrender.com/api",
});

export default API;

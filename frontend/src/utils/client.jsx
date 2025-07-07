import axios from "axios";



const client = axios.create({
  baseURL: "http://localhost:8000/apnaMeet/api/v1/users",
  // withCredentials: true,
});

export default client;
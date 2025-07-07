import axios from "axios";
import server from "../environment";

const client = axios.create({
  baseURL: "http://localhost:8000/apnaMeet/api/v1/users",
  // baseURL: `${server}/apnaMeet/api/v1/users`,
  // withCredentials: true,
});

export default client;

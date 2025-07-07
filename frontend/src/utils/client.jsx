

import axios from "axios";
import server from "../environment.js";

const client = axios.create({
  baseURL: `${server}/apnaMeet/api/v1/users`,
  // withCredentials: true, // Enable if needed for cookies/session
});

export default client;

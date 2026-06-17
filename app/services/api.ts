import axios from "axios";

//define o url do back como 3000
  export const api = axios.create({
  baseURL: "http://localhost:3000",
})

export default api;
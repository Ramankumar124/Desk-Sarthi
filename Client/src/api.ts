import axios from "axios";
import { properties } from "./properties/properties";


const Api = axios.create({
  baseURL: `${properties.PUBLIC_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(properties.PUBLIC_BASE_URL);

export default Api;
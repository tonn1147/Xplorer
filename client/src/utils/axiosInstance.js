import axios from "axios";
import { apiPath } from "./apiPath";

export const axiosInstance = axios.create({
    baseURL: apiPath.baseUrl,
    timeout: 5000,
  });
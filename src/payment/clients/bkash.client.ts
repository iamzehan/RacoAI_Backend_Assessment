import axios from "axios";
import { env } from "../../config/env.js";

export const bkashClient = axios.create({
  baseURL: env.BKASH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    username: env.BKASH_USERNAME,
    password: env.BKASH_PASSWORD
  },
  timeout: 10000
});
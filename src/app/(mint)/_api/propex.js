import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const apiWithSession = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  });
  let lastSession = null;
  instance.interceptors.request.use(async (req) => {
    if (lastSession == null || Date.now() > Date.parse(lastSession.expires)) {
      const session = await getSession();
      lastSession = session;
    }

    if (lastSession) {
      req.headers.Authorization = `Bearer ${lastSession.access_token}`;
    } else {
      req.headers.Authorization = undefined;
    }
    return req;
  });
  return instance;
};

export const propexAPI = apiWithSession();

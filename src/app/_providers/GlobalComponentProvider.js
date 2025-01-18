'use client'
import { Toaster } from "react-hot-toast";

export default function GlobalComponentProvider({ children }) {

  return <>{children}
  <Toaster />
  </>;
}

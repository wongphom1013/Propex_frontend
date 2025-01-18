"use client";

import { formModalOpenAtom } from "@/store/form-modal-store";
import { useAtom } from "jotai";

export default function FormButton({ children, className }) {
  const [isOpen, setOpen] = useAtom(formModalOpenAtom);
  return (
    <button
      onClick={() => {
        setOpen(true);
      }}
      className={className}
    >
      {children}
    </button>
  );
}

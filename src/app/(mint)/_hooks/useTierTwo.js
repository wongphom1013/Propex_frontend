"use client";

import { formStepAtom } from "../_store/form-store";
import { useAtom } from "jotai";

export const useResetTierTwoForm = () => {
    const [, setFormProgress] = useAtom(formStepAtom)

    const resetForm = () => {
        setFormProgress("landingPage")
    }

    return resetForm
}
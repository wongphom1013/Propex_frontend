import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isDemoModeAtom = atom(false);

/**
 * @typedef {'DEMO'} AuthProvider
 */

/**
 * Atom representing the current step in the minting progress.
 *
 * @type {import('jotai').Atom<AuthProvider>}
 */
export const selectedAuthProviderAtom = atomWithStorage(
  "THIRDWEB",
  "XELLAR",
)
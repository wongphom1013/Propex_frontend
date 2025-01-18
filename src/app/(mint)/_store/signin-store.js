import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const isSigningInAtom = atom(false);
export const isSigningOutAtom = atom(false);

/**
 * @typedef {'XELLAR' | 'THIRDWEB'} AuthProvider
 */

/**
 * Atom representing the current step in the minting progress.
 *
 * @type {import('jotai').Atom<AuthProvider>}
 */
export const selectedAuthProviderAtom = atomWithStorage(
  "THIRDWEB",
  "XELLAR"
)
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

/**
 * @typedef {'select-location' | 'select-role' | 'mint-nft'} MintingStep
 */

/**
 * Atom representing the current step in the minting process.
 *
 * @type {import('jotai').Atom<MintingStep>}
 */
export const mintingStepAtom = atomWithStorage(
  "minting-step-store",
  "select-location"
);

/**
 * @typedef {'mint-confirmation' | 'mint-processing' | 'mint-done'} MintProgress
 */

/**
 * Atom representing the current step in the minting progress.
 *
 * @type {import('jotai').Atom<MintProgress>}
 */
export const mintProgressAtom = atomWithStorage(
  "minting-progress-store",
  "mint-confirmation"
);

export const isPricingOpenAtom = atom(false);

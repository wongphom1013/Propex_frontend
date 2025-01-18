// user-store.js
import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'; 

// Define state atoms
export const userInfoAtom = atom(null);
export const loginSession = atomWithStorage(false);
export const balanceAtom = atom(null);
export const addressAtom = atom(null);
export const formattedAddressAtom = atom(null);
export const publicClientViemAtom = atom(null);
export const walletClientViemAtom = atom(null);
export const userPointAtom = atom(0);
export const userTotalPointAtom = atom(0);
export const userProgressAtom = atom('initMaps');
export const userSectionAtom = atom('Mint');

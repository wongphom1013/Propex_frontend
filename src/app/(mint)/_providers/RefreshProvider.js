import { createContext, useContext, useState, useCallback } from "react";

/**
 * @typedef {Object} RefreshContextType
 * @property {number} refreshState - The current state of the refresh counter.
 * @property {() => void} triggerRefresh - Function to trigger a refresh.
 */

/** @type {React.Context<RefreshContextType | undefined>} */
const RefreshContext = createContext();

/**
 * Custom hook to access the refresh context.
 * @returns {RefreshContextType} The refresh state and trigger function.
 * @throws {Error} If used outside of a `RefreshProvider`.
 */
export const useRefreshTrigger = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefreshTrigger must be used within a RefreshProvider");
  }
  return context;
};

/**
 * Provider component to manage refresh state and provide it to children components.
 * @param {{ children: React.ReactNode }} props - The component's children.
 * @returns {JSX.Element} The provider component that wraps its children with refresh context.
 */
export const RefreshProvider = ({ children }) => {
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  return (
    <RefreshContext.Provider
      value={{ refreshState: refreshCounter, triggerRefresh }}
    >
      {children}
    </RefreshContext.Provider>
  );
};

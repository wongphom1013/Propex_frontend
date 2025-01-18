import FakeNotification from "./_components/FakeNotifcation";
import SignedInLayout from "./_layout/SignedInLayout";
import AppProvider from "./provider";

/**
 * @type {import("next").Metadata}
 */
export const metadata = {
  title: "Mint | Propex - On Chain Real Estate Trade & Loans",
};

export default function AppLayout({ children }) {
  return (
    <AppProvider>
      <div className="w-full min-h-screen bg-mossgreen relative overflow-hidden font-open-sauce">
        <SignedInLayout>
          <div className="w-full relative h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] overflow-hidden">
            {children}
          </div>
        </SignedInLayout>
        {/* <FakeNotification /> */}
      </div>
    </AppProvider>
  );
}

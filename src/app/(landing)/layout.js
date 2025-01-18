import JotaiProvider from "../_providers/JotaiProvider";

export default function LandingLayout({ children }) {
  return (
    <JotaiProvider>
      <div className="bg-white">{children}</div>
    </JotaiProvider>
  );
}

import Link from "next/link";

export default function SubdomainLink({ href, ...props }) {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  const subdomain =
    process.env.NODE_ENV === "development" ? "" : hostname.split(".")[0];

  let adjustedHref = href;

  if (subdomain === "mint") {
    adjustedHref = "https://mint.propex.app" + (href === "/mint" ? "/" : href);
  } else if (subdomain === "www") {
    adjustedHref = "https://www.propex.app" + href;
  } else {
    adjustedHref = href;
  }

  return <Link href={adjustedHref} {...props} />;
}

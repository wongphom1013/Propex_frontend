import { MINT_APP_HOSTNAME, PROPEX_LANDING_HOSTNAME } from "@/config";
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  const mintRoutes = [
    "/tier-one",
    "/tier-two",
    "/portfolio",
    "/dashboard",
    "/details",
  ]; // Add all your routes here

  if (
    hostname === PROPEX_LANDING_HOSTNAME &&
    mintRoutes.includes(url.pathname)
  ) {
    // Redirect to mint.bozo.app with the same path
    url.hostname = MINT_APP_HOSTNAME;
    return NextResponse.redirect(url);
  }

  // Prevent redirect loops: Only rewrite if on mint.bozo.app and the path is '/'
  if (hostname === MINT_APP_HOSTNAME && url.pathname === "/") {
    url.pathname = "/tier-one";
    return NextResponse.rewrite(url);
  }

  // Allow all other requests to proceed as normal
  return NextResponse.next();
}

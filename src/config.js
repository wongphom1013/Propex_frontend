export const TWITTER_LINK = "";
export const INSTA_LINK = "";

export const MINT_APP_LINK = "http://localhost:3000/tier-one";
// export const MINT_APP_LINK = "https://mint.propex.app";

export const MINT_APP_HOSTNAME = "mint.propex.app";
export const PROPEX_LANDING_HOSTNAME = "www.propex.app";

export const getPropexContract = (chainId) => {
  switch (parseInt(chainId)) {
    case 1135:
      return "0xD5c17532f49a4E12C9912EbbD9BE64973F78AfE4";
    default:
      return "0xD5c17532f49a4E12C9912EbbD9BE64973F78AfE4";
  }
};

export const getRaribleChainName = (chainId) => {
  switch (parseInt(chainId)) {
    case 1135:
      return "lisk";
    default:
      return "lisk";
  }
};

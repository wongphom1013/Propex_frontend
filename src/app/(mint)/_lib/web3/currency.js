import axios from "axios";
import { propexAPI } from "../../_api/propex";

export async function convertEthToUsd(ethAmount) {
  const response = await propexAPI.get("/currency?symbol=ETH");

  const ethToUsdRate = response.data.rateUSD;
  const usdAmount = ethAmount * ethToUsdRate;

  return usdAmount;
}

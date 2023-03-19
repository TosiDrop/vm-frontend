require("dotenv").config();
import axios, { AxiosRequestConfig } from "axios";
import { MinswapTypes } from "../../client/src/entities/minswap";
import { shortTermCache } from "../utils/cache";
import { LoggerService } from "./logger";

const MIN_PAIRS_API =
  process.env.MIN_PAIRS_API ||
  "https://api-mainnet-prod.minswap.org/coinmarketcap/v2/pairs";

export namespace MinswapService {
  export async function getPrices(): Promise<MinswapTypes.PriceInfoMap> {
    let prices = shortTermCache.get("prices") as MinswapTypes.PriceInfoMap;

    if (prices == null) {
      try {
        const axiosRequestConfig: AxiosRequestConfig<MinswapTypes.PriceInfoMap> =
          {
            method: "GET",
            url: MIN_PAIRS_API,
            timeout: 10000,
          };
        prices = (await axios(axiosRequestConfig)).data;
        shortTermCache.set("prices", prices);
      } catch (error: unknown) {
        LoggerService.warn("Fail to fetch price info from minswap");
        prices = {};
      }
    }

    return prices;
  }
}

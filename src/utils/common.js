import axios from "axios";
import unisat from "../assets/wallet-logo/unisat_logo.png";
import meta from "../assets/wallet-logo/meta.png";
import xverse from "../assets/wallet-logo/xverse_logo_whitebg.png";
import magiceden from "../assets/brands/magiceden.svg"
import { Actor, HttpAgent } from "@dfinity/agent";
import Web3 from "web3";

export const API_METHODS = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};

export const apiUrl = {
  Asset_server_base_url: process.env.REACT_APP_ASSET_SERVER,
  Unisat_open_api: process.env.REACT_APP_UNISAT_OPEN_API,
};

export const XVERSE_WALLET_KEY = "xverse";
export const UNISAT_WALLET_KEY = "unisat";
export const MAGICEDEN_WALLET_KEY = "magiceden";
export const META_WALLET_KEY = "meta";
export const IS_USER = false;
export const IS_DEV = true;

export const ordinals = process.env.REACT_APP_ORDINAL_CANISTER_ID;
export const rootstock = process.env.REACT_APP_ROOTSTOCK_CANISTER_ID;
export const ordiscan_bearer = process.env.REACT_APP_ORDISCAN_BEARER;
export const foundaryId = Number(process.env.REACT_APP_FOUNDARY_ID);

export const BTCWallets = [
  {
    label: "MAGICEDEN",
    image: magiceden,
    key: MAGICEDEN_WALLET_KEY,
  },
  {
    label: "XVERSE",
    image: xverse,
    key: XVERSE_WALLET_KEY,
  },
  {
    label: "UNISAT",
    image: unisat,
    key: UNISAT_WALLET_KEY,
  }
];

export const paymentWallets = [
  {
    label: "META",
    image: meta,
    key: META_WALLET_KEY,
  }
]

export const agentCreator = (apiFactory, canisterId) => {
  const agent = new HttpAgent({
    host: process.env.REACT_APP_HTTP_AGENT_ACTOR_HOST,
  });
  const API = Actor.createActor(apiFactory, {
    agent,
    canisterId,
  });
  return API;
};

export const sliceAddress = (address, slicePoint = 5) => (
  <>
    {address?.slice(0, slicePoint)}
    ...
    {address?.slice(address.length - slicePoint, address.length)}
  </>
);

export const calculateFee = (bytes, preference) => {
  return Math.round(
    (Number(
      bytes?.split(" ")[0]
    ) /
      4) *
    preference *
    3.47
  )
}

export const IndexContractAddress = "0x8696c20154d93f339ea537fbffc72ab78efcc7d2";
export const TokenContractAddress = "0xfc2fd4c7c243b36236a2fd523ab6195ec7989a2b";
export const BorrowContractAddress = "0xcd0b8506122ac172da02b355a6051030dacf0e55";

export const contractGenerator = async (abi, contractAddress) => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
}

export const calculateAPY = (interestRate, numberOfDays, toFixed = 2) => {
  const rateDecimal = interestRate / 100;
  const apy = Math.pow(1 + rateDecimal, 365 / numberOfDays) - 1;
  const apyPercentage = apy * 100;

  return apyPercentage.toFixed(toFixed);
}

export const calculateDailyInterestRate = (annualInterestRate, toFixed = 2) => {
  const rateDecimal = annualInterestRate / 100;
  const dailyInterestRate = rateDecimal / 365;
  const dailyInterestRatePercentage = dailyInterestRate * 100;

  return dailyInterestRatePercentage.toFixed(toFixed); // Return daily interest rate rounded to 5 decimal places
}

// Getting time ago statement
export const getTimeAgo = (timestamp) => {
  const now = new Date(); // Current date and time
  const diff = now.getTime() - timestamp; // Difference in milliseconds

  // Convert milliseconds to seconds
  const seconds = Math.floor(diff / 1000);

  // Calculate time difference in various units
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Determine appropriate phrase based on time difference
  if (seconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
}

export const Capitalaize = (data) => {
  if (data) {
    const words = data.split(/\s+/);
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  }
};

export const DateTimeConverter = (timestamps) => {
  const date = new Date(timestamps);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let strTime = date.toLocaleString("en-IN", { timeZone: `${timezone}` });
  const timeStamp = strTime.split(",");

  return timeStamp;
};

// Function to format hours in 12-hour clock format
export const format12Hour = (hours) => {
  return hours % 12 || 12;
};

// Function to format single-digit minutes and seconds with leading zero
export const formatTwoDigits = (value) => {
  return value.toString().padStart(2, "0");
};

export const daysCalculator = (_timestamp = Date.now(), _daysAfter = 7) => {
  const timestamp = Number(_timestamp);

  const givenDate = new Date(timestamp);

  const resultDate = new Date(givenDate);
  resultDate.setDate(givenDate.getDate() + _daysAfter);

  const formattedResult = `${resultDate.getDate()}/${resultDate.getMonth() + 1
    }/${resultDate.getFullYear()} ${format12Hour(
      resultDate.getHours()
    )}:${formatTwoDigits(resultDate.getMinutes())}:${formatTwoDigits(
      resultDate.getSeconds()
    )} ${resultDate.getHours() >= 12 ? "pm" : "am"}`;

  return { date_time: formattedResult, timestamp: resultDate.getTime() };
};

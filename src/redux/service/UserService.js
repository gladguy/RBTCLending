import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import Notify from "../../component/notification";
import { setEthBalance } from "../slice/constant";

export const fetchEthBalance = createAsyncThunk(
  "user/setEthBalance",
  async (_, thunk) => {
    try {
      const state = thunk.getState();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(state.wallet.meta.address);
      const balanceInEther = ethers.utils.formatEther(balance);
      thunk.dispatch(setEthBalance(Number(balanceInEther)));
    } catch (error) {
      Notify("error", error.message);
    }
  }
);

// const etherscanProvider = new ethers.providers.EtherscanProvider(
//   null,
//   "WCJQ89A6P7MVCXW2EDFRKM6I2TZQVTKP8A"
// );
// const history = await etherscanProvider.getHistory(metaAddress);
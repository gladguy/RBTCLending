import { createSlice } from "@reduxjs/toolkit";
import { MAGICEDEN_WALLET_KEY, META_WALLET_KEY, UNISAT_WALLET_KEY, XVERSE_WALLET_KEY } from "../../utils/common";

const state = {
  xverse: {
    ordinals: {},
    payment: {},
    signature: null,
    btcBalance: 0.0,
  },
  magicEden: {
    ordinals: {},
    payment: {},
    signature: null,
    btcBalance: 0.0,
  },
  unisat: {
    address: null,
    publicKey: null,
    signature: null,
    btcBalance: 0.0,
  },
  meta: {
    address: null,
    publicKey: null
  },
  active: [],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState: state,
  reducers: {
    setXverseOrdinals: (state, action) => {
      state.xverse.ordinals = action.payload;
    },

    setXversePayment: (state, action) => {
      state.xverse.payment = action.payload;
      state.active.push(XVERSE_WALLET_KEY);
    },

    setXverseSignature: (state, action) => {
      state.xverse.signature = action.payload;
    },

    setXverseBtc: (state, action) => {
      state.xverse.btcBalance = action.payload;
    },

    setMetaAddress: (state, action) => {
      state.meta.address = action.payload;
      state.active.push(META_WALLET_KEY);
    },

    setMagicEdenCredentials: (state, action) => {
      state.magicEden.ordinals = action.payload.ordinals;
      state.magicEden.payment = action.payload.payment;
      state.magicEden.btcBalance = action.payload.btcBalance;
      state.active.push(MAGICEDEN_WALLET_KEY);
    },

    setUnisatCredentials: (state, action) => {
      state.unisat.address = action.payload.address;
      state.unisat.publicKey = action.payload.publicKey;
      state.unisat.btcBalance = action.payload.BtcBalance;
      state.active.push(UNISAT_WALLET_KEY);
    },

    clearWalletState: (state, action) => {
      if (action.payload === XVERSE_WALLET_KEY) {
        state.xverse = {
          ordinals: {},
          payment: {},
          signature: null,
        };
      } else if (action.payload === UNISAT_WALLET_KEY) {
        state.unisat = {
          address: null,
          signature: null,
          publicKey: null,
          btcBalance: 0.0,
        };
      } else if (action.payload === MAGICEDEN_WALLET_KEY) {
        state.magicEden = {
          ordinals: {},
          payment: {},
          signature: null,
          btcBalance: 0.0,
        };
      } else if (action.payload === META_WALLET_KEY) {
        state.meta = {
          publicKey: null,
          address: null
        }
      }
      state.active = state.active.filter((wallet) => action.payload !== wallet);
    },
  },
});

export const {
  setXverseBtc,
  setMetaAddress,
  setXversePayment,
  clearWalletState,
  setXverseOrdinals,
  setXverseSignature,
  setUnisatCredentials,
  setMagicEdenCredentials,
} = walletSlice.actions;
export default walletSlice.reducer;

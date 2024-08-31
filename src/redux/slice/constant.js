import { createSlice } from "@reduxjs/toolkit";

const state = {
  isLoading: false,
  loaderTip: "Loading...",
  collection: ["", "", "", "", "", "", "", "", "", "", "", ""],
  approvedCollections: ["", "", "", "", "", "", "", "", "", "", "", ""],
  btcvalue: null,
  ethbalance: null,
  agent: undefined,
  userAssets: null,
  userCollateral: null,
  borrowCollateral: null,
  allBorrowRequest: null,
  offers: null,
  userOffers: null,
  dashboardData: {},
  userPoints: 0,
  balancePoints: 0
};

const constantSlice = createSlice({
  name: "constant",
  initialState: state,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setLoaderTip: (state, action) => {
      state.loaderTip = action.payload;
    },

    setCollection: (state, action) => {
      state.collection = action.payload;
    },

    setApprovedCollection: (state, action) => {
      state.approvedCollections = action.payload;
    },

    setBtcValue: (state, action) => {
      state.btcvalue = action.payload;
    },

    setEthBalance: (state, action) => {
      state.ethbalance = action.payload;
    },

    setAgent: (state, action) => {
      state.agent = action.payload;
    },

    setUserAssets: (state, action) => {
      state.userAssets = action.payload;
    },

    setUserCollateral: (state, action) => {
      state.userCollateral = action.payload;
    },

    setAllBorrowRequest: (state, action) => {
      state.allBorrowRequest = action.payload;
    },

    setBorrowCollateral: (state, action) => {
      state.borrowCollateral = action.payload;
    },

    setOffers: (state, action) => {
      state.offers = action.payload;
    },

    setUserOffers: (state, action) => {
      state.userOffers = action.payload;
    },

    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },

    setUserPoints: (state, action) => {
      state.userPoints = action.payload;
    },

    setUserBalancePoints: (state, action) => {
      state.balancePoints = action.payload;
    },
  },
});

export const {
  setAgent,
  setAllBorrowRequest,
  setApprovedCollection,
  setBorrowCollateral,
  setBtcValue,
  setEthBalance,
  setCollection,
  setDashboardData,
  setLoaderTip,
  setUserPoints,
  setUserBalancePoints,
  setLoading,
  setOffers,
  setUserAssets,
  setUserCollateral,
  setUserOffers,
} = constantSlice.actions;
export default constantSlice.reducer;

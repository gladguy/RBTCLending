import { Actor, HttpAgent } from "@dfinity/agent";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Notify from "../../component/notification";
import { apiFactory } from "../../ordinal_canister";
import {
  setAgent,
  setApprovedCollection,
  setBtcValue,
  setCollection,
  setUserAssets,
} from "../../redux/slice/constant";
import {
  API_METHODS,
  IS_USER,
  MAGICEDEN_WALLET_KEY,
  META_WALLET_KEY,
  UNISAT_WALLET_KEY,
  XVERSE_WALLET_KEY,
  apiUrl,
  calculateAPY,
  contractGenerator,
} from "../../utils/common";

export const propsContainer = (Component) => {
  function ComponentWithRouterProp(props) {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const reduxState = useSelector((state) => state);
    const activeWallet = reduxState.wallet.active;
    const xverseAddress = reduxState.wallet.xverse.ordinals.address;
    const unisatAddress = reduxState.wallet.unisat.address;
    const magicEdenAddress = reduxState.wallet.magicEden.ordinals.address;
    const metaAddress = reduxState.wallet.meta.address;
    const api_agent = reduxState.constant.agent;
    const collections = reduxState.constant.collection;
    const userAssets = reduxState.constant.userAssets;
    const ckBtcAgent = reduxState.constant.ckBtcAgent;
    const ckBtcActorAgent = reduxState.constant.ckBtcActorAgent;
    const ckEthAgent = reduxState.constant.ckEthAgent;
    const ckEthActorAgent = reduxState.constant.ckEthActorAgent;
    const withdrawAgent = reduxState.constant.withdrawAgent;

    const ordinalCanisterId = process.env.REACT_APP_ORDINAL_CANISTER_ID;
    const WAHEED_ADDRESS = process.env.REACT_APP_WAHEED_ADDRESS;

    const btcPrice = async () => {
      const BtcData = await API_METHODS.get(
        `${apiUrl.Asset_server_base_url}/api/v1/fetch/BtcPrice`
      );
      return BtcData;
    };

    const fetchBTCLiveValue = async () => {
      try {
        const BtcData = await btcPrice();
        if (BtcData.data.data[0]?.length) {
          const btcValue = BtcData.data.data[0].flat();
          dispatch(setBtcValue(btcValue[1]));
        } else {
          fetchBTCLiveValue();
        }
      } catch (error) {
        // Notify("error", "Failed to fetch ckBtc");
      }
    };

    useEffect(() => {
      (async () => {
        try {
          if (!api_agent) {
            const ordinalAgent = new HttpAgent({
              host: process.env.REACT_APP_HTTP_AGENT_ACTOR_HOST,
            });

            const agent = Actor.createActor(apiFactory, {
              agent: ordinalAgent,
              canisterId: ordinalCanisterId,
            });

            dispatch(setAgent(agent));
          }
        } catch (error) {
          Notify("error", error.message);
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
      //Fetching BTC Value
      fetchBTCLiveValue();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      (() => {
        setInterval(async () => {
          if (ckBtcAgent) fetchBTCLiveValue();
        }, [300000]);
        return () => clearInterval();
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_agent, dispatch]);

    useEffect(() => {
      (async () => {
        if (api_agent) {
          const result = await api_agent.get_collections();
          const approvedCollections = await api_agent.getApproved_Collections();
          const collections = JSON.parse(result);
          if (approvedCollections.length) {
            const collectionPromise = approvedCollections.map(async (asset) => {
              const [, col] = asset;
              const collection = collections.find(
                (predict) => predict.symbol === col.collectionName
              );
              return new Promise(async (resolve, _) => {
                const { data } = await API_METHODS.get(
                  `${apiUrl.Asset_server_base_url}/api/v2/fetch/collection/${col.collectionName}`
                );
                resolve({ ...col, ...data.data, ...collection });
              });
            });

            const collectionDetails = await Promise.all(collectionPromise);
            const finalResult = collectionDetails.map((col) => {
              const { yield: yields, terms } = col;
              const term = Number(terms);
              const APY = calculateAPY(yields, term);
              const LTV = 0;
              return {
                ...col,
                terms: term,
                APY,
                LTV,
              };
            });
            dispatch(setApprovedCollection(finalResult));
          }
          dispatch(setCollection(collections));
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_agent, dispatch]);

    const getCollectionDetails = async (filteredData) => {
      try {
        const isFromApprovedAssets = filteredData.map(async (asset) => {
          return new Promise(async (resolve, reject) => {
            const result = await API_METHODS.get(
              `${apiUrl.Asset_server_base_url}/api/v2/fetch/asset/${asset.id}`
            );
            resolve(...result.data?.data?.tokens);
          });
        });
        const revealedPromise = await Promise.all(isFromApprovedAssets);
        let collectionSymbols = {};
        collections.forEach(
          (collection) =>
            (collectionSymbols = {
              ...collectionSymbols,
              [collection.symbol]: collection,
            })
        );
        const collectionNames = collections.map(
          (collection) => collection.symbol
        );
        const isFromApprovedCollections = revealedPromise.filter((assets) =>
          collectionNames.includes(assets.collectionSymbol)
        );

        const finalPromise = isFromApprovedCollections.map((asset) => {
          const collection = collectionSymbols[asset.collectionSymbol];
          return {
            ...asset,
            collection,
          };
        });
        return finalPromise;
      } catch (error) {
        console.log("getCollectionDetails error", error);
      }
    };

    const fetchWalletAssets = async (address) => {
      try {
        const result = await API_METHODS.get(
          `${apiUrl.Asset_server_base_url}/api/v1/fetch/assets/${address}`
        );
        if (result.data?.data?.length) {
          const filteredData = result.data.data.filter(
            (asset) =>
              asset.mimeType === "text/html" ||
              asset.mimeType === "image/webp" ||
              asset.mimeType === "image/jpeg" ||
              asset.mimeType === "image/png" ||
              asset.mimeType === "image/svg+xml"
          );
          const finalPromise = await getCollectionDetails(filteredData);
          return finalPromise;
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    useEffect(() => {
      (async () => {
        if (
          api_agent &&
          (activeWallet.includes(XVERSE_WALLET_KEY) ||
            activeWallet.includes(UNISAT_WALLET_KEY) ||
            activeWallet.includes(MAGICEDEN_WALLET_KEY)) &&
          collections[0]?.symbol &&
          !userAssets
        ) {
          const result = await fetchWalletAssets(
            IS_USER
              ? xverseAddress
                ? xverseAddress
                : unisatAddress
                ? unisatAddress
                : magicEdenAddress
              : WAHEED_ADDRESS
          );

          const testData = result?.reduce((acc, curr) => {
            // Find if there is an existing item with the same collectionSymbol
            let existingItem = acc.find(
              (item) => item.collectionSymbol === curr.collectionSymbol
            );

            if (existingItem) {
              // If found, add the current item to the duplicates array
              if (!existingItem.duplicates) {
                existingItem.duplicates = [];
              }
              existingItem.duplicates.push(curr);
            } else {
              // If not found, add the current item to the accumulator
              acc.push(curr);
            }

            return acc;
          }, []);

          // Without getting duplicate
          // const uniqueData = result?.filter(
          //   (obj, index, self) =>
          //     index ===
          //     self.findIndex((o) => o.collectionSymbol === obj.collectionSymbol)
          // );

          if (testData?.length) {
            dispatch(setUserAssets(testData));
          }
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet, api_agent, dispatch, collections]);

    useEffect(() => {
      (async () => {
        if (activeWallet.includes(META_WALLET_KEY)) {
          const contract = await contractGenerator();
          const userOffers = await contract.methods
            .getAllBorrowRequests()
            .call({ from: metaAddress });
          console.log("user offers", userOffers);
        }
      })();
    }, [activeWallet, metaAddress]);

    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
        redux={{ dispatch, reduxState }}
        wallet={{
          api_agent,
          ckBtcAgent,
          ckEthAgent,
          withdrawAgent,
          ckBtcActorAgent,
          ckEthActorAgent,
        }}
      />
    );
  }
  return ComponentWithRouterProp;
};

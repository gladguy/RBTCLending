import { Badge, Col, Flex, Input, Row, Tag, Tooltip, Typography } from "antd";
import { load } from "cheerio";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { FaRegSmileWink, FaTruck } from "react-icons/fa";
import { FaJetFighterUp } from "react-icons/fa6";
import { FcApproval, FcHighPriority } from "react-icons/fc";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { ImSad } from "react-icons/im";
import { IoInformationCircleSharp, IoWarningSharp } from "react-icons/io5";
import { LuRefreshCw } from "react-icons/lu";
import { MdContentCopy, MdDashboardCustomize } from "react-icons/md";
import { PiCopyBold } from "react-icons/pi";
import { Bars, ThreeDots } from "react-loading-icons";
import { Link } from "react-router-dom";
import Bitcoin from "../../assets/coin_logo/bitcoin-rootstock.png";
import CustomButton from "../../component/Button";
import Loading from "../../component/loading-wrapper/secondary-loader";
import ModalDisplay from "../../component/modal";
import Notify from "../../component/notification";
import TableComponent from "../../component/table";
import WalletConnectDisplay from "../../component/wallet-error-display";
import { propsContainer } from "../../container/props-container";
import { fetchEthBalance } from "../../redux/service/UserService";
import {
  setBorrowCollateral,
  setLoading,
  setUserCollateral,
} from "../../redux/slice/constant";
import { rootstockApiFactory } from "../../rootstock_canister";
import {
  API_METHODS,
  Capitalaize,
  MAGICEDEN_WALLET_KEY,
  TokenContractAddress,
  UNISAT_WALLET_KEY,
  XVERSE_WALLET_KEY,
  agentCreator,
  calculateFee,
  rootstock,
  sliceAddress,
} from "../../utils/common";
import tokenAbiJson from "../../utils/tokens_abi.json";

const NumericInput = (props) => {
  const { onChange, data, placeholder } = props;

  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = data.asset === "ckETH" ? /^\d*(\.\d{0,3})?$/ : /^\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "") {
      onChange(inputValue);
    }
  };

  return (
    <Input
      {...props}
      size="large"
      className={`input-themed`}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

const BridgeOrdinals = (props) => {
  const { getCollaterals, fetchContractPoints } = props.wallet;
  const { reduxState, isPlugError, dispatch } = props.redux;
  const activeWallet = reduxState.wallet.active;

  const walletState = reduxState.wallet;
  const btcValue = reduxState.constant.btcvalue;
  const userCollateral = reduxState.constant.userCollateral;
  const xverseAddress = walletState.xverse.ordinals.address;
  const unisatAddress = walletState.unisat.address;
  const magicEdenAddress = walletState.magicEden.ordinals.address;
  const btcAddress = xverseAddress
    ? xverseAddress
    : unisatAddress
    ? unisatAddress
    : magicEdenAddress;
  const MEMPOOL_API = process.env.REACT_APP_MEMPOOL_API;

  const { Text } = Typography;

  // USE STATE
  const [borrowData, setBorrowData] = useState(null);
  const [lendData, setLendData] = useState([]);

  const [copy, setCopy] = useState("Copy");

  const [handleSupplyModal, setHandleSupplyModal] = useState(false);
  const [isWithdrawBtn, setIsWithdrawBtn] = useState(false);
  const [assetWithdrawModal, setAssetWithdrawModal] = useState(false);
  const [assetWithdrawModalData, setAssetWithdrawModalData] = useState({});
  const [withdrawModalData, setWithdrawModalData] = useState({
    asset: "",
    balance: "",
  });
  const [activeFee, setActiveFee] = useState("High");
  const [value, setValue] = useState(null);

  const BTC_ZERO = process.env.REACT_APP_BTC_ZERO;
  const CONTENT_API = process.env.REACT_APP_ORDINALS_CONTENT_API;

  // COMPONENTS & FUNCTIONS
  if (borrowData !== null) {
    borrowData.sort((a, b) => {
      return a.inscriptionNumber - b.inscriptionNumber;
    });
  }

  if (lendData.length !== 0) {
    lendData.sort((a, b) => {
      return a.inscriptionNumber - b.inscriptionNumber;
    });
  }

  const handleOk = () => {
    setHandleSupplyModal(false);
  };

  const handleCancel = () => {
    setHandleSupplyModal(false);
    setAssetWithdrawModal(false);
  };

  const handleTokenMint = async (inscriptionNumber) => {
    try {
      dispatch(setLoading(true));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        TokenContractAddress,
        tokenAbiJson,
        signer
      );

      const API = agentCreator(rootstockApiFactory, rootstock);
      const tx = await API.getTransactionByKey(inscriptionNumber.toString());

      if (JSON.parse(tx)?.inscriptionNumber) {
        const mintResult = await contract.mintOrdinal(inscriptionNumber);
        await mintResult.wait();
        if (mintResult.hash) {
          Notify("success", "Minting success!");
          getCollaterals();
          dispatch(fetchEthBalance());
          fetchContractPoints();
        }
      } else {
        Notify("warning", "Please wait for the asset to settle in custody.");
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log("minting error", error);
    }
  };

  const handleTokenBurn = async (inscriptionNumber) => {
    try {
      dispatch(setLoading(true));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        TokenContractAddress,
        tokenAbiJson,
        signer
      );

      const mintResult = await contract.burn(inscriptionNumber);
      await mintResult.wait();
      if (mintResult.hash) {
        Notify("success", "Burn success!");
        getCollaterals();
        fetchContractPoints();
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log("Burn error", error);
    }
  };

  const handleSupplyAssetWithdraw = async () => {
    setIsWithdrawBtn(true);
    const API = agentCreator(rootstockApiFactory, rootstock);
    const status = await API.getWithDrawStatus(assetWithdrawModalData.id);
    if (status) {
      Notify("error", "Request already submitted!");
      setAssetWithdrawModal(false);
      setIsWithdrawBtn(false);
      return;
    }
    try {
      const feeValue =
        activeFee === "High"
          ? assetWithdrawModalData.fastestFee.toString()
          : activeFee === "Medium"
          ? assetWithdrawModalData.halfHourFee.toString()
          : value;
      const fee = calculateFee(assetWithdrawModalData.contentLength, feeValue);
      // setLoadingState((prev) => ({ ...prev, isAssetWithdraw: true }));

      if (activeFee === "Custom" && !feeValue) {
        Notify("warning", "Please select or input the fee!");
        return;
      }

      const args = {
        transaction_id: "0",
        fee_rate: parseInt(feeValue),
        timestamp: Date.now(),
        bitcoinAddress: btcAddress,
        priority: activeFee,
        asset_id: assetWithdrawModalData.id,
        calculated_fee: parseInt(fee),
      };

      const withdrawRes = await API.addWithDrawAssetsRequest(args);
      if (withdrawRes) {
        Notify("sucess", "Withdraw request sent, wait untill process!");
        setAssetWithdrawModal(false);
      } else {
        Notify("error", "Something went wrong!");
      }
      setIsWithdrawBtn(false);
    } catch (error) {
      console.log("Asset Withdraw Error", error);
      setIsWithdrawBtn(false);
    }
  };

  // T1 --------------------------------------------------------------
  const AssetsToSupplyTableColumns = [
    {
      key: "Asset",
      title: "Asset",
      align: "center",
      dataIndex: "asset",
      render: (_, obj) => (
        <>
          <Flex gap={5} vertical align="center">
            {obj.contentType === "image/webp" ||
            obj.contentType === "image/jpeg" ||
            obj.contentType === "image/png" ||
            obj.contentType === "image/svg+xml" ? (
              <img
                src={`${CONTENT_API}/content/${obj.id}`}
                alt={`${obj.id}-borrow_image`}
                className="border-radius-30"
                width={70}
                height={70}
              />
            ) : obj.contentType === "image/svg" ||
              obj.contentType === "text/html;charset=utf-8" ||
              obj.contentType === "text/html" ? (
              //  || obj.contentType === "image/svg+xml"
              <iframe
                loading="lazy"
                width={"80px"}
                height={"80px"}
                style={{ border: "none", borderRadius: "20%" }}
                src={`${CONTENT_API}/content/${obj.id}`}
                title="svg"
                sandbox="allow-scripts"
              >
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <image href={`${CONTENT_API}/content/${obj.id}`} />
                </svg>
              </iframe>
            ) : (
              <img
                src={`${
                  obj?.meta?.collection_page_img_url
                    ? obj?.meta?.collection_page_img_url
                    : `${process.env.PUBLIC_URL}/collections/${obj?.collectionSymbol}`
                }`}
                // NatBoys
                // src={`https://ipfs.io/ipfs/QmdQboXbkTdwEa2xPkzLsCmXmgzzQg3WCxWFEnSvbnqKJr/1842.png`}
                // src={`${process.env.PUBLIC_URL}/collections/${obj?.collectionSymbol}.png`}
                onError={(e) =>
                  (e.target.src = `${process.env.PUBLIC_URL}/collections/${obj?.collectionSymbol}.png`)
                }
                alt={`${obj.id}-borrow_image`}
                className="border-radius-30"
                width={70}
                height={70}
              />
            )}
            {Capitalaize(obj.collectionSymbol)} - #{obj.inscriptionNumber}
          </Flex>
        </>
      ),
    },
    {
      key: "APY",
      title: "APY",
      align: "center",
      dataIndex: "APY",
      render: (_, obj) => (
        <Text className={"text-color-one"}>
          {Math.round(obj.collection.APY)}%
        </Text>
      ),
    },
    {
      key: "Term",
      title: "Term",
      align: "center",
      dataIndex: "terms",
      render: (_, obj) => (
        <Text className={"text-color-one"}>
          {Number(obj.collection.terms)} Days
        </Text>
      ),
    },
    {
      key: "LTV",
      title: "LTV",
      align: "center",
      dataIndex: "ltv",
      render: (_, obj) => {
        return (
          <Text className={"text-color-one"}>
            {obj?.loanToValue ? obj.collection.loanToValue : 0}%
          </Text>
        );
      },
    },
    {
      key: "Floor Price",
      title: "Floor price",
      align: "center",
      dataIndex: "value",
      render: (_, obj) => {
        const floor = Number(obj.collection.floorPrice)
          ? Number(obj.collection.floorPrice) / BTC_ZERO
          : 25000 / BTC_ZERO;
        return (
          <>
            <Flex vertical align="center">
              <Flex
                align="center"
                gap={3}
                className="text-color-one font-xsmall letter-spacing-small"
              >
                <img src={Bitcoin} alt="noimage" width={20} height={20} />
                {parseInt(floor.toFixed(2))
                  ? floor.toFixed(2)
                  : floor.toFixed(4)}
              </Flex>
              <span className="text-color-two font-xsmall letter-spacing-small">
                $ {(floor * btcValue).toFixed(2)}
              </span>
            </Flex>
          </>
        );
      },
    },
    {
      key: "Can be collateral",
      title: "Can be collateral",
      align: "center",
      dataIndex: "link",
      render: (_, obj) => (
        <>
          {obj.isToken || obj.inLoan ? (
            <FcApproval size={30} />
          ) : (
            <FcHighPriority size={30} />
          )}
        </>
      ),
    },
    {
      key: "Action Buttons",
      title: (
        <Tooltip title="You can create borrow request using your minted collateral ordinals!">
          <IoInformationCircleSharp size={25} color="#a7a700" />
        </Tooltip>
      ),
      align: "center",
      render: (_, obj) => {
        return (
          <Flex gap={5} justify="center">
            {obj.isToken && !obj.inLoan ? (
              <CustomButton
                className="click-btn font-weight-600 letter-spacing-small"
                trigger={"click"}
                disabled={!obj.isToken}
                onClick={() => {
                  handleTokenBurn(obj.inscriptionNumber);
                }}
                title={"Burn🔥"}
              />
            ) : obj.inLoan ? (
              <Text className={"text-color-one font-small"}>In Loan</Text>
            ) : (
              <Flex gap={5}>
                <CustomButton
                  className="click-btn font-weight-600 letter-spacing-small"
                  trigger={"click"}
                  disabled={obj.isToken}
                  onClick={() => handleTokenMint(obj.inscriptionNumber)}
                  title="Mint"
                />

                <CustomButton
                  className="click-btn font-weight-600 letter-spacing-small"
                  trigger={"click"}
                  disabled={obj.isToken}
                  onClick={async () => {
                    setAssetWithdrawModal(true);
                    const info = await API_METHODS.get(
                      `${MEMPOOL_API}/api/v1/fees/recommended`
                    );
                    const inscription = await API_METHODS.get(
                      `${process.env.REACT_APP_ORDINALS_CONTENT_API}/inscription/${obj.id}`
                    );
                    const $ = load(inscription.data);
                    const contentLength = $('dt:contains("content length")')
                      .next("dd")
                      .text();

                    setAssetWithdrawModalData({
                      ...obj,
                      ...info.data,
                      contentLength,
                    });
                    setValue(info.data.halfHourFee);
                  }}
                  title="
                  Withdraw
                  "
                />
              </Flex>
            )}
          </Flex>
        );
      },
    },
  ];

  useEffect(() => {
    if (activeWallet.length === 0) {
      setLendData([]);
      setBorrowData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWallet]);

  return (
    <>
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <h1 className="font-xlarge gradient-text-two">Bridge Ordinals</h1>
        </Col>
      </Row>

      <Row justify={"space-between"} align={"middle"}>
        <Col md={24}>
          <Flex className="page-box" align="center" gap={3}>
            <IoInformationCircleSharp size={25} color="#a7a700" />
            <Text className="font-small text-color-two">
              Your ordinal inscription stored in custody address. Address -
              <Link
                to={
                  "https://ordiscan.com/address/bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                }
                target="_blank"
              >
                <Tooltip
                  className="link"
                  title="bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                >
                  {" "}
                  {sliceAddress(
                    "bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                  )}
                </Tooltip>
                .
              </Link>{" "}
              <Tooltip title="Copied" trigger={"click"}>
                <PiCopyBold
                  className="pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                    );
                  }}
                  size={15}
                />{" "}
              </Tooltip>
              Ordinals sent will reflect here in 15 minutes.
            </Text>
          </Flex>
        </Col>
      </Row>

      <Row justify={"end"} align={"middle"} className="mt-20">
        {activeWallet.length ? (
          <Col
            onClick={() => {
              dispatch(setBorrowCollateral(null));
              dispatch(setUserCollateral(null));
              getCollaterals();
            }}
          >
            <LuRefreshCw
              className={`pointer ${userCollateral === null ? "spin" : ""}`}
              color="whitesmoke"
              size={25}
            />
          </Col>
        ) : (
          ""
        )}
      </Row>

      {walletState.active.includes(XVERSE_WALLET_KEY) ||
      walletState.active.includes(UNISAT_WALLET_KEY) ||
      walletState.active.includes(MAGICEDEN_WALLET_KEY) ? (
        <Row
          justify={"space-between"}
          className="mt-20 pad-bottom-30"
          gutter={32}
        >
          <Col xl={24}>
            <Row className="m-bottom">
              <Col xl={24}>
                <TableComponent
                  locale={{
                    emptyText: (
                      <Flex align="center" justify="center" gap={5}>
                        {!xverseAddress &&
                        !unisatAddress &&
                        !magicEdenAddress ? (
                          <>
                            <FaRegSmileWink size={25} />
                            <span className="font-medium">
                              Connect any BTC Wallet !
                            </span>
                          </>
                        ) : (
                          <>
                            <ImSad size={25} />
                            <span className="font-medium">
                              Seems you have no assets!
                            </span>
                          </>
                        )}
                      </Flex>
                    ),
                  }}
                  loading={{
                    spinning: userCollateral === null,
                    indicator: <Bars />,
                  }}
                  pagination={{ pageSize: 5 }}
                  rowKey={(e) =>
                    `${e?.id}-${
                      e?.inscriptionNumber
                    }-${Math.random()}-${Date.now()}`
                  }
                  tableColumns={AssetsToSupplyTableColumns}
                  tableData={userCollateral}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <WalletConnectDisplay
          heading={"Please connect any BTC wallets"}
          message={"Connect your wallet to see your assets!"}
          isPlugError={isPlugError}
        />
      )}

      {/* Asset Withdraw Modal */}
      <ModalDisplay
        width={"50%"}
        open={assetWithdrawModal}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={null}
        title={
          <Row className="black-bg white-color font-large">Withdraw asset</Row>
        }
      >
        {assetWithdrawModalData?.inscriptionNumber ? (
          <Row justify={"space-between"} gutter={24}>
            <Col md={12}>
              <Row className="mt-15" justify={"center"}>
                <Text className="text-color-one font-medium">
                  Review Transaction
                </Text>
              </Row>
              <Row justify={"center"} className="mt-15">
                {assetWithdrawModalData?.mimeType?.includes("text/html") ? (
                  <iframe
                    className="border-radius-30 pointer"
                    title={`Iframe`}
                    height={70}
                    width={70}
                    src={`${CONTENT_API}/content/${assetWithdrawModalData?.id}`}
                  />
                ) : (
                  <img
                    alt="withdraw_img"
                    width={80}
                    height={80}
                    className="border-radius-30"
                    src={`${process.env.REACT_APP_ORDINALS_CONTENT_API}/content/${assetWithdrawModalData?.id}`}
                  />
                )}
              </Row>
              <Flex vertical className="border-color mt-30">
                <Row justify={"space-between"}>
                  <Col>
                    <Text className="text-color-one font-small">Asset</Text>
                  </Col>
                  <Col>
                    <Text className="text-color-two font-small">
                      #{assetWithdrawModalData?.inscriptionNumber}
                    </Text>
                  </Col>
                </Row>
                <Row justify={"space-between"}>
                  <Col>
                    <Text className="text-color-one font-small">Id</Text>
                  </Col>
                  <Col>
                    <Flex vertical align="end">
                      <Text className="font-small text-color-two">
                        {sliceAddress(assetWithdrawModalData?.id, 7)}{" "}
                        <Tooltip
                          arrow
                          title={copy}
                          trigger={"hover"}
                          placement="top"
                        >
                          <MdContentCopy
                            className="pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                assetWithdrawModalData?.id
                              );
                              setCopy("Copied");
                              setTimeout(() => {
                                setCopy("Copy");
                              }, 2000);
                            }}
                            size={20}
                            color="#1cc2e4"
                          />
                        </Tooltip>
                      </Text>
                    </Flex>
                  </Col>
                </Row>
                <Row justify={"space-between"}>
                  <Col>
                    <Text className="text-color-one font-small">Recipient</Text>
                  </Col>
                  <Col>
                    <Text className="font-small text-color-two">
                      {sliceAddress(assetWithdrawModalData?.recipient, 7)}{" "}
                      <Tooltip
                        arrow
                        title={copy}
                        trigger={"hover"}
                        placement="top"
                      >
                        <MdContentCopy
                          className="pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              assetWithdrawModalData?.genesis_address
                            );
                            setCopy("Copied");
                            setTimeout(() => {
                              setCopy("Copy");
                            }, 2000);
                          }}
                          size={20}
                          color="#1cc2e4"
                        />
                      </Tooltip>
                    </Text>
                  </Col>
                </Row>
                <Row justify={"space-between"}>
                  <Col>
                    <Text className="text-color-one font-small iconalignment">
                      ckBTC{" "}
                      <img
                        src={Bitcoin}
                        alt="noimage"
                        style={{ justifyContent: "center" }}
                        width="25dvw"
                      />
                    </Text>
                  </Col>
                  <Col>
                    <Text className="font-small text-color-two">
                      <Tag
                        color={
                          activeFee === "High"
                            ? "lime-inverse"
                            : activeFee === "Medium"
                            ? "orange-inverse"
                            : "#5E263E"
                        }
                        style={{ fontWeight: 600, letterSpacing: "1px" }}
                      >
                        {calculateFee(
                          assetWithdrawModalData?.contentLength,
                          activeFee === "High"
                            ? assetWithdrawModalData?.fastestFee
                            : activeFee === "Medium"
                            ? assetWithdrawModalData?.halfHourFee
                            : value
                            ? value
                            : 1
                        ) / BTC_ZERO}
                      </Tag>
                    </Text>
                  </Col>
                </Row>
                <Row justify={"space-between"}>
                  <Col>
                    <Text className="text-color-one font-small">Fee</Text>
                  </Col>
                  <Col>
                    <Text className="font-small text-color-two">
                      <Tag
                        color={
                          activeFee === "High"
                            ? "lime-inverse"
                            : activeFee === "Medium"
                            ? "orange-inverse"
                            : "#5E263E"
                        }
                        style={{ fontWeight: 600, letterSpacing: "1px" }}
                      >
                        {(
                          (calculateFee(
                            assetWithdrawModalData?.contentLength,
                            activeFee === "High"
                              ? assetWithdrawModalData?.fastestFee
                              : activeFee === "Medium"
                              ? assetWithdrawModalData?.halfHourFee
                              : value
                              ? value
                              : 1
                          ) /
                            BTC_ZERO) *
                          btcValue
                        ).toFixed(2)}
                      </Tag>
                    </Text>
                  </Col>
                </Row>
              </Flex>
            </Col>
            <Col md={12}>
              <Flex vertical>
                <Badge.Ribbon
                  text={"~10 mins"}
                  style={{ color: "black" }}
                  className="color-black"
                  color="#a0d911"
                >
                  <Flex
                    className={`${
                      activeFee === "High" && "border-theme"
                    } mt-15 pad-15 pointer border-color`}
                    align="center"
                    justify="space-between"
                    onClick={() => setActiveFee("High")}
                  >
                    <div>
                      <FaJetFighterUp color="#a0d911" size={30} />
                    </div>
                    <Flex vertical>
                      <span className="text-color-one font-small">
                        High priority
                      </span>
                      <span className="text-color-two">
                        {assetWithdrawModalData?.fastestFee} Sats/vByte
                      </span>
                    </Flex>
                    <Flex vertical justify="end">
                      <span className="text-color-one font-small">
                        {calculateFee(
                          assetWithdrawModalData?.contentLength,
                          assetWithdrawModalData?.fastestFee
                        )}
                      </span>
                      <span className="text-color-two">
                        ~$
                        {(
                          (calculateFee(
                            assetWithdrawModalData?.contentLength,
                            assetWithdrawModalData?.fastestFee
                          ) /
                            BTC_ZERO) *
                          btcValue
                        ).toFixed(2)}
                      </span>
                    </Flex>
                  </Flex>
                </Badge.Ribbon>
                {/* Medium */}

                <Badge.Ribbon text={"~30 mins"} color="orange">
                  <Flex
                    className={`${
                      activeFee === "Medium" && "border-theme"
                    } mt-15 pad-15 pointer border-color`}
                    align="center"
                    justify="space-between"
                    onClick={() => setActiveFee("Medium")}
                  >
                    <div>
                      <FaTruck color="orange" size={30} />
                    </div>
                    <Flex vertical>
                      <span className="text-color-one font-small">
                        Medium priority
                      </span>
                      <span className="text-color-two">
                        {assetWithdrawModalData?.halfHourFee} Sats/vByte
                      </span>
                    </Flex>
                    <Flex vertical justify="end">
                      <span className="text-color-one font-small">
                        {calculateFee(
                          assetWithdrawModalData?.contentLength,
                          assetWithdrawModalData?.halfHourFee
                        )}
                      </span>
                      <span className="text-color-two">
                        ~$
                        {(
                          (calculateFee(
                            assetWithdrawModalData?.contentLength,
                            assetWithdrawModalData?.halfHourFee
                          ) /
                            BTC_ZERO) *
                          btcValue
                        ).toFixed(2)}
                      </span>
                    </Flex>
                  </Flex>
                </Badge.Ribbon>

                {/* Custom */}
                <Flex
                  className={`${
                    activeFee === "Custom" && "border-theme"
                  } mt-15 pad-15 pointer border-color`}
                  align="center"
                  justify="space-between"
                  onClick={() => setActiveFee("Custom")}
                >
                  <div>
                    <MdDashboardCustomize color="purple" size={30} />
                  </div>
                  <Flex vertical>
                    <span className="text-color-one font-small">Custom</span>
                    <span className="text-color-two">{value} Sats/vByte</span>
                  </Flex>
                  <Flex vertical justify="end">
                    <span className="text-color-one font-small">
                      {calculateFee(
                        assetWithdrawModalData?.contentLength,
                        value ? value : 1
                      )}
                    </span>
                    <span className="text-color-two">
                      ~$
                      {(
                        (calculateFee(
                          assetWithdrawModalData?.contentLength,
                          value ? value : 1
                        ) /
                          BTC_ZERO) *
                        btcValue
                      ).toFixed(2)}
                    </span>
                  </Flex>
                </Flex>

                {activeFee === "Custom" && (
                  <>
                    <Text className="text-color-one font-small iconalignment mt-15">
                      Edit fees <HiOutlineInformationCircle />
                    </Text>
                    <span className="text-color-two">
                      Apply a higher fee to help your transaction confirm
                      quickly, especially when the network is congested
                    </span>
                    <div className="mt-15">
                      <NumericInput
                        data={withdrawModalData}
                        value={value}
                        onChange={setValue}
                        placeholder={"0"}
                        suffix={
                          <Flex vertical align="end">
                            <span className="text-color-two">Sats/vByte</span>
                          </Flex>
                        }
                      />
                    </div>
                  </>
                )}
              </Flex>

              <>
                <CustomButton
                  block
                  loading={isWithdrawBtn}
                  className="click-btn m-25 font-weight-600 letter-spacing-small"
                  title={
                    <Flex align="center" justify="center" gap={5}>
                      Request
                    </Flex>
                  }
                  onClick={() => handleSupplyAssetWithdraw()}
                />
              </>
            </Col>
          </Row>
        ) : (
          <Row justify={"center"} align={"middle"} style={{ height: "400px" }}>
            <Loading
              spin={true}
              indicator={
                <ThreeDots stroke="#6a85f1" alignmentBaseline="central" />
              }
            />
          </Row>
        )}
      </ModalDisplay>

      {/* Custody supply address display */}
      <ModalDisplay
        width={"25%"}
        open={handleSupplyModal}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={null}
      >
        <Row justify={"center"}>
          <IoWarningSharp size={50} color="#f46d6d" />
        </Row>
        <Row justify={"center"}>
          <Text className="text-color-one font-xlarge font-weight-600 m-25">
            Reserved Address
          </Text>
        </Row>
        <Row>
          <span className="text-color-two mt-15">
            This is the token reserved contract address, please do not transfer
            directly through the CEX, you will not be able to confirm the source
            of funds, and you will not be responsible for lost funds.
          </span>
        </Row>
        <Row
          justify={"space-around"}
          align={"middle"}
          className="mt-30  border "
        >
          <Col md={18}>
            <span className="text-color-two">
              bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz
            </span>
          </Col>
          <Col md={3}>
            <Row justify={"end"}>
              <Tooltip arrow title={copy} trigger={"hover"} placement="top">
                <MdContentCopy
                  className="pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "bc1pjj4uzw3svyhezxqq7cvqdxzf48kfhklxuahyx8v8u69uqfmt0udqlhwhwz"
                    );
                    setCopy("Copied");
                    setTimeout(() => {
                      setCopy("Copy");
                    }, 2000);
                  }}
                  size={20}
                  color="#764ba2"
                />
              </Tooltip>
            </Row>
          </Col>
        </Row>
        <Row>
          <CustomButton
            onClick={handleCancel}
            title="I Know"
            className={"m-25 width background text-color-one "}
          />
        </Row>
      </ModalDisplay>
    </>
  );
};

export default propsContainer(BridgeOrdinals);

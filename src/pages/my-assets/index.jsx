import { Principal } from "@dfinity/principal";
import {
  Col,
  Divider,
  Dropdown,
  Flex,
  Input,
  Row,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { FaRegSmileWink } from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { ImSad } from "react-icons/im";
import { IoInformationCircleSharp, IoWarningSharp } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { RiInformationFill } from "react-icons/ri";
import { Bars } from "react-loading-icons";
import Bitcoin from "../../assets/coin_logo/bitcoin-rootstock.png";
import CustomButton from "../../component/Button";
import ModalDisplay from "../../component/modal";
import Notify from "../../component/notification";
import TableComponent from "../../component/table";
import WalletConnectDisplay from "../../component/wallet-error-display";
import { propsContainer } from "../../container/props-container";
import {
  Capitalaize,
  IS_USER,
  MAGICEDEN_WALLET_KEY,
  UNISAT_WALLET_KEY,
  XVERSE_WALLET_KEY,
  sliceAddress,
} from "../../utils/common";

const MyAssets = (props) => {
  const { api_agent } = props.wallet;
  const { reduxState, isPlugError } = props.redux;
  const activeWallet = reduxState.wallet.active;

  const walletState = reduxState.wallet;
  const btcValue = reduxState.constant.btcvalue;
  const userAssets = reduxState.constant.userAssets;

  const xverseAddress = walletState.xverse.ordinals.address;
  const unisatAddress = walletState.unisat.address;
  const magicEdenAddress = walletState.magicEden.ordinals.address;

  const { Text } = Typography;

  // USE STATE
  const [borrowData, setBorrowData] = useState(null);
  const [lendData, setLendData] = useState([]);
  const [askModal, setAskModal] = useState(false);

  const [copy, setCopy] = useState("Copy");
  const [loadingState, setLoadingState] = useState({
    isApproveBtn: false,
    isSupplyBtn: false,
    isLendCkbtcBtn: false,
    isBorrowData: false,
    isLendData: false,
    isWithdrawBtn: false,
    isRepayBtn: false,
    isAssetSupplies: false,
    isAssetWithdraw: false,
    isAskBtn: false,
  });

  const [supplyModalItems, setSupplyModalItems] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handleSupplyModal, setHandleSupplyModal] = useState(false);

  const [askModalData, setAskModalData] = useState({
    loanAmount: null,
    repaymentAmount: 0,
    interestAmount: null,
  });

  const BTC_ZERO = process.env.REACT_APP_BTC_ZERO;
  const CONTENT_API = process.env.REACT_APP_ORDINALS_CONTENT_API;
  const WAHEED_ADDRESS = process.env.REACT_APP_WAHEED_ADDRESS;
  const PLUG_CUSTODY_ADDRESS = process.env.REACT_APP_PLUG_CUSTODY_ADDRESS;

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

  const handleAskModalInput = (e) => {
    const value = e.target.value;
    let dotRegex = /\./;
    const interestAmount = (5 / 100) * value;
    const repayment = interestAmount + Number(value);
    setAskModalData({
      ...askModalData,
      loanAmount: value,
      repaymentAmount: repayment.toString().match(dotRegex)
        ? repayment.toFixed(6)
        : repayment,
      interestAmount: interestAmount.toString().match(dotRegex)
        ? interestAmount.toFixed(6)
        : interestAmount,
    });
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setHandleSupplyModal(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setHandleSupplyModal(false);
    setAskModal(false);
    setAskModalData({
      ...askModalData,
      loanAmount: null,
      interestAmount: null,
      repaymentAmount: 0,
    });
  };

  const options = [
    {
      key: "1",
      label: (
        <CustomButton
          className={"click-btn font-weight-600 letter-spacing-small"}
          title={"Details"}
          size="medium"
          onClick={() => setIsModalOpen(true)}
        />
      ),
    },
  ];

  // API FUNCTIONS ---------------------------------------------------
  const handleAskRequest = async () => {
    if (askModalData.repaymentAmount) {
      setLoadingState((prev) => ({ ...prev, isAskBtn: true }));
      try {
        const setAddress = await api_agent.setAskRequest(
          IS_USER
            ? xverseAddress
              ? xverseAddress
              : unisatAddress
              ? unisatAddress
              : magicEdenAddress
            : WAHEED_ADDRESS,
          askModalData.id,
          JSON.stringify(askModalData),
          Principal.fromText(PLUG_CUSTODY_ADDRESS)
        );
        setLoadingState((prev) => ({ ...prev, isAskBtn: false }));

        if (setAddress) {
          Notify("success", "Ask successful!");
        } else {
          Notify("warning", "Asset Id already exists");
        }

        setLoadingState((prev) => ({ ...prev, isAskBtn: false }));
        handleCancel();
      } catch (error) {
        setLoadingState((prev) => ({ ...prev, isAskBtn: false }));
        console.log("Ask request error", error);
      }
    } else {
      Notify("warning", "Enter the amount!");
    }
  };

  useEffect(() => {
    if (activeWallet.length === 0) {
      setLendData([]);
      setBorrowData([]);
    }
  }, [activeWallet]);

  // C2 --------------------------------------------------------------
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
            obj.contentType === "image/png" ? (
              <img
                src={`${CONTENT_API}/content/${obj.id}`}
                alt={`${obj.id}-borrow_image`}
                className="border-radius-30"
                width={70}
                height={70}
              />
            ) : obj.contentType === "image/svg" ||
              obj.contentType === "text/html;charset=utf-8" ||
              obj.contentType === "text/html" ||
              obj.contentType === "image/svg+xml" ? (
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
            {obj.displayName}
          </Flex>
        </>
      ),
    },
    {
      key: "Floor Price",
      title: "Floor price",
      align: "center",
      dataIndex: "value",
      render: (_, obj) => {
        return (
          <>
            {obj.collection.floorPrice ? (
              <Flex vertical align="center">
                <Flex
                  align="center"
                  gap={3}
                  className="text-color-one font-small letter-spacing-small"
                >
                  <img src={Bitcoin} alt="noimage" width={20} height={20} />
                  {(obj.collection.floorPrice / BTC_ZERO).toFixed(2)}
                </Flex>
                <span className="text-color-two font-xsmall letter-spacing-small">
                  ${" "}
                  {(
                    (Number(obj.collection.floorPrice) / BTC_ZERO) *
                    btcValue
                  ).toFixed(2)}
                </span>
              </Flex>
            ) : (
              "-"
            )}
          </>
        );
      },
    },
    {
      key: "APY",
      title: "APY",
      align: "center",
      dataIndex: "category_id",
      render: (id, obj) => {
        return <Text className="text-color-two font-small">5%</Text>;
      },
    },
    {
      key: "Can be collateral",
      title: "Can be collateral",
      align: "center",
      dataIndex: "link",
      render: (_, obj) => (
        <>
          <FcApproval color="orange" size={30} />
        </>
      ),
    },
    {
      key: "Action Buttons",
      title: " ",
      align: "center",
      render: (_, obj) => {
        return (
          <Flex gap={5}>
            <Dropdown.Button
              className="dbButtons-grey font-weight-600 letter-spacing-small"
              trigger={"click"}
              onClick={() => setHandleSupplyModal(true)}
              menu={{
                items: options,
                onClick: () => setSupplyModalItems(obj),
              }}
            >
              Supply
            </Dropdown.Button>
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <h1 className="font-xlarge gradient-text-two">My Assets</h1>
        </Col>
      </Row>

      <Row justify={"space-between"} align={"middle"}>
        <Col md={24}>
          <Flex className="page-box" align="center" gap={3}>
            <IoInformationCircleSharp size={25} color="#a7a700" />
            <Text className="font-small text-color-two">
              Send your ordinals to our custody address to bridge your
              inscription, obtain a new ordinal for collateral, and create
              borrow requests.{" "}
            </Text>
          </Flex>
        </Col>
      </Row>

      {walletState.active.includes(XVERSE_WALLET_KEY) ||
      walletState.active.includes(UNISAT_WALLET_KEY) ||
      walletState.active.includes(MAGICEDEN_WALLET_KEY) ? (
        <Row
          justify={"space-between"}
          className="mt-40 pad-bottom-30"
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
                    spinning: userAssets === null,
                    indicator: <Bars />,
                  }}
                  pagination={{ pageSize: 5 }}
                  rowKey={(e) => `${e?.id}-${e?.inscriptionNumber}`}
                  tableColumns={AssetsToSupplyTableColumns}
                  tableData={userAssets}
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

      {/* MODAL START */}
      {/* Asset Details Modal */}
      <ModalDisplay
        width={"50%"}
        title={
          <Row className="black-bg white-color font-large letter-spacing-small">
            Details
          </Row>
        }
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row className="mt-30">
          <Col md={6}>
            <Text className="gradient-text-one font-small font-weight-600">
              Asset Info
            </Text>
          </Col>
          <Col md={18}>
            <Row>
              <Col md={12}>
                {supplyModalItems &&
                  (supplyModalItems?.mimeType === "text/html" ? (
                    <iframe
                      className="border-radius-30"
                      title={`${supplyModalItems?.id}-borrow_image`}
                      height={300}
                      width={300}
                      src={`${CONTENT_API}/content/${supplyModalItems?.id}`}
                    />
                  ) : (
                    <>
                      <img
                        src={`${CONTENT_API}/content/${supplyModalItems?.id}`}
                        alt={`${supplyModalItems?.id}-borrow_image`}
                        className="border-radius-30"
                        width={125}
                      />
                      <Row>
                        <Text className="text-color-one ml">
                          <span className="font-weight-600 font-small ">
                            ${" "}
                          </span>
                          {(
                            (Number(supplyModalItems?.collection?.floorPrice) /
                              BTC_ZERO) *
                            btcValue
                          ).toFixed(2)}
                        </Text>
                      </Row>
                    </>
                  ))}
              </Col>

              <Col md={12}>
                <Row>
                  {" "}
                  <Flex vertical>
                    <Text className="text-color-two font-small">
                      Inscription Number
                    </Text>
                    <Text className="text-color-one font-small font-weight-600">
                      #{supplyModalItems?.inscriptionNumber}
                    </Text>
                  </Flex>
                </Row>
                <Row>
                  {" "}
                  <Flex vertical>
                    <Text className="text-color-two font-small">
                      Inscription Id
                    </Text>

                    <Text className="text-color-one font-small font-weight-600 iconalignment">
                      {sliceAddress(supplyModalItems?.id, 7)}
                      <Tooltip
                        arrow
                        title={copy}
                        trigger={"hover"}
                        placement="top"
                      >
                        <MdContentCopy
                          className="pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(supplyModalItems?.id);
                            setCopy("Copied");
                            setTimeout(() => {
                              setCopy("Copy");
                            }, 2000);
                          }}
                          size={20}
                          color="#764ba2"
                        />
                      </Tooltip>
                    </Text>
                  </Flex>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider />
        <Row className="mt-15">
          <Col md={6}>
            <Text className="gradient-text-one font-small font-weight-600">
              Collection Info
            </Text>
          </Col>
          <Col md={18}>
            <Row justify={"center"}>
              <Text className="gradient-text-two font-xslarge font-weight-600 ">
                {Capitalaize(supplyModalItems?.collection?.symbol)}
              </Text>
            </Row>

            <Row className="mt-30" justify={"space-between"}>
              <Flex vertical className="borrowDataStyle">
                <Text className="text-color-two font-small">Floor Price</Text>

                <Text className="text-color-one font-small font-weight-600">
                  {supplyModalItems?.collection.floorPrice / BTC_ZERO}
                </Text>
              </Flex>
              <Flex vertical className="borrowDataStyle">
                <Text className="text-color-two font-small">Total Listed</Text>

                <Text className="text-color-one font-small font-weight-600">
                  {supplyModalItems?.collection.totalListed}
                </Text>
              </Flex>
              <Flex vertical className="borrowDataStyle">
                <Text className="text-color-two font-small">Total Volume</Text>

                <Text className="text-color-one font-small font-weight-600">
                  {supplyModalItems?.collection.totalVolume}
                </Text>
              </Flex>
            </Row>

            <Row justify={"space-between"} className="m-25">
              <Flex vertical>
                <Text className="text-color-two font-small">Owners</Text>

                <Row justify={"center"}>
                  <Text className="text-color-one font-small font-weight-600">
                    {supplyModalItems?.collection.owners}
                  </Text>
                </Row>
              </Flex>
              <Flex vertical>
                <Text className="text-color-two font-small ">
                  Pending Transactions
                </Text>
                <Row justify={"center"}>
                  <Text className="text-color-one font-small font-weight-600">
                    {supplyModalItems?.collection.pendingTransactions}
                  </Text>
                </Row>
              </Flex>
              <Flex vertical>
                <Text className="text-color-two font-small">Supply</Text>
                <Row justify={"center"}>
                  <Text className="text-color-one font-small font-weight-600">
                    {supplyModalItems?.collection.supply}
                  </Text>
                </Row>
              </Flex>
            </Row>
          </Col>
        </Row>
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
              bc1p3s9nmllhlslppp6520gzfmnwa5hfmppns2zjrd5s6w06406gdg3snenzn7
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

      {/* Ask Modal */}
      <ModalDisplay
        width={"35%"}
        open={askModal}
        footer={null}
        onCancel={handleCancel}
        title={
          <Row>
            <Text style={{ color: "white", fontSize: "25px" }}>Loan Info</Text>
          </Row>
        }
      >
        <Row className="mt-20">
          <Text className="font-small iconalignment modalBoxYellowShadow">
            <RiInformationFill /> After the repayment, you will get the
            inscription
          </Text>
        </Row>
        <Row justify={"space-between"}>
          <Tooltip
            color="purple"
            open={
              askModalData.isApprovedCollection &&
              askModalData.loanAmount >
                (askModalData.floorPrice / BTC_ZERO).toFixed(8)
            }
            title={"Amount higher than floor price!"}
          >
            <Col className="mt-30 modalBoxBlackShadow">
              <Row>
                <Text className="color-white font-small">
                  Enter loan amount
                </Text>
              </Row>
              <Row>
                <Input
                  className="mt"
                  style={{
                    border: "none",
                    backgroundColor: "#2a2a29 !important",
                    fontSize: "18px",
                  }}
                  placeholder={
                    askModalData.isApprovedCollection
                      ? (askModalData.floorPrice / BTC_ZERO).toFixed(8)
                      : (10 / BTC_ZERO).toFixed(8)
                  }
                  value={askModalData.loanAmount}
                  maxLength={8}
                  onChange={(e) => {
                    if (e.target.value.match(/^[0-9.]+$/)) {
                      handleAskModalInput(e);
                    } else if (e.target.value === "") {
                      handleAskModalInput(e);
                    }
                  }}
                  prefix={
                    <img src={Bitcoin} alt="noimage" width={15} height={15} />
                  }
                />
              </Row>
            </Col>
          </Tooltip>
          <Col className="mt-30 modalBoxBlackShadow">
            <Row>
              <Text className="color-white font-small">
                Total Interest Amount
              </Text>
            </Row>
            <Row>
              <Input
                readOnly
                value={askModalData.interestAmount}
                className="mt"
                style={{ border: "none", fontSize: "18px" }}
                placeholder="0"
                prefix={
                  <img src={Bitcoin} alt="noimage" width={15} height={15} />
                }
              />
            </Row>
          </Col>
        </Row>
        <Row className="mt">
          <Col>
            <Text className="color-white font-small">
              Repayment Amount: {askModalData.repaymentAmount}
            </Text>
          </Col>
        </Row>
        <Row className="mt-20">
          <Col sm={24}>
            <CustomButton
              loading={loadingState.isAskBtn}
              className={"width font-weight-600"}
              onClick={handleAskRequest}
              title={"Ask Loan"}
            />
          </Col>
        </Row>
      </ModalDisplay>
    </>
  );
};

export default propsContainer(MyAssets);

import {
  Badge,
  Col,
  Divider,
  Flex,
  Radio,
  Row,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import { BiSolidSpreadsheet } from "react-icons/bi";
import { FaHandHolding, FaMoneyBillAlt } from "react-icons/fa";
import Bitcoin from "../../assets/coin_logo/bitcoin-rootstock.png";
import { FcInfo } from "react-icons/fc";
import { FiArrowDownLeft } from "react-icons/fi";
import { HiMiniReceiptPercent } from "react-icons/hi2";
import { MdTour } from "react-icons/md";
import WalletUI from "../../component/download-wallets-UI";
import ModalDisplay from "../../component/modal";
import { propsContainer } from "../../container/props-container";
import {
  MAGICEDEN_WALLET_KEY,
  UNISAT_WALLET_KEY,
  XVERSE_WALLET_KEY,
} from "../../utils/common";

const Portfolio = (props) => {
  const { reduxState } = props.redux;
  const activeWallet = reduxState.wallet.active;
  const walletState = reduxState.wallet;
  const dashboardData = reduxState.constant.dashboardData;
  const xverseAddress = walletState.xverse.ordinals.address;
  const unisatAddress = walletState.unisat.address;
  const magicEdenAddress = walletState.magicEden.ordinals.address;
  const metaAddress = walletState.meta.address;

  const { Text } = Typography;
  const [copy, setCopy] = useState("Copy");
  const [downloadWalletModal, setDownloadWalletModal] = useState(false);
  const [radioBtn, setRadioBtn] = useState("Assets");
  const [enableTour, setEnableTour] = useState(false);

  const TOUR_SVG = process.env.REACT_APP_TOUR_SVG;
  const TOUR_ID = process.env.REACT_APP_TOUR_ID;

  const portfolioCards = [
    {
      title: "Active Lendings",
      icon: FaHandHolding,
      value: Number(dashboardData.activeLendings),
    },
    {
      title: "Active Borrowings",
      icon: FiArrowDownLeft,
      value: Number(dashboardData.activeBorrows),
    },
    {
      title: "Completed Loans",
      icon: BiSolidSpreadsheet,
      value: Number(dashboardData.completedLoans),
    },
    {
      title: "Lendings Value",
      icon: FaMoneyBillAlt,
      value: Number(dashboardData.lendingValue),
    },
    {
      title: "Borrowings Value",
      icon: FaMoneyBillAlt,
      value: Number(dashboardData.borrowValue),
    },
    {
      title: "Profit Earned",
      icon: HiMiniReceiptPercent,
      value: Number(dashboardData.profitEarned),
    },
  ];

  const handleTour = () => {
    localStorage.setItem("isTourEnabled", true);
    setEnableTour(!enableTour);
  };

  const renderWalletAddress = (address) => (
    <>
      {address ? (
        <>
          <Tooltip arrow title={copy} trigger={"hover"} placement="top">
            <Text
              onClick={() => {
                navigator.clipboard.writeText(address);
                setCopy("Copied");
                setTimeout(() => {
                  setCopy("Copy");
                }, 2000);
              }}
              className="font-weight-600 letter-spacing-small font-medium text-color-two"
            >
              {address.slice(0, 9)}...
              {address.slice(address.length - 9, address.length)}
            </Text>
          </Tooltip>
        </>
      ) : (
        <Text className="font-weight-600 letter-spacing-small font-medium text-color-two">
          ---
        </Text>
      )}
    </>
  );

  const walletItems = (wallet) => {
    return [
      {
        label: (
          <>
            <Badge
              color={activeWallet.includes(wallet) ? "green" : "red"}
              status={activeWallet.includes(wallet) ? "processing" : "error"}
              text={
                <Text className="font-weight-600 letter-spacing-small font-medium text-color-one">
                  {wallet.toUpperCase()} WALLET
                </Text>
              }
            />
          </>
        ),
        key: wallet,
        children: (
          <Row justify={"center"}>
            <Col className="m-bottom">
              {wallet === XVERSE_WALLET_KEY ? (
                <>{renderWalletAddress(xverseAddress)}</>
              ) : wallet === UNISAT_WALLET_KEY ? (
                <>{renderWalletAddress(unisatAddress)}</>
              ) : wallet === MAGICEDEN_WALLET_KEY ? (
                <>{renderWalletAddress(magicEdenAddress)}</>
              ) : (
                <>{renderWalletAddress(metaAddress)}</>
              )}
            </Col>
          </Row>
        ),
      },
    ];
  };

  const radioOptions = [
    {
      label: "Assets",
      value: "Assets",
    },
    {
      label: "Offers",
      value: "Offers",
    },
    {
      label: "Lendings",
      value: "Lendings",
      title: "Lendings",
    },
    {
      label: "Borrowings",
      value: "Borrowings",
    },
  ];

  return (
    <>
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <h1 className="font-xlarge gradient-text-two">Portfolio</h1>
        </Col>

        <Col>
          <Row justify={"end"} align={"middle"} gutter={32}>
            <Col
              style={{
                border: "1px solid grey",
                borderRadius: "10px",
              }}
            >
              <MdTour
                style={{ cursor: "pointer" }}
                onClick={() => setEnableTour(true)}
                color="violet"
                size={32}
              />
            </Col>
            {activeWallet.length ? (
              <Col>
                <button
                  type="button"
                  onClick={() => setDownloadWalletModal(true)}
                  className="dwnld-button"
                >
                  <span className="button__text">Download Wallets</span>
                  <span className="button__icon">
                    <svg
                      className="svg"
                      data-name="Layer 2"
                      id={TOUR_ID}
                      viewBox="0 0 35 35"
                      xmlns={TOUR_SVG}
                    >
                      <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                      <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                      <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
                    </svg>
                  </span>
                </button>
              </Col>
            ) : (
              ""
            )}
          </Row>
        </Col>
      </Row>

      <Row align={"middle"} className={activeWallet.length && "mt-15"}>
        <Col>
          <Flex align="center" gap={5}>
            <FcInfo className="pointer" size={20} />
            <Text className="text-color-two font-small">
              Manage your offers, lending, and borrowing positions. Learn more.{" "}
            </Text>
          </Flex>
        </Col>
      </Row>

      {activeWallet.length ? (
        // && Object.keys(dashboardData).length
        <Row justify={"space-between"} gutter={12} className="mt-15">
          {portfolioCards.map((card, index) => {
            const { icon: Icon, title, value } = card;
            return (
              <Col md={4} key={`${title}-${index}`}>
                <Flex
                  vertical
                  className={`dash-cards-css pointer`}
                  justify="space-between"
                >
                  <Flex justify="space-between" align="center">
                    <Text
                      className={`gradient-text-one font-small letter-spacing-small`}
                    >
                      {title}
                    </Text>
                    <Icon
                      size={25}
                      color="grey"
                      style={{
                        marginTop: "-13px",
                      }}
                    />
                  </Flex>
                  <Flex
                    gap={5}
                    align="center"
                    className={`text-color-two font-small letter-spacing-small`}
                  >
                    {title.includes("Value") ? (
                      <img src={Bitcoin} alt="ckBtc" width={20} />
                    ) : (
                      ""
                    )}{" "}
                    {value ? value : 0}
                  </Flex>
                </Flex>
              </Col>
            );
          })}
        </Row>
      ) : (
        ""
      )}

      <Row align={"middle"} className={activeWallet.length && "mt-15"}>
        <Col xs={24} md={24}>
          <Divider className="m-top-bottom" />
        </Col>
      </Row>

      <Row align={"middle"} justify={"center"} className={"mt-15"}>
        <Radio.Group
          className="radio-css"
          options={radioOptions}
          onChange={({ target: { value } }) => {
            setRadioBtn(value);
          }}
          value={radioBtn}
          size="large"
          buttonStyle="solid"
          optionType="button"
        />
      </Row>

      <ModalDisplay
        open={enableTour}
        onOK={handleTour}
        onCancel={() => setEnableTour(false)}
        title={
          <Row className="black-bg white-color font-large letter-spacing-small iconalignment">
            <MdTour color="violet" /> Enable Tour
          </Row>
        }
      >
        <Text className="white-color font-medium">
          Are you sure you want to enable tour ?
        </Text>
      </ModalDisplay>

      <ModalDisplay
        open={downloadWalletModal}
        footer={null}
        onCancel={() => setDownloadWalletModal(false)}
        title={
          <Row className="black-bg white-color font-large letter-spacing-small iconalignment">
            Supported Wallets
          </Row>
        }
      >
        <WalletUI isAirdrop={false} />
      </ModalDisplay>
    </>
  );
};
export default propsContainer(Portfolio);

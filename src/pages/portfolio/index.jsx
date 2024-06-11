import { Badge, Col, Descriptions, Row, Tooltip, Typography } from "antd";
import React, { useState } from "react";
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
  const xverseAddress = walletState.xverse.ordinals.address;
  const unisatAddress = walletState.unisat.address;
  const magicEdenAddress = walletState.magicEden.ordinals.address;
  const metaAddress = walletState.meta.address;

  const { Text } = Typography;
  const [copy, setCopy] = useState("Copy");
  const [downloadWalletModal, setDownloadWalletModal] = useState(false);
  const [enableTour, setEnableTour] = useState(false);

  const TOUR_SVG = process.env.REACT_APP_TOUR_SVG;
  const TOUR_ID = process.env.REACT_APP_TOUR_ID;

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

      {activeWallet.length ? (
        <Row className="m-top-bottom" gutter={48}>
          {activeWallet.map((wallet, index) => {
            return (
              <Col
                xl={8}
                lg={10}
                md={12}
                xs={24}
                key={`${wallet.key}-${index}`}
                className="m-top-bottom"
              >
                <Descriptions
                  className="pointer box-shadow-one float-up"
                  bordered
                  layout="vertical"
                  contentStyle={{ fontSize: "larger" }}
                  labelStyle={{
                    fontSize: "larger",
                    letterSpacing: "2px",
                    fontWeight: "bold",
                  }}
                  items={walletItems(wallet)}
                />
              </Col>
            );
          })}
        </Row>
      ) : (
        <Row justify={"center"}>
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
            {/* <Text className="text-color-one font-medium text-decor-line value-one letter-spacing-small">
            Download wallets
          </Text> */}
          </Col>
        </Row>
      )}

      {/* <Row align={"middle"}>
        <Col>
          <Flex align="center" gap={10}>
            <Title level={2} className="gradient-text-one">
              Loan Requests
            </Title>
            <Tooltip
              color="purple"
              title={
                <span className="text-color-one">
                  Connect 'PLUG' wallet to display your loans!
                </span>
              }
            >
              <FcInfo className="pointer mt-15" size={25} />
            </Tooltip>
          </Flex>
        </Col>
      </Row>

      <Col>
        <Flex align="center" gap={10}>
          <Title level={2} className="gradient-text-one">
            Your Assets
          </Title>
          <Tooltip
            color={"purple"}
            title={
              <span className="text-color-one">
                Connect any BTC wallet to display your assets!
              </span>
            }
          >
            <FcInfo className="pointer mt-15" size={25} />
          </Tooltip>
        </Flex>
      </Col>

      <Row
        className="m-top-bottom"
        style={{ paddingBottom: "30px" }}
        justify={{
          md: !borrowData
            ? "center"
            : borrowData.length === 0
            ? "center"
            : "start",
          sm: "center",
        }}
        gutter={18}
      >
        {(activeWallet.includes(XVERSE_WALLET_KEY) ||
          activeWallet.includes(UNISAT_WALLET_KEY) ||
          activeWallet.includes(MAGICEDEN_WALLET_KEY)) &&
        borrowData === null ? (
          <Loading className={"m-top-bottom"} indicator={<Bars />}></Loading>
        ) : borrowData === null ? (
          <Flex className="iconalignment m-bottom">
            <FaRegSmileWink className="text-color-one" size={25} />
            <Text className="text-color-one font-large value-one letter-spacing-medium">
              Connect any BTC wallet !
            </Text>
          </Flex>
        ) : borrowData.length === 0 ? (
          <Flex className="iconalignment">
            <ImSad className="text-color-one" size={25} />
            <Text className="text-color-one font-large value-one letter-spacing-medium">
              Seems you have no assets!
            </Text>
          </Flex>
        ) : (
          borrowData.map((card) => {
            const url = `${process.env.REACT_APP_ORDINALS_CONTENT_API}/content/${card.id}`;

            return (
              <>
                <Col key={`${card.id}`} xs={24} sm={12} md={12} lg={8} xl={6}>
                  <CardDisplay
                    cover={
                      card.mimeType === "text/html" ? (
                        <iframe
                          title={`${card.id}-borrow_image`}
                          height={300}
                          src={url}
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`${card.id}-borrow_image`}
                          width={300}
                          height={300}
                        />
                      )
                    }
                    onClick={() => {}}
                    hoverable={true}
                    bordered={false}
                    className={
                      "card-bg dashboard-card-padding m-top-bottom cardrelative dashboard-cards"
                    }
                  >
                    <Row justify={"space-between"}>
                      <Col>
                        <Text className="heading-one font-large text-color-two">
                          ID
                        </Text>
                      </Col>
                      <Col>
                        <Text className="text-color-one font-large value-one">
                          {card.inscriptionNumber}
                        </Text>
                      </Col>
                    </Row>
                  </CardDisplay>
                </Col>
              </>
            );
          })
        )}
      </Row> */}
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

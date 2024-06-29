import { Col, Collapse, Divider, Flex, Row, Typography } from "antd";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { TbInfoSquareRounded } from "react-icons/tb";
import { useSelector } from "react-redux";
import Bitcoin from "../../assets/coin_logo/bitcoin-rootstock.png";
import borrowJson from "../../utils/borrow_abi.json";
import {
  BorrowContractAddress,
  TokenContractAddress,
  contractGenerator,
} from "../../utils/common";
import tokensJson from "../../utils/tokens_abi.json";
import CustomButton from "../Button";
import ModalDisplay from "../modal";
import Notify from "../notification";

const LendModal = ({
  modalState,
  lendModalData,
  toggleLendModal,
  setLendModalData,
  collapseActiveKey,
  setCollapseActiveKey,
}) => {
  /* global BigInt */

  const { Text } = Typography;

  const reduxState = useSelector((state) => state);
  const btcvalue = reduxState.constant.btcvalue;
  const activeWallet = reduxState.wallet.active;
  const metaAddress = reduxState.wallet.meta.address;

  const BTC_ZERO = process.env.REACT_APP_BTC_ZERO;

  const [isOfferBtnLoading, setIsOfferBtnLoading] = useState(false);

  const handleAcceptRequest = async () => {
    try {
      setIsOfferBtnLoading(true);
      const tokensContract = await contractGenerator(
        tokensJson,
        TokenContractAddress
      );

      const isApproved = await tokensContract.methods
        .isApprovedForAll(lendModalData.lender, BorrowContractAddress)
        .call({ from: metaAddress });

      if (!isApproved) {
        Notify("warning", "Lender not approved!");
        setIsOfferBtnLoading(false);
        return;
      }

      const borrowContract = await contractGenerator(
        borrowJson,
        BorrowContractAddress
      );

      const estimateGas = await borrowContract.methods
        .acceptBorrowRequest(Number(lendModalData.requestId), {
          value: Number(lendModalData.loanAmount),
        })
        .estimateGas({
          from: metaAddress,
        });

      const acceptLoan = await borrowContract.methods
        .acceptBorrowRequest(Number(lendModalData.requestId), {
          value: Number(lendModalData.loanAmount),
        })
        .send({
          from: metaAddress,
          gas: Number(estimateGas).toString(),
          gasPrice: 1000000000,
        });

      if (acceptLoan.transactionHash) {
        Notify("success", "Lending success");
        toggleLendModal();
      }

      setIsOfferBtnLoading(false);
    } catch (error) {
      setIsOfferBtnLoading(false);
      console.log("Accept req error", error);
    }
  };

  // const handleEditLend = async () => {
  //   Notify("info", "We'r on it!");
  // };

  // console.log("lendModalData", lendModalData);

  return (
    <ModalDisplay
      footer={null}
      title={
        <Flex align="center" gap={5} justify="start">
          <Text className={`font-size-20 text-color-one letter-spacing-small`}>
            {lendModalData.collectionName}
          </Text>
        </Flex>
      }
      open={modalState}
      onCancel={toggleLendModal}
      width={"35%"}
    >
      {/* Lend Image Display */}
      <Row justify={"space-between"} className="mt-30">
        <Col md={4}>
          <img
            className="border-radius-8"
            alt={`lend_image`}
            src={lendModalData.thumbnailURI}
            onError={(e) =>
              (e.target.src = `${process.env.PUBLIC_URL}/collections/${lendModalData.symbol}.png`)
            }
            width={70}
          />
        </Col>

        <Col md={5}>
          <Flex
            vertical
            justify="center"
            align="center"
            className={`border border-radius-8 pointer`}
          >
            <Text className={`font-small text-color-one letter-spacing-small`}>
              Floor
            </Text>
            <Text
              className={`font-size-16 text-color-two letter-spacing-small`}
            >
              {Number(lendModalData.loanAmount) / BTC_ZERO}
            </Text>
          </Flex>
        </Col>

        <Col md={5}>
          <Flex
            vertical
            justify="center"
            align="center"
            className={`border border-radius-8 pointer`}
          >
            <Text className={`font-small text-color-one letter-spacing-small`}>
              Term
            </Text>
            <Text
              className={`font-size-16 text-color-two letter-spacing-small`}
            >
              {Number(lendModalData.duration)} Days
            </Text>
          </Flex>
        </Col>

        <Col md={5}>
          <Flex
            vertical
            justify="center"
            align="center"
            className={`border border-radius-8 pointer`}
          >
            <Text className={`font-small text-color-one letter-spacing-small`}>
              LTV
            </Text>
            <Text
              className={`font-size-16 text-color-two letter-spacing-small`}
            >
              {lendModalData?.loanToValue ? lendModalData?.loanToValue : 0}%
            </Text>
          </Flex>
        </Col>
      </Row>

      {/* Borrow Divider */}
      <Row justify={"center"}>
        <Divider />
      </Row>

      {/* Lend Offer Summary */}
      <Row className="mt-15">
        <Col md={24} className="collapse-antd">
          <Collapse
            className="border"
            size="small"
            ghost
            expandIcon={({ isActive }) => (
              <FaCaretDown
                color={isActive ? "white" : "#742e4c"}
                size={25}
                style={{
                  transform: isActive ? "" : "rotate(-90deg)",
                  transition: "0.5s ease",
                }}
              />
            )}
            defaultActiveKey={["1"]}
            activeKey={collapseActiveKey}
            onChange={() => {
              if (collapseActiveKey[0] === "1") {
                setCollapseActiveKey(["2"]);
              } else {
                setCollapseActiveKey(["1"]);
              }
            }}
            items={[
              {
                key: "1",
                label: (
                  <Text
                    className={`font-small text-color-one letter-spacing-small`}
                  >
                    Request Summary
                  </Text>
                ),
                children: (
                  <>
                    <Row justify={"space-between"}>
                      <Col>
                        <Text
                          className={`font-size-16 text-color-one letter-spacing-small`}
                        >
                          Loan amount
                        </Text>
                      </Col>
                      <Col>
                        <Flex align="center" gap={10}>
                          <Text
                            className={`card-box border text-color-two padding-small-box padding-small-box font-xsmall`}
                          >
                            ${" "}
                            {(
                              (Number(lendModalData.loanAmount) / BTC_ZERO) *
                              btcvalue
                            ).toFixed(2)}
                          </Text>

                          <Text
                            className={`font-size-16 text-color-one letter-spacing-small`}
                          >
                            ~ {Number(lendModalData.loanAmount) / BTC_ZERO}
                          </Text>
                          <img
                            src={Bitcoin}
                            alt="noimage"
                            style={{ justifyContent: "center" }}
                            width={25}
                          />
                        </Flex>
                      </Col>
                    </Row>

                    <Row justify={"space-between"} className="mt-7">
                      <Col>
                        <Text
                          className={`font-size-16 text-color-one letter-spacing-small`}
                        >
                          Interest
                        </Text>
                      </Col>
                      <Col>
                        <Flex align="center" gap={10}>
                          <Text
                            className={`card-box border text-color-two padding-small-box font-xsmall`}
                          >
                            ${" "}
                            {(
                              (Number(lendModalData.repayAmount) / BTC_ZERO -
                                Number(lendModalData.loanAmount) / BTC_ZERO) *
                              btcvalue
                            ).toFixed(2)}
                          </Text>

                          <Text
                            className={`font-size-16 text-color-one letter-spacing-small`}
                          >
                            ~{" "}
                            {(
                              Number(lendModalData.repayAmount) / BTC_ZERO -
                              Number(lendModalData.loanAmount) / BTC_ZERO
                            ).toFixed(6)}
                          </Text>
                          <img
                            src={Bitcoin}
                            alt="noimage"
                            style={{ justifyContent: "center" }}
                            width={25}
                          />
                        </Flex>
                      </Col>
                    </Row>

                    <Row justify={"space-between"} className="mt-7">
                      <Col>
                        <Text
                          className={`font-size-16 text-color-one letter-spacing-small`}
                        >
                          Platform fee
                        </Text>
                      </Col>
                      <Col>
                        <Flex align="center" gap={10}>
                          <Text
                            className={`card-box border text-color-two padding-small-box font-xsmall`}
                          >
                            ${" "}
                            {(
                              (Number(lendModalData.platformFee) / BTC_ZERO) *
                              btcvalue
                            ).toFixed(2)}
                          </Text>

                          <Text
                            className={`font-size-16 text-color-one letter-spacing-small`}
                          >
                            ~ {Number(lendModalData.platformFee) / BTC_ZERO}
                          </Text>
                          <img
                            src={Bitcoin}
                            alt="noimage"
                            style={{ justifyContent: "center" }}
                            width={25}
                          />
                        </Flex>
                      </Col>
                    </Row>

                    <Row className="mt-15">
                      <Col>
                        <span className={`font-xsmall text-color-two`}>
                          <TbInfoSquareRounded
                            size={12}
                            // color={true ? "#adadad" : "#333333"}
                          />{" "}
                          {`Once a lender accepts the offer and the loan is
                started they will have ${Number(
                  lendModalData.duration
                )} days to repay the loan. If
                the loan is not repaid you will receive the
                collateral. Manage the loans in the portfolio page`}
                        </span>
                      </Col>
                    </Row>
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>

      {/* Lend button */}
      <Row
        justify={activeWallet.length ? "end" : "center"}
        className={`${
          activeWallet.length ? "" : "border"
        } border-radius-8 mt-30`}
      >
        <Col md={24}>
          {activeWallet.length ? (
            <CustomButton
              block
              loading={isOfferBtnLoading}
              className="click-btn font-weight-600 letter-spacing-small"
              title={"Accept loan"}
              onClick={handleAcceptRequest}
            />
          ) : (
            <Flex justify="center">
              <Text
                className={`font-small text-color-one border-padding-medium letter-spacing-small`}
              >
                Connect
              </Text>
            </Flex>
          )}
        </Col>
      </Row>
    </ModalDisplay>
  );
};

export default LendModal;

import { Col, Flex, Grid, Row, Typography } from "antd";
import gsap from "gsap";
import React from "react";
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";
import Bitcoin from "../../assets/coin_logo/bitcoin-rootstock.png";
import rootstock from "../../assets/coin_logo/rootstock_orange_logo.png";
import Loading from "../../component/loading-wrapper/secondary-loader";
import { propsContainer } from "../props-container";

const Footer = (props) => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const breakpoints = useBreakpoint();
  const { reduxState } = props.redux;
  const constantState = reduxState.constant;
  const ethbalance = reduxState.constant.ethbalance;

  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  gsap.to(".round", {
    rotation: 360,
    duration: 4,
    repeat: -1,
    repeatDelay: 10,
    ease: "none",
  });

  return (
    <>
      <Row justify={"space-around"} align={"middle"}>
        <Col>
          <Loading
            spin={!constantState.btcvalue}
            indicator={
              <TailSpin stroke="#6a85f1" alignmentBaseline="central" />
            }
          >
            {constantState.btcvalue ? (
              <Flex gap={5} align="center">
                <img
                  className="round"
                  src={Bitcoin}
                  alt="noimage"
                  style={{ justifyContent: "center" }}
                  width={"25px"}
                  height={breakpoints.xs ? "25px" : ""}
                />
                <Text
                  className={`gradient-text-one ${
                    breakpoints.xs ? "font-xmsmall" : "font-small"
                  } heading-one`}
                >
                  {USDollar.format(constantState.btcvalue)}
                </Text>
              </Flex>
            ) : (
              ""
            )}
          </Loading>
        </Col>

        <Col>
          <Flex gap={5} align="center">
            <img
              className="round"
              src={rootstock}
              alt="noimage"
              style={{ justifyContent: "center" }}
              width={30}
              height={breakpoints.xs ? "25px" : ""}
            />
            {ethbalance ? (
              <Text
                className={`gradient-text-one ${
                  breakpoints.xs ? "font-xmsmall" : "font-small"
                } heading-one`}
              >
                {ethbalance.toFixed(5)}
              </Text>
            ) : (
              <Text
                className={`gradient-text-one ${
                  breakpoints.xs ? "font-xmsmall" : "font-small"
                } heading-one`}
              >
                -
              </Text>
            )}
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default propsContainer(Footer);

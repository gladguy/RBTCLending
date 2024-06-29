import {
  Col,
  Divider,
  Flex,
  Grid,
  Layout,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import gsap from "gsap";
import React, { Suspense } from "react";
import { FaMedium, FaSquareXTwitter, FaTelegram } from "react-icons/fa6";
import { GrMail } from "react-icons/gr";
import { SiDiscord } from "react-icons/si";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import logo from "../../assets/logo/RBTC_logo_text.png";
import LoadingWrapper from "../../component/loading-wrapper";
import Mainheader from "../../container/footer";
import Nav from "../../container/nav";
import { publicRoutes } from "../../routes";

const MainLayout = () => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const MAIL_TO = process.env.REACT_APP_MAILTO;
  const ORDINALS_MEDIUM = process.env.REACT_APP_ORDINALS_MEDIUM;
  const TWITTER_LINK = process.env.REACT_APP_TWITTER_LINK;

  const footerText = `All rights reserved © Copyright ${new Date().getFullYear()}`;

  gsap.to(".round", {
    rotation: 360,
    duration: 4,
    repeat: -1,
    repeatDelay: 10,
    ease: "none",
  });
  gsap.fromTo(
    ".slide",
    { autoAlpha: 0, backgroundColor: "red" },
    { autoAlpha: 1, duration: 0.5, backgroundColor: "red" }
  );

  return (
    <React.Fragment>
      <Header className="header-sticky z-index">
        <Row justify={"center"}>
          <Col xs={23}>
            <Nav />
          </Col>
        </Row>
      </Header>
      <Layout>
        <Layout className="slide" style={{ backgroundColor: "black" }}>
          {/* Don't touch content minHeight */}
          <Content className="theme-bg" style={{ minHeight: "85.60vh" }}>
            <Row justify={"center"} className="blurEffect">
              <Col xs={23} md={21}>
                <Routes>
                  {publicRoutes.map((route, index) => {
                    let Component = route.component;
                    return (
                      <Route
                        key={`route-${index}`}
                        path={route.path}
                        element={
                          <Suspense
                            fallback={
                              <LoadingWrapper>Loading...</LoadingWrapper>
                            }
                          >
                            <Component />
                          </Suspense>
                        }
                      />
                    );
                  })}
                </Routes>
              </Col>
            </Row>
          </Content>

          <Flex vertical>
            {location.pathname === "/" ? (
              <>
                <Footer
                  className="collection-bg-one"
                  style={{ padding: "20px" }}
                >
                  <Row justify={"center"} className="mt-30">
                    <Col xs={24} md={22}>
                      <Row justify={"space-between"} gutter={20}>
                        <Col md={7}>
                          <Flex vertical gap={10} wrap="wrap">
                            <Text
                              className={`gradient-text-one font-large font-weight-600 letter-spacing-small ${
                                screens.xs ? "text-decor-line" : ""
                              }`}
                            >
                              Lightning Payment
                            </Text>
                            <Text className="text-color-two font-small letter-spacing-small">
                              Ordinals payment are powered by Chain-key Bitcoin
                              (ckBTC) is an ICRC-2-compliant token that is
                              backed 1:1 by bitcoins held 100% on the IC
                              mainnet.
                            </Text>
                          </Flex>
                        </Col>

                        <Col md={7}>
                          <Flex vertical gap={10} wrap="wrap">
                            <Text
                              className={`gradient-text-one font-large font-weight-600 letter-spacing-small ${
                                screens.xs ? "mt text-decor-line" : ""
                              }`}
                            >
                              PSBTs and DLCs
                            </Text>
                            <Text className="text-color-two font-small letter-spacing-small">
                              Partially Signed Bitcoin Transactions (PSBTs) &
                              Discreet Log Contract (DLC) are used to facilitate
                              the transactions and securely escrow the Ordinal.
                            </Text>
                          </Flex>
                        </Col>

                        <Col md={7}>
                          <Flex vertical gap={10} wrap="wrap">
                            <Text
                              className={`gradient-text-one font-large font-weight-600 letter-spacing-small ${
                                screens.xs ? "mt text-decor-line" : ""
                              }`}
                            >
                              No Wrapping
                            </Text>
                            <Text className="text-color-two font-small letter-spacing-small">
                              You don't need to wrap your Ordinals or use
                              intermediaries because everything occurs on
                              Layer-1 Bitcoin.
                            </Text>
                          </Flex>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row
                    justify={"center"}
                    className={screens.md ? "mt-50" : "mt-15"}
                    style={{ paddingBottom: "50px" }}
                  >
                    <Col md={22}>
                      <Row
                        justify={{ md: "space-between", xs: "center" }}
                        align={"middle"}
                      >
                        <Col xs={{ order: "2" }} md={{ order: "1" }}>
                          <Flex justify="center" vertical>
                            <img
                              src={logo}
                              alt="logo"
                              className="pointer"
                              width={300}
                            />
                            <Text className="gradient-text-one font-small font-family-one letter-spacing-small">
                              {footerText}
                            </Text>
                          </Flex>
                        </Col>

                        <Col
                          xs={{ span: 24, order: "1" }}
                          md={{ span: 16, order: "2" }}
                          sm={16}
                          lg={10}
                        >
                          <Flex vertical gap={15}>
                            {screens.md && (
                              <Col>
                                <Flex vertical gap={15} wrap="wrap">
                                  <Flex justify="space-between" wrap="wrap">
                                    <Text
                                      onClick={() => {
                                        navigate("/lending");
                                        window.scrollTo(0, 0);
                                      }}
                                      className="text-color-two headertitle title pointer font-small letter-spacing-small"
                                    >
                                      Lending
                                    </Text>
                                    <Text
                                      onClick={() => {
                                        navigate("/myassets");
                                        window.scrollTo(0, 0);
                                      }}
                                      className="text-color-two headertitle title pointer font-small letter-spacing-small"
                                    >
                                      My Assets
                                    </Text>
                                    <Text
                                      onClick={() => {
                                        navigate("/portfolio");
                                        window.scrollTo(0, 0);
                                      }}
                                      className="text-color-two headertitle title pointer font-small letter-spacing-small"
                                    >
                                      Portfolio
                                    </Text>
                                  </Flex>
                                </Flex>
                              </Col>
                            )}

                            <Row justify={"center"}>
                              <Divider style={{ margin: 0 }} />
                            </Row>

                            {screens.xs && (
                              <Row
                                justify={"center"}
                                style={{ marginTop: screens.xs && "-15px" }}
                              >
                                <Text className="text-color-one dash-headings letter-spacing-medium font-xxlarge font-weight-600">
                                  Follow us on
                                </Text>
                              </Row>
                            )}

                            <Flex
                              justify="space-between"
                              className={screens.xs && "mt-15"}
                            >
                              <Tooltip
                                arrow
                                title={"myordinalsloan@gmail.com"}
                                trigger={"hover"}
                              >
                                <Text className="font-xlarge">
                                  <a href={MAIL_TO}>
                                    {" "}
                                    <GrMail
                                      color="#ebe6c8"
                                      className="pointer homepageicon"
                                    />
                                  </a>
                                </Text>
                              </Tooltip>
                              <Link target={"_blank"} to={ORDINALS_MEDIUM}>
                                <Text className="font-xlarge pointer">
                                  <FaMedium
                                    color="#ebe6c8"
                                    className="homepageicon"
                                  />
                                </Text>
                              </Link>
                              <Link target={"_blank"} to={TWITTER_LINK}>
                                <Text className="font-xlarge pointer">
                                  <FaSquareXTwitter
                                    color="#ebe6c8"
                                    className="homepageicon"
                                  />
                                </Text>
                              </Link>
                              <Text className="font-xlarge pointer">
                                <FaTelegram
                                  color="#ebe6c8"
                                  className="homepageicon"
                                />
                              </Text>
                              <Text className="font-xlarge pointer">
                                <SiDiscord
                                  color="#ebe6c8"
                                  className="homepageicon"
                                />
                              </Text>
                            </Flex>
                          </Flex>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Footer>
              </>
            ) : null}

            {/* <Footer
              className="black-bg"
              style={{ borderTop: "1px solid #434343" }}
            >
              <Row justify={"center"}>
                <Col xs={22}>
                  <Row justify={"center"}>

                    <Col>
                      <Text className="font-medium text-color-two">
                        {footerText}
                      </Text>
                    </Col>

                  </Row>
                </Col>
              </Row>
            </Footer> */}
            <div className="value-header">
              <Header className="header z-index">
                <Row justify={"center"}>
                  <Col xs={21}>
                    <Mainheader />
                  </Col>
                </Row>
              </Header>
            </div>
          </Flex>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default MainLayout;

import React from "react";
import ButtonStyled from "../../Reusable Components/Buttons/ButtonStyled";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import Flip from "react-reveal/Flip";
import Fade from "react-reveal/Fade";
import "./BlueSection.css";

function BlueSection() {
  return (
    <Fade big>
      <div className="BlueContainer">
        <div className="container Bluesplit w-100 ">
          <div className="w-100 bluesplitWidth p-1 w-100">
            <Heading1
              color="white"
              paddingInline=""
              paddingBlock=""
              size="2.6rem"
              weight="500"
              JFcontent="left"
              marginBottom="5px"
              SMsize="2rem"
              style={{}}
            >
              Try the platform now and access exclusive features
            </Heading1>

            {/* <Heading1
                            color="white"
                            paddingInline=""
                            paddingBlock=""
                            size="1rem"
                            weight="400"
                            JFcontent="left"
                            marginBottom="5px"
                            style={{}}
                        >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the </Heading1> */}
          </div>

          <div className="w-100 bluesplitWidth p-1 blueRow">
            <div className="BlueFormContainer">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ gap: "10px", position: "relative" }}
              >
                <i class="fab fa-uikit quoteImage"></i>
              </div>
              <Heading1
                color="grey"
                paddingInline=""
                paddingBlock=""
                size="1.5rem"
                weight="700"
                JFcontent="left"
                marginBottom="-3px"
                width="fit-content"
                style={{}}
              >
                Request a Demo{" "}
              </Heading1>

              <Heading1
                color="grey"
                paddingInline=""
                paddingBlock=""
                size="1rem"
                weight="350"
                JFcontent="left"
                marginBottom="5px"
                style={{}}
              >
                Manage your project with smart AI features that help you save
                time.
              </Heading1>

              {/* <a href="AboutusPage#Demo" className="w-100">
                <ButtonStyled
                  color="white"
                  border="none"
                  paddingInline="0rem"
                  paddingBlock="0.5rem"
                  borderRadius="8px"
                  size="1rem"
                  width="100%"
                  backgroundColor="var(--blue)"
                >
                  Continue
                </ButtonStyled>
              </a> */}
              <a href="https://stonai.com/AboutusPage#Demo" className="w-100">
                <ButtonStyled
                  color="white"
                  border="none"
                  paddingInline="0rem"
                  paddingBlock="0.5rem"
                  borderRadius="8px"
                  size="1rem"
                  width="100%"
                  backgroundColor="var(--blue)"
                >
                  Continue
                </ButtonStyled>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}

export default BlueSection;

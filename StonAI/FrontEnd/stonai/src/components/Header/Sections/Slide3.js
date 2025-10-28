import React from 'react';
import Heading1 from '../../../Reusable Components/Headings/Heading1';
import ButtonUnstyled from "../../../Reusable Components/Buttons/ButtonStyled";
import Headerimage from "../Assets/slide3.jpg";
import "../Header.css";


function Slide3() {
    return (
        <div className="container HeaderinnerContainer w-100">


                <img className="Headerimage text-focus-in-image" src={Headerimage} />
           
            <div className="HeaderTextContainer text-focus-in w-100">
                <Heading1
                    color="var(--blue)"
                    paddingInline=""
                    paddingBlock=""
                    size="35px"
                    weight="400"
                    width="100%"
                    lineHeight=""
                    SMsize="20px"
                    className="TextAlignHeader"
                    style={{ flexDirection: "column" }}
                >
                     Not just an AI
                    <Heading1
                        color="gray"
                        size="25px"
                        weight="350"
                        width="100%"
                        marginBottom="0px"
                        SMsize="18px"
                        style={{ flexDirection: "column" }}
                        className="fade-in-bottom"
                    >
                        Advanced set of AI models connected to comprehend the essential time consuming processes in the projects
                        <span>

                            The first set of AI models designed for project management.
                        </span>
                        {/* <div className="headerButtonContainer">
                            <ButtonUnstyled
                                color="var(--blue)"
                                border="2px solid var(--blue)"
                                paddingInline="1rem"
                                paddingBlock="0.5rem"
                                borderRadius="8px"
                                size="1rem"
                                width="fit-content"
                                Msize=""
                                SMsize=""
                                SMpaddingInline=".5rem"
                                SMpaddingBlock=".3rem"
                            >
                                Get Started
                            </ButtonUnstyled>
                        </div> */}
                    </Heading1>
                </Heading1>
            </div>
        </div>
    );
}
export default Slide3;

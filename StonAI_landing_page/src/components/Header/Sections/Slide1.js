import React from 'react';
import Heading1 from '../../../Reusable Components/Headings/Heading1';

import Headerimage from "../Assets/Header.png";
import "../Header.css";


function Slide1() {
    return (
        <div className="container HeaderinnerContainer w-100">


            <img className="Headerimage text-focus-in-image" src={Headerimage} alt=""/>

            <div className="HeaderTextContainer text-focus-in w-100">
                <Heading1
                    color="var(--blue)"
                    paddingInline=""
                    paddingBlock=""
                    size="25px"
                    weight="400"
                    width="100%"
                    lineHeight=""
                    SMsize="20px"
                    className="TextAlignHeader caps "
                    style={{ flexDirection: "column" }}
                >
                    <span>  The <span style={{
                        display: "inline",
                        width: "fit-content",
                        fontWeight: "570"
                    }}>Artificial intelligence </span>

                        <span style={{
                            display: "inline",
                            width: "fit-content",
                            fontWeight: "400"
                        }}>Management for Your</span>

                        <span style={{
                            display: "inline",
                            width: "fit-content",
                            fontWeight: "570"
                        }}> Project</span>

                    </span>

                    <Heading1
                        color="gray"
                        size="23px"
                        weight="350"
                        width="100%"
                        marginBottom="0px"
                        SMsize="18px"
                        style={{ flexDirection: "column" }}
                        className="fade-in-bottom nocaps"
                    >
                        Manage your project more efficiently saving time and cost
                        <span>

                            {/* The first set of AI models designed for project management. */}
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
export default Slide1;

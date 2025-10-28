import React from 'react';
import Heading1 from '../../../Reusable Components/Headings/Heading1';
import Headerimage from "../Assets/slide2b.jpg";
import "../Header.css";


function Slide2() {
    return (
        <div className="container HeaderinnerContainer w-100">


            <img className="Headerimage text-focus-in-image slide2Image" src={Headerimage} alt=""/>

            <div className="HeaderTextContainer text-focus-in w-100">
                <Heading1
                    color="var(--blue)"
                    paddingInline=""
                    paddingBlock=""
                    size="30px"
                    weight="400"
                    width="100%"
                    lineHeight=""
                    SMsize="20px"
                    className="TextAlignHeader caps"
                    style={{ flexDirection: "column" }}
                >

                    <span className="">
                        <span style={{
                            display: "inline",
                            width: "fit-content",
                            fontWeight: "570",
                            marginRight: "5px"

                        }}>Connecting</span>

                        <span className='ProjectBlink ' style={{
                            display: "inline",
                            width: "fit-content",
                            fontWeight: "570"
                        }}>Projects</span>

                        <span className='departmentBlink' style={{
                            display: "inline",
                            width: "fit-content",
                            fontWeight: "570"
                        }}>Departments</span>

                        <span className='staffBlink' style={{
                            display: "inline",
                            width: "fit-content",
                            fontWeight: "570"
                        }}> Staff</span>

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
                        Connect your project pillars coherently to utilize your resources efficiently.
                    </Heading1>
                </Heading1>
            </div>
        </div >
    );
}
export default Slide2;

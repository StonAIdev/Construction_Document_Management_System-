import React from 'react';
import Heading1 from '../../../Reusable Components/Headings/Heading1';
import Headerimage from "../Assets/slide3.jpg";
import "../Header.css";


function Slide3() {
    return (
        <div className="container HeaderinnerContainer w-100">


            <img className="Headerimage text-focus-in-image" alt="" src={Headerimage} />

            <div className="HeaderTextContainer3 text-focus-in w-100" >
                <Heading1
                    color="var(--blue)"
                    paddingInline=""
                    paddingBlock=""
                    size="25px"
                    weight="570"
                    width="fit-content"
                    lineHeight=""
                    SMsize="20px"
                    className="TextAlignHeader caps"
                    style={{ flexDirection: "column", display: "inline" }}
                >
                    Not just <span style={{
                        display: "inline",
                        width: "fit-content",
                        fontWeight: "400",
                    }}>an Aritifical intelligence </span>

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
                        Advanced set of AI models connected to comprehend the essential time consuming processes in the projects
                        <span>

                            The first set of AI models designed for project management.
                        </span>

                    </Heading1>
                </Heading1>

            </div>
        </div>
    );
}
export default Slide3;

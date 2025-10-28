import React from 'react';
import Heading1 from '../../../Reusable Components/Headings/Heading1';
import ButtonUnstyled from "../../../Reusable Components/Buttons/ButtonStyled";
import Headerimage from "../Assets/slide2b.jpg";
import "../Header.css";


function Slide2() {
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
                     Connecting Project staff / department
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
                        Connect your project pillars coherently to utilize your resources efficiently.
                    </Heading1>
                </Heading1>
            </div>
        </div>
    );
}
export default Slide2;

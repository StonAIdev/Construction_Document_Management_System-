import React from 'react'
import Heading1 from '../../Reusable Components/Headings/Heading1'
import './LandingCycle.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";
import Fade from 'react-reveal/Fade';
import SubHeading from '../../Reusable Components/Headings/SubHeading';


function LandingCycle() {
    return (
        <div className='LandingCycleContainer container'>
            <div>
                <SubHeading>LandingCycle</SubHeading>
                <hr className='headingLine' />
            </div>

            <div className='CycleDiv'>

<Fade left big>
                <div className='CycleCard'>
                    <img className='CycleImage  ' src='https://en.pimg.jp/070/538/018/1/70538018.jpg' />
                    <Heading1
                        color="var(--blue)"
                        paddingInline=""
                        paddingBlock=""
                        size="1.5rem"
                        weight="500"
                        JFcontent="left"
                        marginBottom="5px"
                        style={{ paddingInline: "10px" }}
                    >Title</Heading1>

                    <Heading1
                        color="var(--)"
                        paddingInline=""
                        paddingBlock=""
                        size="1rem"
                        weight="350"
                        JFcontent="left"
                        marginBottom="10px"
                        style={{ paddingInline: "10px", marginTop: "10px" }}
                    >rem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt nibh eu semper ornare. Pellent</Heading1>
                </div>
</Fade>

                {/* <div>
                    <FontAwesomeIcon icon={faLongArrowAltRight} className="CycleArrow" />
                </div> */}

<Fade top big>
                <div className='CycleCard'>
                    <img className='CycleImage  ' src='https://en.pimg.jp/070/538/018/1/70538018.jpg' />
                    <Heading1
                        color="var(--blue)"
                        paddingInline=""
                        paddingBlock=""
                        size="1.5rem"
                        weight="500"
                        JFcontent="left"
                        marginBottom="5px"
                        style={{ paddingInline: "10px" }}
                    >Title</Heading1>

                    <Heading1
                        color="var(--)"
                        paddingInline=""
                        paddingBlock=""
                        size="1rem"
                        weight="350"
                        JFcontent="left"
                        marginBottom="10px"
                        style={{ paddingInline: "10px", marginTop: "10px" }}
                    >rem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt nibh eu semper ornare. Pellent</Heading1>
                </div>
</Fade >

                {/* <div>
                    <FontAwesomeIcon icon={faLongArrowAltRight} className="CycleArrow" />
                </div> */}
<Fade right big>
                <div className='CycleCard'>
                    <img className='CycleImage  ' src='https://en.pimg.jp/070/538/018/1/70538018.jpg' />
                    <Heading1
                        color="var(--blue)"
                        paddingInline=""
                        paddingBlock=""
                        size="1.5rem"
                        weight="500"
                        JFcontent="left"
                        marginBottom="5px"
                        style={{ paddingInline: "10px" }}
                    >Title</Heading1>

                    <Heading1
                        color="var(--)"
                        paddingInline=""
                        paddingBlock=""
                        size="1rem"
                        weight="350"
                        JFcontent="left"
                        marginBottom="10px"
                        style={{ paddingInline: "10px", marginTop: "10px" }}
                    >rem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt nibh eu semper ornare. Pellent</Heading1>
                </div>
</Fade>

            </div>
        </div>
    )
}

export default LandingCycle

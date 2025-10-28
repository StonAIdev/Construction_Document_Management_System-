import React from 'react'
import ButtonStyled from '../../Reusable Components/Buttons/ButtonStyled'
import Heading1 from '../../Reusable Components/Headings/Heading1'
import Fade from 'react-reveal/Fade';
import Logo from '../Assets/LogoStonai.png';
import './BlueSection.css'

function BlueSection() {
    return (

        <Fade big>
            <div className='BlueContainer'>
                <div className='container Bluesplit w-100 '>
                    <div className='w-100 bluesplitWidth p-1 w-100'>
                        <Heading1
                            color="white"
                            paddingInline=""
                            paddingBlock=""
                            size="2.6rem"
                            weight="300"
                            JFcontent="left"
                            marginBottom="5px"
                            SMsize="2rem"
                        >

                            <span>
                                <span style={{fontWeight:"600", display:"inline"}}>Try </span>
                                 the platform now and access 
                                 <span style={{fontWeight:"600", display:"inline"}}> exclusive</span> features
                            </span></Heading1>

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

                    <div className='w-100 bluesplitWidth p-1 blueRow'>


                        <div className='BlueFormContainer'>
                            <div className='d-flex align-items-center justify-content-center' style={{ gap: "10px", position: "relative" }}>
                                {/* <i class="fab fa-uikit quoteImage"></i> */}

                            </div>
                            <Heading1
                                color="black"
                                paddingInline=""
                                paddingBlock=""
                                size="2.5rem"
                                weight="600"
                                JFcontent="left"
                                marginBottom="-3px"
                                width="fit-content"
                                style={{ gap: "10px", alignItems: "center" }}
                            >Try  <img src={Logo} alt="StonAI" style={{ width: "120px", height: "70%" }} /> </Heading1>

                            <Heading1
                                color="grey"
                                paddingInline=""
                                paddingBlock=""
                                size="1rem"
                                weight="350"
                                JFcontent="left"
                                marginBottom="5px"
                                style={{}}
                            >Manage your project with smart AI features that help you save time.
                            </Heading1>

                            <a href="AboutusPage#Demon" className='w-100'>
                                <ButtonStyled
                                    color="white"
                                    border="none"
                                    paddingInline="0rem"
                                    paddingBlock="0.5rem"
                                    borderRadius="8px"
                                    size="1rem"
                                    width="100%"
                                    backgroundColor="var(--blue)"
                                >Request a Demo</ButtonStyled>
                            </a>


                        </div>
                    </div>

                </div>
            </div>
        </Fade>

    )
}

export default BlueSection

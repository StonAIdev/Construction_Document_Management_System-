import React, { useState } from 'react'
import Heading1 from '../../Reusable Components/Headings/Heading1'
import Fade from 'react-reveal/Fade';
import './Offerings.css'
import SubHeading from '../../Reusable Components/Headings/SubHeading';
import image1 from './Assets/ocr.jpg'
import image2 from './Assets/dataUtil.jpg'
import image3 from './Assets/userProfile.jpg'
import image4 from './Assets/search.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderNone, faSearch, faUserCog, faUsers } from '@fortawesome/free-solid-svg-icons';

function Offerings() {

    const [videoboximage, setVideoboximage] = useState(image1);


    function Changeimage1() {
        setVideoboximage(image1)
        document.getElementById("videoarea").style.transition = ".2s ease";
    }

    function Changeimage2() {
        setVideoboximage(image2)
        document.getElementById("videoarea").style.transition = ".2s ease";
    }

    function Changeimage3() {
        setVideoboximage(image3)
        document.getElementById("videoarea").style.transition = ".2s ease";
    }

    function Changeimage4() {
        setVideoboximage(image4)
        document.getElementById("videoarea").style.transition = ".2s ease";
    }
    return (
        <div className='container OfferingsContainer'>

            <div>
                <SubHeading>
                    <Fade top cascade>
                        What We Offer
                    </Fade>
                </SubHeading>
                <hr className='headingLine' />
            </div>

            <div className=' OfferingSplit'>
                
                <div className=' col-md-5 col-sm-12 OfferingAlignment OfferHover'>

                    <Fade right cascade>

                        <div className='OfferingCardsContainer OfferHover' onMouseOver={Changeimage1}>

                            <div className='d-flex w-100'>
                                <div className='offeringIconContainer' style={{ width: "5rem" }}>
                                    <FontAwesomeIcon className='OfferingIcon' icon={faBorderNone} style={{ color: "var(--orange)" }} />
                                </div>
                                <div className='d-flex flex-column justify-content-left' style={{ width: "80%" }}>

                                    <Heading1
                                        color="var(--blue)"
                                        size="1.4rem"
                                        weight="350"
                                        JFcontent="left"
                                        marginBottom="3px"

                                        style={{ marginTop: "0.8rem" }}
                                    >Data Extraction </Heading1>

                                    <Heading1
                                        color="var(--)"
                                        paddingInline=""
                                        paddingBlock=""
                                        size=".9rem"
                                        weight="350"
                                        JFcontent="left"
                                        marginBottom="15px"

                                        style={{ paddingRight: "15px" }}
                                    >
                                        Our proprietary OCR extracts data automatically from any uploaded document where the data can be utilized based on the user need.
                                    </Heading1>
                                </div>

                            </div>

                        </div>

                        <div className='OfferingCardsContainer'  onMouseOver={Changeimage2}>

                            <div className='d-flex w-100'>
                                <div className='offeringIconContainer' style={{ width: "5rem" }}>
                                    <FontAwesomeIcon className='OfferingIcon' icon={faUserCog} style={{ color: "var(--orange)" }} />
                                </div>
                                <div className='d-flex flex-column justify-content-left' style={{ width: "80%" }}>

                                    <Heading1
                                        color="var(--blue)"
                                        size="1.4rem"
                                        weight="350"
                                        JFcontent="left"
                                        marginBottom="3px"

                                        style={{ marginTop: "0.8rem" }}
                                    >Data Utilization </Heading1>

                                    <Heading1
                                        color="var(--)"
                                        paddingInline=""
                                        paddingBlock=""
                                        size=".9rem"
                                        weight="350"
                                        JFcontent="left"
                                        marginBottom="15px"

                                        style={{ paddingRight: "15px", flexDirection: "column" }}
                                    >
                                        Our state of art Machine learning models with the power of NLP utilizes the project data and information optimally.
                                    </Heading1>
                                </div>

                            </div>

                        </div>

                        <div className='OfferingCardsContainer' onMouseOver={Changeimage3}>

                            <div className='d-flex w-100'>
                                <div className='offeringIconContainer' style={{ width: "5rem" }}>
                                    <FontAwesomeIcon className='OfferingIcon' icon={faUsers} style={{ color: "var(--orange)" }} />
                                </div>
                                <div className='d-flex flex-column justify-content-left' style={{ width: "80%" }}>

                                    <Heading1
                                        color="var(--blue)"
                                        size="1.4rem"
                                        weight="350"
                                        JFcontent="left"
                                        marginBottom="3px"

                                        style={{ marginTop: "0.8rem" }}
                                    > Unique User Profile </Heading1>

                                    <Heading1
                                        color="var(--)"
                                        paddingInline=""
                                        paddingBlock=""
                                        size=".9rem"
                                        weight="350"
                                        JFcontent="left"
                                        marginBottom="15px"

                                        style={{ paddingRight: "15px" }}
                                    >
                                        StonAI has deployed a tailored AI model to learn, adopt and enhance to each employee considering role, scope of work and responsibilities.
                                    </Heading1>
                                </div>

                            </div>

                        </div>

                        <div className='OfferingCardsContainer' onMouseOver={Changeimage4}>

                            <div className='d-flex w-100'>
                                <div className='offeringIconContainer' style={{ width: "5rem" }}>
                                    <FontAwesomeIcon className='OfferingIcon' icon={faSearch} style={{ color: "var(--orange)" }} />
                                </div>
                                <div className='d-flex flex-column justify-content-left' style={{ width: "80%" }}>

                                    <Heading1
                                        color="var(--blue)"
                                        size="1.4rem"
                                        weight="350"
                                        JFcontent="left"
                                        marginBottom="3px"

                                        style={{ marginTop: "0.8rem" }}
                                    > Search and Action </Heading1>

                                    <Heading1
                                        color="var(--)"
                                        paddingInline=""
                                        paddingBlock=""
                                        size=".9rem"
                                        weight="350"
                                        JFcontent="left"
                                        marginBottom="15px"

                                        style={{ paddingRight: "15px" }}
                                    >
                                        Integration of different AI models to assist you find information and documents with a blink of an eye and action them with a click.
                                    </Heading1>
                                </div>

                            </div>

                        </div>

                    </Fade>

                </div>

                <div className=' col-md-5 col-sm-12 d-flex flex-column align-items-center justify-content-between'>

                    <Fade top>
                        <div className='VideoBox' id="videoarea" style={{
                            backgroundImage: `url(${videoboximage})`
                        }}>
                            
                        </div>
                    </Fade>
                </div>

            </div>
        </div>
    )
}

export default Offerings

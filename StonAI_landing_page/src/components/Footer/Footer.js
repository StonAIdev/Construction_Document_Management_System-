import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// eslint-disable-next-line
import { faHome, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";


import './Footer.css'

function Footer() {
    const navigate = useNavigate();

    const scrollToOfferings = () => {
        document.getElementById("Offerings").scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };
    const scrollToWhyStonAI = () => {
        document.getElementById("WhyStonAI").scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const offeringClickHandler = async () => {
        await navigate("/landing", { replace: true });
        scrollToOfferings();
    };
    const whyStonAiClickHandler = async () => {
        await navigate("/landing", { replace: true });
        scrollToWhyStonAI();
    };


    return (
        <div className='FooterContainer'>
            <hr className='footerline' />

            <footer class="page-footer font-small unique-color-dark">



                {/* <!-- Footer Links --> */}
                <div class="container text-center text-md-left mt-5">

                    {/* <!-- Grid row --> */}
                    <div class="row mt-3 tl" style={{ textAlign: "left" }}>

                        {/* <!-- Grid column --> */}
                        <div class="col-sm-12 col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">

                            {/* <!-- Content --> */}
                            <h6 class="text-uppercase font-weight-bold">StonAI</h6>
                            <hr class="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto footerLine" style={{ width: "60px" }} />
                            <p>StonAI is a new technology business focusing on enhancing and implementing advanced artificial intelligence models in project management.</p>

                        </div>

                        {/* <!-- Grid column --> */}
                        <div class="col-sm-12 col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">

                            {/* <!-- Links --> */}
                            <h6 class="text-uppercase font-weight-bold footerHeadColor">Useful links</h6>
                            <hr class="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto footerLine" style={{ width: "60px" }} />


                            <p>
                                <a className='footerLinkColor' onClick={whyStonAiClickHandler} href="#!" >Why StonAI</a>
                            </p>
                            <p>
                                <a className='footerLinkColor' onClick={offeringClickHandler} href="#!">StonAI Offerings</a>
                            </p>
                            <p onClick={() => navigate("/AboutusPage", { replace: true })}>
                                <a className='footerLinkColor' href="#AboutUs">About Us</a>
                            </p>
                            <p
                                onClick={() => navigate("/legal", { replace: true })}
                            >
                                <a className='footerLinkColor' href="#legal" >Legal</a>
                            </p>

                        </div>
                        {/* <!-- Grid column --> */}

                        {/* <!-- Grid column --> */}
                        <div class="col-sm-12 col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">

                            {/* <!-- Links --> */}
                            <h6 class="text-uppercase font-weight-bold footerHeadColor">Contact</h6>
                            <hr class="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto footerLine" style={{ width: "60px" }} />

                            <p>
                                <FontAwesomeIcon icon={faHome} className="mr-2" /> Dubai-UAE</p>
                            <p>
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> info@stonai.com</p>
                            {/* <p>
                                <FontAwesomeIcon icon={faPhone} className="mr-2" /> +971 50 5077114</p> */}

                        </div>
                        {/* <!-- Grid column --> */}

                    </div>
                    {/* <!-- Grid row --> */}

                </div>
                {/* <!-- Footer Links --> */}

                {/* <!-- Copyright --> */}

                <div class="footer-copyright text-center">
                    <hr class="deep-purple accent-2 mb-2 mt-0 d-inline-block mx-auto footerLine" style={{ width: "90vw", textAlign: "center" }} />

                    <div className="copyrights">
                        <div className='d-flex justify-content-center'>
                            <p className='mr-1'> © 2021 Copyright: </p>
                            <a href="/"> stonai.com</a>
                        </div>

                        <p className='ZaytricsLink'> Powered by <a href='https://zaytrics.com/' target="_blank" rel="noopener noreferrer">Zaytrics</a></p>
                    </div>
                </div>
                {/* <!-- Copyright --> */}

            </footer>
        </div>
    )
}

export default Footer

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEnvelope,
  faPhone,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";

import "./Footer.css";

function Footer() {
  return (
    <div className="FooterContainer">
      <hr className="footerline" />

      <footer class="page-footer font-small unique-color-dark">
        {/* <!-- Footer Links --> */}
        <div class="container text-center text-md-left mt-5">
          {/* <!-- Grid row --> */}
          <div class="row mt-3 tl" style={{ textAlign: "left" }}>
            {/* <!-- Grid column --> */}
            <div class="col-sm-12 col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              {/* <!-- Content --> */}
              <h6 class="text-uppercase font-weight-bold">StonAI</h6>
              <hr
                class="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto footerLine"
                style={{ width: "60px" }}
              />
              <p>
                StonAI is a new technology business focusing on enhancing and
                implementing advanced artificial intelligence models in project
                management.
              </p>
            </div>

            {/* <!-- Grid column --> */}
            <div class="col-sm-12 col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              {/* <!-- Links --> */}
              <h6 class="text-uppercase font-weight-bold footerHeadColor">
                Useful links
              </h6>
              <hr
                class="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto footerLine"
                style={{ width: "60px" }}
              />

              <p>
                <a className="footerLinkColor" href="#Header">
                  Home
                </a>
              </p>
              <p>
                <a className="footerLinkColor" href="#WhyStonAI">
                  Why StonAI
                </a>
              </p>
              <p>
                <a className="footerLinkColor" href="#Offerings">
                  StonAI Offerings
                </a>
              </p>
              <p>
                <a className="footerLinkColor" href="#!">
                  About Us
                </a>
              </p>
            </div>
            {/* <!-- Grid column --> */}

            {/* <!-- Grid column --> */}
            <div class="col-sm-12 col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              {/* <!-- Links --> */}
              <h6 class="text-uppercase font-weight-bold footerHeadColor">
                Contact
              </h6>
              <hr
                class="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto footerLine"
                style={{ width: "60px" }}
              />

              <p>
                <FontAwesomeIcon icon={faHome} /> Street x, Gulf
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} /> info @example.com
              </p>
            </div>
            {/* <!-- Grid column --> */}
          </div>
          {/* <!-- Grid row --> */}
        </div>
        {/* <!-- Footer Links --> */}

        {/* <!-- Copyright --> */}

        <div class="footer-copyright text-center">
          <hr
            class="deep-purple accent-2 mb-2 mt-0 d-inline-block mx-auto footerLine"
            style={{ width: "90vw", textAlign: "center" }}
          />

          <div className="d-flex justify-content-center">
            <p className="mr-1"> © 2021 Copyright: </p>
            <a href=""> example.com</a>
          </div>
        </div>
        {/* <!-- Copyright --> */}
      </footer>
    </div>
  );
}

export default Footer;

import React from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import "./Header.css";
import Slide1 from "./Sections/Slide1";
import Slide2 from "./Sections/Slide2";
import Slide3 from "./Sections/Slide3";

function Header() {
  return (
    <div className="HeaderContainer ">

      {/* <div className=" B2 d-flex flex-column w-100 justify-content-center HeaderinnerContainer">
       

        <div className=" d-flex justify-content-center">
          <img className="Headerimage text-focus-in-image" src={Headerimage} />
        </div>

        <div className="HeaderTextContainer text-focus-in">
          <Heading1
            color="var(--blue)"
            paddingInline=""
            paddingBlock=""
            size="5.5vh"
            weight="400"
            lineHeight=""
            Lgsize="4.5vh"
            Msize="3.5vh"
            SMsize="3.5vh"
            className="TextAlignHeader"
            style={{ flexDirection: "column" }}
          >
            The AI for your project
            <Heading1
              color="gray"
              size="3.5vh"
              weight="350"
              marginBottom=".5rem"
              Lgsize="3vh"
              Msize="2.5vh"
              SMsize="2.5vh"
              style={{ flexDirection: "column" }}
              className="fade-in-bottom"
            >
              Manage project smarter and save time
              <span>
                
              The first set of AI models designed for project management.
              </span>
              <div className="headerButtonContainer">
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
              </div>
            </Heading1>
          </Heading1>
        </div>
      </div> */}

      <Carousel
        swipeable={true}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlay={true}

        removeArrowOnDeviceType={["tablet", "mobile"]}
        autoPlaySpeed="5500"
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"

        className="carouselStyling"
      >
        <div className=" d-flex justify-content-center"><Slide1 /></div>
        <div className=" d-flex justify-content-center"><Slide2 /></div>
        <div className=" d-flex justify-content-center"><Slide3 /></div>
      </Carousel>;

    </div>
  );
}

export default Header;


const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
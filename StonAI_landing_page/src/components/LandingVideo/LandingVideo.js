import React from 'react';
import SubHeading from '../../Reusable Components/Headings/SubHeading';
import Fade from 'react-reveal/Fade';
import ReactPlayer from "react-player"
import "./LandingVideo.css"
function LandingVideo() {


    return (
        <div className='container OfferingsContainer'>
            <div>
                <SubHeading>
                    <Fade top cascade>
                        How it Works
                    </Fade>
                </SubHeading>
                <hr className='headingLine' />
            </div>

            <div className='alignVideo'>
                <div className='videosize'>
                    <ReactPlayer
                        url="https://www.youtube.com/watch?v=VS1Rk6xklOI"
                    />
                </div>

            </div>
        </div>
    )
}

export default LandingVideo;

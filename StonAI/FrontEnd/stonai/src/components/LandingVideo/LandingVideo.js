import React from 'react';
import SubHeading from '../../Reusable Components/Headings/SubHeading';
import Fade from 'react-reveal/Fade';
import "./LandingVideo.css"

import video from "./Assets/StonaiVideo.mp4"
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

                <video controls className='videosize'>

                    <source src={video} type="video/mp4" />


                    Sorry, your browser doesn't support embedded videos.
                </video>

</div>
            </div>
            )
}

            export default LandingVideo;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import Heading1 from '../../../Reusable Components/Headings/Heading1'
import './WhyCard.css'

function WhyCards(props) {

    const { title, details, image } = props;
    return (
        <div className='WhyCardContainer'>
            <div className='d-flex w-100 align-items-center' style={{ height: "5.5em" }}>
                <div className='' style={{ width: "90px" }}>
                    {/* <img className='WhyIcon' src={image} /> */}
                    <FontAwesomeIcon icon={image} className='WhyIcon' />
                </div>

                <Heading1
                    color="var(--blue)"
                    size="1.3rem"
                    weight="400"
                    JFcontent="left"

                    style={{ marginTop: "0px", paddingRight: "10px" }}
                > {title} </Heading1>
            </div>
            <div>
                <Heading1
                    color="var(--)"
                    paddingInline="10px"
                    paddingBlock="0px"
                    size="1rem"
                    weight="350"
                    JFcontent="left"
                    marginBottom="15px"
                    align="justify"

                    className='WhycardText'

                    style={{ paddingRight: "15px", paddingBottom: "15px" }}
                >{details}</Heading1>
            </div>

        </div>
    )
}

export default WhyCards

import React from 'react';
import "./Pricing.css"
import SubHeading from "../../Reusable Components/Headings/SubHeading"
import Heading1 from '../../Reusable Components/Headings/Heading1'
import Fade from 'react-reveal/Fade';
import PricingCard from './PricingCard';
import GetQuotecard from './GetQuotecard';


const Pricing = () => {
    return (
        <div className='container-fluid PricingsContainer'>
            <div>
                <SubHeading>
                    <Fade top cascade>
                        Pricing
                    </Fade>
                </SubHeading>
                <hr className='headingLine' />
            </div>

            <div className='priceCardsContainer'>
                <PricingCard/>
                <PricingCard/>
                <PricingCard/>
                <GetQuotecard/>
            </div>
        </div>
    );
};

export default Pricing;

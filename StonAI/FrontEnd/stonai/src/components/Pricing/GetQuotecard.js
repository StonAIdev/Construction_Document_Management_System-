import React from 'react';
import "./Pricing.css"
import SubHeading from "../../Reusable Components/Headings/SubHeading"
import Heading1 from '../../Reusable Components/Headings/Heading1'
import { faCheck, faCheckCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonStyled from '../../Reusable Components/Buttons/ButtonStyled';


function GetQuotecard() {
    return (
        <div className='priceCardMain grow' >
            <Heading1 size="1.5em" weight='500' className='PriceText align-items-center'>
                 <Heading1 size="2.2em" weight='600' className='PriceText'> Custom</Heading1>

            </Heading1>

            <Heading1 size='1.6em' weight='500' color='white' paddingBlock='10px' style={{marginTop:"40px"}}>
                Personalize Usecase
            </Heading1>

            <Heading1 size='0.9em' weight='500' color='white' paddingBlock='0px' JFcontent='center' style={{textAlign:"center", marginTop:"30px"}}>
                This package is designed for companies with Custom requirements. To get the quote for your custom requirement please contact us.
            </Heading1>

        

            <ButtonStyled
                color="white"
                border=""
                paddingInline=".5em"
                paddingBlock=".3em"
                borderRadius="8px"
                backgroundColor="var(--orange)"

                className='buttonprice'
            >
                Get Quote
            </ButtonStyled>





        </div>
    )
}

export default GetQuotecard;

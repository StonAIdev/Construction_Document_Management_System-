import React from 'react';
import "./Pricing.css"
import SubHeading from "../../Reusable Components/Headings/SubHeading"
import Heading1 from '../../Reusable Components/Headings/Heading1'
import { faCheck, faCheckCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonStyled from '../../Reusable Components/Buttons/ButtonStyled';

function PricingCard() {
  return (
      <div className='priceCardMain grow'>
          <Heading1 size="1.5em" weight='500' className='PriceText align-items-center'>
              $ <Heading1 size="2.3em" weight='700' className='PriceText'> 99</Heading1>
             
          </Heading1>

          <Heading1 size='1.6em' weight='500' color='white' paddingBlock='10px'>
                Title
          </Heading1>

          <Heading1 size='0.9em' weight='500' color='white' paddingBlock='0px' JFcontent='center'>
                This package is designed for small size companies
          </Heading1>

          <div className='detailsflex'>
              <FontAwesomeIcon icon={faCheckCircle} className='checkicon'/>
              <Heading1 className='detailstext'> Package Option 1 </Heading1>
              <FontAwesomeIcon icon={faQuestionCircle} className='Questionmarkicon'/>
          </div>
          
          <div className='detailsflex'>
              <FontAwesomeIcon icon={faCheckCircle} className='checkicon'/>
              <Heading1 className='detailstext'> Package Option 1 </Heading1>
              <FontAwesomeIcon icon={faQuestionCircle} className='Questionmarkicon'/>
          </div>

          <div className='detailsflex'>
              <FontAwesomeIcon icon={faCheckCircle} className='checkicon'/>
              <Heading1 className='detailstext'> Package Option 1 </Heading1>
              <FontAwesomeIcon icon={faQuestionCircle} className='Questionmarkicon'/>
          </div>

          <div className='detailsflex'>
              <FontAwesomeIcon icon={faCheckCircle} className='checkicon'/>
              <Heading1 className='detailstext'> Package Option 1 </Heading1>
              <FontAwesomeIcon icon={faQuestionCircle} className='Questionmarkicon'/>
          </div>

          <div className='detailsflex'>
              <FontAwesomeIcon icon={faCheckCircle} className='checkicon'/>
              <Heading1 className='detailstext'> Package Option 1 </Heading1>
              <FontAwesomeIcon icon={faQuestionCircle} className='Questionmarkicon'/>
          </div>

          <div className='detailsflex'>
              <FontAwesomeIcon icon={faCheckCircle} className='checkicon'/>
              <Heading1 className='detailstext'> Package Option 1 </Heading1>
              <FontAwesomeIcon icon={faQuestionCircle} className='Questionmarkicon'/>
          </div>


          <ButtonStyled
          color ="white"
          border =""
          paddingInline =".5em"
          paddingBlock =".3em"
          borderRadius ="8px"
          backgroundColor ="var(--orange)"
     

          className='buttonprice'
          >
              Subscribe Now
          </ButtonStyled>





      </div>
  );
}

export default PricingCard;

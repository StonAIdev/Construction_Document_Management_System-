import React from 'react';
import "./Privacy.css"
import returnimg from "./Assets/return.jpg"

function ReturnPolicy() {
    return (
        <p>
            <img src={returnimg} alt="" className="privacyimg" style={{ float: "right" }} />

            <p>We&rsquo;re so convinced you&rsquo;ll absolutely love our services, that we&rsquo;re willing to offer a 7 day risk-free money back guarantee. If you are not satisfied with the service for any reason you can get a refund within 7 days of making a purchase. Please keep in mind that even though we offer a full money back guarantee, we will issue a refund only for the unused portion of the service.</p>
            <p><strong>Additional services</strong></p>
            <p>Please note that any additional services, custom work or technical support are non-refundable as our time cannot be recovered.</p>
            <p><strong>Contacting us</strong></p>
            <p>If you have any questions, concerns, or complaints regarding this refund policy, we encourage you to contact us using the details below:</p>
            <a href='https://www.stonai.com/contact/'> www.stonai.com/contact</a>
            <p>legal@stonai.com</p>
            <p>This document was last updated on January 26, 2022</p>
            
        </p>
    );
}

export default ReturnPolicy;

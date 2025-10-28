import React from 'react'
import Heading1 from '../../../Reusable Components/Headings/Heading1'

function ParagraphCardEmail({para}) {
    return (
        <div className='AnsCard_Email'>
            <Heading1 color='grey' size='1.1em' JFcontent='left' >
            {para}
            </Heading1>
        </div>
    )
}

export default ParagraphCardEmail

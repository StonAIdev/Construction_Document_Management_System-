import React from 'react'
import'./FloatImage.css'
import Network from "./Asserts/Network.png"

function FloatImage() {
    return (
            <div className='floatcontainer'>
                <img src={Network}  className='FloatImage'/>
            </div>
    )
}

export default FloatImage

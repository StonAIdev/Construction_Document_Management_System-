import React from 'react'
import Empty from "./empty.png"
import Bounce from 'react-reveal/Bounce';
function EmptyFolder() {
    return (
        <div className='d-flex flex-column justify-content-center align-items-center'
            style={{ background: "#ffffff" }}>
            <div className='d-flex justify-content-center text-focus-in'
            style={{animationDelay:".4s"}}>
                <img src={Empty} alt='nothing here' style={{ maxWidth: "100vw", maxHeight: "100vh" }} />
            </div>
            <Bounce top cascade>
                <h3 style={{ marginTop: "-8rem", marginBottom: "3em" }}>There are no items here</h3>
            </Bounce>
        </div>
    )
}

export default EmptyFolder
import React from 'react'
import './DashCard.css'

function Invitecard() {
    return (
        <div className='inviteparent'>
            <img className='dashCardimg' src='https://icon-library.com/images/icon-png-images/icon-png-images-17.jpg' />
            <h3 style={{color:"white", marginTop:"-1rem", fontSize:"20px"}}>Add user and get work done</h3>
            <h3 style={{color:"white", marginTop:"-1rem", fontSize:"20px", fontWeight:"300"}}>Add more users in the project</h3>
            <input type='button' value='Add' className='invitebutton'/>
        </div>
    )
}

export default Invitecard

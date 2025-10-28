import React from 'react'
import './DashCard.css'

function DashboardCard() {
    return (
        <div className='Dashcard'>
            
                <img className='dashCardimg' src='https://icon-library.com/images/icon-png-images/icon-png-images-17.jpg' />
                <vl className='cardline'/>
                <div className='d-flex flex-column justify-content-between'>
                    <h4> Folder Name</h4>
                    <h3 className='DashCardNumber'>12</h3>
                </div>
           
            <div className='cardsidebar'>

            </div>
        </div>
    )
}

export default DashboardCard

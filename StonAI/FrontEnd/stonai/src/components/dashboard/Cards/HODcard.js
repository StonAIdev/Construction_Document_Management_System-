import React from 'react';
import Heading1 from '../../../Reusable Components/Headings/Heading1'
import './DashCard.css'

import SpeedIcon from '@mui/icons-material/Speed';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';

function HODcard(props) {
    const { id, image, folderName, number, unit, fadeDelay } = props
    return (
        <div className='Dashcard grow' style={{ animationDelay: fadeDelay + 's' }}>

            <div className='d-flex flex-column w-100' style={{ height: "80%" }}>
                <Heading1
                    color="var(--blue)"
                    size="1.2em"
                    weight="400"
                    marginBottom=""
                    JFcontent="left"
                >{folderName}</Heading1>

                <div className='d-flex justify-content-between' style={{ height: "100%" }}>
                    <Heading1
                        color="var(--blue)"
                        size="1.9-em"
                        weight="500"
                        marginBottom=""
                        JFcontent="Start"
                    >{number} <span style={{ fontSize: "22px", marginTop: "8px" }}>{unit}</span></Heading1>

                    {id === 1 ? <SpeedIcon className='dashCardimg' /> : null}
                    {id === 2 ? <AccessAlarmIcon className='dashCardimg' /> : null}
                    {id === 3 ? <QueryBuilderIcon className='dashCardimg' /> : null}

                    {/* <img className='dashCardimg' src={image} /> */}
                </div>


            </div>
        </div>
    );
}

export default HODcard;

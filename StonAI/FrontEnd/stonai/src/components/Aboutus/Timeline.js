import React from 'react';
import "./Timeline.css"

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import Typography from '@mui/material/Typography';
import CodeIcon from '@mui/icons-material/Code';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import LinkIcon from '@mui/icons-material/Link';
import ApiIcon from '@mui/icons-material/Api';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';

function TimelineStonai() {
  return (
    <div className='TimelineParrent'>
        <div style={{position:"absolute"}}>
      <Timeline position="alternate" className='timelineWidth'>
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
            className="rotatetext rotatwonly"
          >
            2019
          </TimelineOppositeContent>

          <TimelineSeparator className="circleHover">
            <TimelineConnector />
            <TimelineDot className='TimelineCircle' style={{ background: "var(--green)" }}>

              <HouseSidingIcon  className='rotatwonly'/>

            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>

          <TimelineContent sx={{ py: '25px', px: 2 }} className="textappear rotaterelative" >
            <Typography variant="h6" component="span" className='rotatetext rotateabsolute'>
              StonAI Established
            </Typography>
          </TimelineContent>
        </TimelineItem>
        {/* **************************************************************** */}
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            variant="body2"
            color="text.secondary"
            className="rotatetext rotatwonly"
          >
            2020
          </TimelineOppositeContent>
          <TimelineSeparator className="circleHover">
            <TimelineConnector />
            <TimelineDot color="primary" className='TimelineCircle' style={{ background: "var(--green)" }}>

              <CodeIcon  className='rotatwonly'/>

            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '25px', px: 2 }} className="textappear rotaterelative">
            <Typography variant="h6" component="span" className="rotatetext rotateabsolute">
              Development of AI Models (phase 1)
            </Typography>
          </TimelineContent>
        </TimelineItem>
        {/* ************************************************************* */}
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
            className="rotatetext rotatwonly"
          >
            2021
          </TimelineOppositeContent>

          <TimelineSeparator className="circleHover">
            <TimelineConnector />
            <TimelineDot className='TimelineCircle' style={{ background: "var(--green)" }}>

              <LinkIcon  className='rotatwonly' />
              

            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>

          <TimelineContent sx={{ py: '25px', px: 2 }} className="textappear rotaterelative" >
            <Typography variant="h6" component="span" className="rotatetext rotateabsolute">
              Integration of AI Models (phase 1)
            </Typography>
          </TimelineContent>
        </TimelineItem>
        {/* **************************************************************** */}
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            variant="body2"
            color="text.secondary"
            className="rotatetext rotatwonly"
          >
            2022
          </TimelineOppositeContent>
          <TimelineSeparator className="circleHover">
            <TimelineConnector />
            <TimelineDot color="primary" className='TimelineCircle' style={{ background: "var(--blue)" }}>

              <LaptopMacIcon  className='rotatwonly' />

            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '25px', px: 2 }} className="textappear rotaterelative">
            <Typography variant="h6" component="span" className="rotatetext rotateabsolute">
              StonAI launched
            </Typography>
          </TimelineContent>
        </TimelineItem>
        {/* ************************************************************* */}
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
            className="rotatetext rotatwonly"
          >
            2022
          </TimelineOppositeContent>

          <TimelineSeparator className="circleHover">
            <TimelineConnector />
            <TimelineDot className='TimelineCircle' style={{ background: "var(--grey)" }}>

              <ApiIcon  className='rotatwonly' />

            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>

          <TimelineContent sx={{ py: '25px', px: 2 }} className="textappear rotaterelative" >
            <Typography variant="h6" component="span" className="rotatetext rotateabsolute">
              Development of AI Models (phase 2-Advanced)
            </Typography>
          </TimelineContent>
        </TimelineItem>
        {/* **************************************************************** */}
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            variant="body2"
            color="text.secondary"
            className="rotatetext rotatwonly"
          >
            2023
          </TimelineOppositeContent>
          <TimelineSeparator className="circleHover">
            <TimelineConnector />
            <TimelineDot color="primary" className='TimelineCircle' style={{ background: "var(--grey)" }}>

              <AutoAwesomeMosaicIcon  className='rotatwonly' />

            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '25px', px: 2 }} className="textappear rotaterelative">
            <Typography variant="h6" component="span" className="rotatetext rotateabsolute">
              Integration of AI Models (Advanced Management)
            </Typography>
          </TimelineContent>
        </TimelineItem>
        {/* ************************************************************* */}
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
            className="rotatetext rotatwonly"
          >
            2024
          </TimelineOppositeContent>

          <TimelineSeparator className="circleHover">
            <TimelineConnector />
            <TimelineDot className='TimelineCircle' style={{ background: "var(--grey)" }}>

              <SettingsEthernetIcon  className='rotatwonly' />

            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>

          <TimelineContent sx={{ py: '25px', px: 2 }} className="textappear rotaterelative" >
            <Typography variant="h6" component="span" className="rotatetext rotateabsolute">
              Development of AI Models (Reasoning AI)
            </Typography>
          </TimelineContent>
        </TimelineItem>
        {/* **************************************************************** */}
        <TimelineItem>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            variant="body2"
            color="text.secondary"
            className="rotatetext rotatwonly"
          >
            2025
          </TimelineOppositeContent>
          <TimelineSeparator className="circleHover">
            <TimelineConnector />
            <TimelineDot color="primary" className='TimelineCircle' style={{ background: "var(--grey)" }}>

              <IntegrationInstructionsIcon  className='rotatwonly' />

            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '25px', px: 2 }} className="textappear rotaterelative">
            <Typography variant="h6" component="span" className="rotatetext rotateabsolute">
              Integration of AI Models (Reasoning AI)
            </Typography>
          </TimelineContent>
        </TimelineItem>
        {/* ************************************************************* */}

      </Timeline>
      
  </div>
    </div>
  )
}

export default TimelineStonai;


const EXAMPLE = [
  {
    data: "2019",
    status: "status",
    statusB: "StonAI Established",
    statusE: "Admission Open"
  },
  {
    data: "2021",
    status: "status",
    statusB: "StonAI Launched",
    statusE: "Open for Fillup"
  },
  {
    data: "2021",
    status: "status",
    statusB: "Integration of Ai Model 1 ",
    statusE: "process"
  },
  {
    data: "2021",
    status: "status",
    statusB: "Integration of Ai Model 2",
    statusE: "Done"
  },
];

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Paper, Stack, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import "./Doclist.css"


export default function Chips({ value, onClick }) {
  const maxChip = 2;
  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={0.5}
      justifyContent="flex-start"
    >
      {value?.tags4 && value?.tags4.slice(0, maxChip).map((data) => {
        return (
        <Tooltip title={data} placement='top'>
          <Chip
            size="small"
            variant="outlined"
            label={data}
            className="MaterialTableChips"
          />
          </Tooltip>
        );
      })}
      {value?.tags4?.length > 2 &&

        <Tooltip title="Show more" placement='top'>
          <Chip size="small" icon={<ReadMoreIcon />} label="" sx={{ fontWeight: "700" }} onClick={() => { onClick(value) }} />
        </Tooltip>
      }

      {/* {value?.tags4?.length>2 && <Chip size="small" icon={<Add/>} label="More" onClick={()=>{onClick(value)}}/>} */}

    </Stack>
  );
}

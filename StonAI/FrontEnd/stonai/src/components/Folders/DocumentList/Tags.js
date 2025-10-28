import React, { useEffect } from "react";
import {

  Button,

} from "@mui/material";
import AddTagsBox from "./AddTagsBox";
import { Popover, Typography } from "@mui/material";

export default function Tags({ project,user,value }){
    const [anchorElTag, setAnchorElTag] = React.useState(null);
    const [values,setValues]= React.useState();
    const handleClickTag = (event) => {
      setAnchorElTag(event.currentTarget);
    };
  
    const handleCloseTag = () => {
      setAnchorElTag(null);
    };
  
    const openTag = Boolean(anchorElTag);
    const idTag = openTag ? 'simple-popover' : undefined;
    useEffect(()=>{
        console.log("value",value);
    },[])
    return (
        <>
        <Button aria-describedby={idTag} variant="contained" onClick={handleClickTag}>
            Tags
        </Button>
        <Popover
            id={idTag}
            open={openTag}
            anchorEl={anchorElTag}
            onClose={handleCloseTag}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
        >
            <AddTagsBox
                project={project}
                user={user}
                value={value}
            />
        </Popover>
        </>
    )
}




import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; 
import { getColorFromConfidence } from "./ConditionalStyling";
import Typography from "@mui/material/Typography";
export default function ConfidenceKey(){
    return(
        <div>
        {/* <Typography style={{ fontSize: "13px", fontWeight: "600", color: "var(--blue)" }}>Extraction Confidence Range </Typography>

        <div className="ConditionalKey">
          <div style={{ backgroundColor: `${getColorFromConfidence(10)}` }}> <ArrowDownwardIcon className="icon1" /> 0% to 49%</div>
          <div style={{ backgroundColor: `${getColorFromConfidence(70)}` }}> <ArrowDownwardIcon className="icon2" /> 50% to 79%</div>
          <div style={{ backgroundColor: `${getColorFromConfidence(100)}` }}> <ArrowDownwardIcon className="icon3" /> 80% to 100%</div>
        </div> */}
      </div>
    );

}

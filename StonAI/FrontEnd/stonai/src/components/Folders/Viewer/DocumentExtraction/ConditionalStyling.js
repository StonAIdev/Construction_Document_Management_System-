function convertInputIntoPositivePercentage(confidence){
    if(typeof confidence === 'number'){
        var positiveConfidence = Math.abs(confidence);
        if(positiveConfidence<=1 && positiveConfidence>=0){
            return positiveConfidence*100;
        }else{
            return positiveConfidence;
        }

    }else{
        return null;
    }
}

export const getColorFromConfidence = (confidence) => {
    return "transparent";
    // var positiveConfidenceInPercent = convertInputIntoPositivePercentage(confidence);
    // if(positiveConfidenceInPercent!= null && positiveConfidenceInPercent>=0 && positiveConfidenceInPercent<50){
    //     return "var(--warningRed)";
    // }else if(positiveConfidenceInPercent>=50 && positiveConfidenceInPercent<80){
    //     return "var(--orange)";
    // }else if(positiveConfidenceInPercent>=80 && positiveConfidenceInPercent<=100){
    //     return "var(--green)";
    // }else{
    //     return "transparent";
    // }
};
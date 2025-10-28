export function removeTimeFromDate(date){
    console.log("date123",date)
    
    let dateArr =date?.split("T");
    let dateToReturn = dateArr?.[0] ?? ""
    return dateToReturn;
}
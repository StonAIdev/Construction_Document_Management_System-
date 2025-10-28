import differenceInBusinessDays from 'date-fns/differenceInBusinessDays'
import axios from "axios";
import {url} from '../../../url';

function convertDbDocCatToFrontEnd(document_category){
    if(document_category==="Material Submittals"||document_category==="material_submittal"){
        return "material_submittal";
    }else if(document_category==="Site Instruction"){
        return "site_instruction";
    }else if(document_category==="Shop Drawing Submittals"||document_category==="shop_drawing_submital"||document_category==="shop_drawing_submittal"){
        return "shop_drawing_submital";
    }else if(document_category==="Technical Submittal"){
        return "technical_submittal";
    }else if(document_category==="Method Statement Submittal"){
        return "method_statement_submittal";
    }else if(document_category==="Non Conformance Report"){
        return "non_conformance_report";
    }else if(document_category==="Prequalification Submittal"){
        return "prequalification_submittal";
    }else if(document_category==="Request for Information"){
        return "request_for_information";
    }else if(document_category==="Work Inspection Request"){
        return "work_inspection_request";
    }else if(document_category==="Meterial Inspection Request"){
        return "meterial_inspection_request";
    }else if(document_category==="Architectural Inspection Request"){
        return "architectural_inspection_request";
    }
}
function getAllowedDurationForDocumentCategory(document_category,allowedDuration){
    return allowedDuration[convertDbDocCatToFrontEnd(document_category)];
}
export function getDiffInWorkingDays(start_date,end_date,allowedDuration,document_category){
    console.log("document_categorydelays",document_category)
    console.log("allowedDuration",allowedDuration);
    console.log("getAllowedDurationForDocumentCategory(document_category,allowedDuration))",getAllowedDurationForDocumentCategory(document_category,allowedDuration))
    
    var tempEnd_date;
    if(end_date === ""){
        tempEnd_date = new Date();
    }else{
        tempEnd_date=new Date(end_date);
    }
    console.log("start_date",start_date);
    console.log("tempEnd_date",tempEnd_date);
    var delayed =(differenceInBusinessDays(tempEnd_date , (new Date(start_date))) - getAllowedDurationForDocumentCategory(document_category,allowedDuration));
    if(delayed<0 ||!delayed){
        delayed="No";
    }
    return delayed;
}

export const getAllowedDelayedForProject = async(project_id,user)=>{
    const response = await axios.post(url+'/Project/getProject',{project_id:project_id},{ headers:{'token':user.token}});
    const allowedDuration = {
        architectural_inspection_request:response?.data?.[0]?.architectural_inspection_request,
        material_submittal:response?.data?.[0]?.material_submittal,
        meterial_inspection_request:response?.data?.[0]?.meterial_inspection_request,
        method_statement_submittal:response?.data?.[0]?.method_statement_submittal,
        non_conformance_report:response?.data?.[0]?.non_conformance_report,
        prequalification_submittal:response?.data?.[0]?.prequalification_submittal,
        request_for_information:response?.data?.[0]?.request_for_information,
        shop_drawing_submital:response?.data?.[0]?.shop_drawing_submital,
        site_instruction:response?.data?.[0]?.site_instruction,
        technical_submittal:response?.data?.[0]?.technical_submittal,
        work_inspection_request:response?.data?.[0]?.work_inspection_request
    }
    return allowedDuration;
}


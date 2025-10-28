import { url } from "../url";
import axios from "axios";
export const getOtherCategoryNames = async (project_id,subContractor,user,setOtherCats) => {
    console.log("getSubcontractor", project_id,subContractor, user);
    var tempSubCon;
    console.log("array",typeof subContractor);
    console.log("array",subContractor);
    if(typeof subContractor === 'List'){
      tempSubCon=subContractor[0]
    }else{
      tempSubCon=subContractor
    }
    try {
      const res = await axios.post(
        url + "/Project/getOtherCategoryNames",
        {
          project_id: project_id,
          subContractor:tempSubCon
        },
        {
          headers: { token: user.token },
        }
      );
      console.log("getSubcontractorRes", res.data);
      setOtherCats(res.data);
      return res.data;
    } catch (error) {
      console.log("Error:", error);
    }
};
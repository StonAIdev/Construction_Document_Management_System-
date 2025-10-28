import axios from "axios";
import { url } from "../url";

var CoverPageContext = {
  //   responsabilityMatrixSearch: async (searchText, user, project) => {
  //     try {
  //       var res = await axios.post(
  //         url + "/Document/searchResponsabilityMatrix",
  //         { searchText, project },
  //         {
  //           headers: { token: user.token },
  //         }
  //       );
  //       return res.data;
  //     } catch (e) {
  //       console.log(e);
  //       throw e;
  //     }
  //   },
  creatingOrEditing: "create",
  coverPageOf: "",
  coverpage_id: "",
};

export default CoverPageContext;

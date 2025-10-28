import axios from "axios";
import { url } from "./url";

var globalVars = {
  responsabilityMatrixSearch: async (
    searchText,
    user,
    project,
    subContractor
  ) => {
    console.log("subContractor", subContractor);
    if (subContractor && subContractor.length > 0) {
      try {
        var res = await axios.post(
          url + "/Document/searchResponsabilityMatrix",
          { searchText, project, subContractor },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      try {
        var res = await axios.post(
          url + "/Document/searchResponsabilityMatrix",
          { searchText, project },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  },
  searchRef: [],
  tenderSearch: async (searchText, user, project, subContractor) => {
    if (subContractor && subContractor.length > 0) {
      try {
        var res = await axios.post(
          url + "/Document/searchTenderAddendaFilter",
          { searchText, project, subContractor },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      try {
        var res = await axios.post(
          url + "/Document/searchTenderAddenda",
          { searchText, project },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  },
  tenderRef: [],
  contractSearch: async (
    searchText,
    user,
    project,
    subContractor,
    searchType
  ) => {
    console.log("subContractor123", subContractor);
    if (typeof subContractor !== "undefined") {
      try {
        var res = await axios.post(
          url + "/Document/searchPdfContractTextFilter",
          { searchText, project, subContractor },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      try {
        var res1 = await axios.post(
          url + "/Document/searchPdfContractText",
          { searchText, project, searchType },
          {
            headers: { token: user.token },
          }
        );
        console.log(res1.data, "data from backend");
        return res1.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  },

  contractRef: [],
  otherTextSearch: async (
    searchText,
    user,
    project,
    subContractor,
    otherDocumentCategory,
    searchType
  ) => {
    console.log("subContractor123", subContractor);
    if (
      typeof subContractor !== "undefined" ||
      (typeof otherDocumentCategory !== "undefined" &&
        otherDocumentCategory !== "")
    ) {
      try {
        var res = await axios.post(
          url + "/Document/searchOtherTextFilter",
          { searchText, project, subContractor, otherDocumentCategory },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      try {
        var res = await axios.post(
          url + "/Document/searchOtherText",
          { searchText, project, searchType },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  },
  otherTexttRef: [],
  otherTableSearch: async (
    searchText,
    user,
    project,
    subContractor,
    otherDocumentCategory
  ) => {
    console.log("subContractor123", typeof subContractor);
    console.log("otherDocumentCategory", typeof otherDocumentCategory);
    if (
      typeof subContractor !== "undefined" ||
      (typeof otherDocumentCategory !== "undefined" &&
        otherDocumentCategory !== "")
    ) {
      try {
        var res = await axios.post(
          url + "/Document/searchOtherTableFilter",
          { searchText, project, subContractor, otherDocumentCategory },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      try {
        var res = await axios.post(
          url + "/Document/searchOtherTable",
          { searchText, project },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  },
  otherTableRef: [],
  BOQSearch: async (searchText, user, project, subContractor) => {
    if (subContractor && subContractor.length > 0) {
      try {
        var res = await axios.post(
          url + "/Document/searchBOQFilter",
          { searchText, project, subContractor },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      try {
        var res = await axios.post(
          url + "/Document/searchBOQ",
          { searchText, project },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  },
  BOQRef: [],
  MOMSearch: async (searchText, user, project, subContractor, searchType) => {
    if (subContractor && subContractor.length > 0) {
      try {
        var res = await axios.post(
          url + "/Document/searchMOMFilter",
          { searchText, project, subContractor },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    } else {
      try {
        var res = await axios.post(
          url + "/Document/searchMOM",
          { searchText, project, searchType },
          {
            headers: { token: user.token },
          }
        );
        return res.data;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  },
  MOMRef: [],
  contractTableRef: [],
};

export default globalVars;

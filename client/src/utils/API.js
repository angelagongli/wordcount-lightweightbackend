import axios from "axios";

export default {
  getPaper: function() {
    return axios.get("/api/papers");
  },
  deletePaper: function() {
    return axios.delete("/api/papers");
  }
};

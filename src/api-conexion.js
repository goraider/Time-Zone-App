import axios from "axios";

export default axios.create({

  baseURL: "http://worldtimeapi.org/api",
  headers: {
    "Content-type": "application/json"
  }
  
});
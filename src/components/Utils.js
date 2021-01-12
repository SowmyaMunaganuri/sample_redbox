import {options} from "../api/endpoints";
const baseUrl = `${options.url}`;
var userID = localStorage.getItem("username");

//DRILLING DEFAULT
export function getDrillsDataSync() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `${options.url}/drilling_default`, false);
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var querystring = "userIDStr=" + userID;
    try {
      xhr.send(querystring);
      if (xhr.status !== 200) {
        //console.log(`Error ${xhr.status}: ${xhr.statusText}`);
      } else {
        console.log("========Succeeded drilling_default===============");
      }
    } catch (err) {
      console.log("json request failed");
    }
    return xhr.response;
  }
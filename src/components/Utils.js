import {options} from "../api/endpoints";
const baseUrl = `${options.url}`;
var userID = 'sadmin';

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

export function getCompletionDataSync() {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `${options.url}/completion_default`, false);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  var querystring = `userIDStr=` + userID;
  try {
    xhr.send(querystring);
    if (xhr.status !== 200) {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      console.log("========Succeeded completion_default===============");
    }
  } catch (err) {
    console.log("json request failed");
  }
  return xhr.response;
}

export function getDrillingAreaInfo() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `${options.url}/retrieve_drilling_area_info`, false);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  let querystring = `userIDStr=` + userID;
  try {
    xhr.send(querystring);
    if (xhr.status !== 200) {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
    }
  } catch (err) {
    console.log("json request failed");
  }
  return xhr.response;
}

export function getCompAreaInfo() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `${options.url}/retrieve_completion_area_info`, false);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  let querystring = `userIDStr=` + userID;
  try {
    xhr.send(querystring);
    if (xhr.status !== 200) {
      //console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      //console.log(JSON.parse(xhr.response));
      //console.log("========Succeeded drilling_default===============");
    }
  } catch (err) {
    //console.log("json request failed");
  }
  //return JSON.parse(xhr.response);
  return xhr.response;
}

export function getPadMove() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `${options.url}/retrieve_pad_info`, false);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  let querystring = `userIDStr=` + userID;
  try {
    xhr.send(querystring);
    if (xhr.status !== 200) {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
    }
  } catch (err) {
    console.log("json request failed");
  }
  return xhr.response;
}

export function getCrewMove() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `${options.url}/retrieve_crew_release_days`, false);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  let querystring = `userIDStr=` + userID;
  try {
    xhr.send(querystring);
    if (xhr.status !== 200) {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      console.log("========Succeeded retrieve_crew_release_days===============");
    }
  } catch (err) {
    //console.log("json request failed");
  }
  return xhr.response;
}

export function getCachedRigs() {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `${options.url}/retrieve_cached_rigs`, false);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  var querystring = 'userIDStr=' + userID;
  try {
    xhr.send(querystring);
    if (xhr.status !== 200) {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      // console.log('get cached rigs response ', xhr.response);
    }
  } catch (err) {
    console.log("json request failed");
  }
  return xhr.response;
}

export function getCachedCrews() {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `${options.url}/retrieve_cached_crews`, false);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  var querystring = `userIDStr=` + userID;

  try {
    xhr.send(querystring);
    if (xhr.status !== 200) {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    } else {
      console.log('get cached crews');
    }
  } catch (err) {
    console.log("json request failed");
  }
  return xhr.response;
}

//REDBOX DATA

export function getRedbox() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `http://10.0.10.174:5010/api/v1/RedBox`, false);
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  try {
    xhr.send();
    if (xhr.status === 200) {
      console.log("REDBOX API call successfull");
    } else {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    }
  } catch (err) {
    console.log("json request failed");
  }
  // console.log(xhr.response)
  return xhr.response;
}

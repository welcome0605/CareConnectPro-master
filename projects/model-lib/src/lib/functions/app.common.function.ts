export function GetApiURL() {
  //const url: string = "http://localhost:54345/";
  const url: string = 'https://dev-careconnect-api.azurewebsites.net/';
  return url;
}

export function GetMediaURL() {
  //const url: string = 'http://localhost:59714/';
  const url: string = "https://dev-careconnect-mediapi.azurewebsites.net/";
  return url;
}

export function GetCdnURL() {
  //const url: string = 'http://localhost:53024/';
  const url: string = "https://dev-careconnect-cdn.azurewebsites.net";
  return url;
}

export function GetBaseUrl() {
  return document.getElementsByTagName("base")[0].href;
}

import { xRequestHeaders } from "~factory/constants";

console.log("Service worker")

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === xRequestHeaders.xCsrfToken) {
           console.log({[xRequestHeaders.xCsrfToken]: details.requestHeaders[i].value})
           console.log({[xRequestHeaders.authorization]: details.requestHeaders[i].value})
           console.log({[xRequestHeaders.xTwitterAuthType]: details.requestHeaders[i].value})
        break;
      }
    }
  },
  {urls: ["*://x.com/*","*://www.x.com/*"]},
);

chrome.cookies.getAll({ url: "https://x.com" }, (t : chrome.cookies.Cookie[]) => {
    const cookies = t.map(({name,value}) => ({name,value}))
    chrome.storage.local.set({ "cookies" : cookies })
})

chrome.cookies.onChanged.addListener(async(changeInfo) => {
  const { cookie, cause, removed } = changeInfo ;
  if (cookie.domain === ".x.com" && "x.com") {
    
      const parsedCookies = (await chrome.storage.local.get("cookies"))["cookies"]
      const cookieChanged = parsedCookies.find(item => item.name === cookie.name)
      if (cookieChanged.value !== cookie.value) {
        const newCookies = parsedCookies.map((item) => item.name === cookie.name ? { name: item.name, value: cookie.value } : item) 
        chrome.storage.local.set({ "cookies" : newCookies })
      }

  }
});
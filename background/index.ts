import { xRequestHeaders } from "~factory/constants";
import {store} from "~redux/store"
import { sendToBackground } from "@plasmohq/messaging";

console.log("Service worker")
chrome.runtime.onStartup.addListener(async () => {
  console.log("Browser was just launched")
   await   sendToBackground({name: "queries"})

})

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0) return // ignore iframes, only top-level frame
  
  const url = details.url
  if (!url.includes("x.com")) return
  
  console.log("x.com visited")
  const state = store.getState()
    
  if (!JSON.parse(state.queries.ids)) {
   await   sendToBackground({name: "queries"})
  }
})


const headers = new Map()
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if(!(
     headers.has(xRequestHeaders.xCsrfToken) && 
     headers.has(xRequestHeaders.authorization) && 
     headers.has(xRequestHeaders.xTwitterAuthType) && 
     headers.has(xRequestHeaders.cookie) 
   )){
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      
      if (details.requestHeaders[i].name === xRequestHeaders.xCsrfToken) {
        chrome.storage.local.set({
                   [xRequestHeaders.xCsrfToken]: details.requestHeaders[i].value, 
                 })
             }
             if (details.requestHeaders[i].name === xRequestHeaders.authorization) {
                  chrome.storage.local.set({
                   [xRequestHeaders.authorization]: details.requestHeaders[i].value,
                 })
             }
             if (details.requestHeaders[i].name === xRequestHeaders.xTwitterAuthType) {
                  chrome.storage.local.set({
                   [xRequestHeaders.xTwitterAuthType]: details.requestHeaders[i].value
                 })
             }
             if (details.requestHeaders[i].name === xRequestHeaders.cookie) {
                  chrome.storage.local.set({
                   [xRequestHeaders.cookie]: details.requestHeaders[i].value
                 })
             }
           }
     
    }
  },
  {urls: ["*://x.com/*","*://www.x.com/*"] },
  ["requestHeaders", "extraHeaders"]
);










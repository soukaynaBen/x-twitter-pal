import { sendToBackground } from "@plasmohq/messaging"
import cssText from "data-text:~globals.css"
import type { PlasmoCSConfig } from "plasmo"
import { getUserTweetsAndReplays } from "~factory"
import { OperationName } from "~factory/enum"

const styleElement = document.createElement("style")


export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize

    return `${pixelsValue}px`
  })

  styleElement.textContent = updatedCssText

  return styleElement                   
}

export const config: PlasmoCSConfig = {
  matches: ["https://www.x.com/*","https://x.com/*"],
}



window.addEventListener("load", async () => {
        try {
          
          const { queries }: { queries: Record<OperationName, string> } =  await sendToBackground({ name: "queries" })
          const data =  { queryId : queries[OperationName.USER_TWEETS_AND_REPLIES] }
          
          if(!!queries) {
     
           const result =  await getUserTweetsAndReplays(data)
             
           console.log({result})
          }
        } catch (error) {
              console.log(error)
        }

})




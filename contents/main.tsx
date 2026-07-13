
import "globals.css"
import { sendToBackground } from "@plasmohq/messaging"
import { getUserTweetsAndReplays, unfavoriteTweet , getLikes} from "~factory"
import { OperationName } from "~factory/enum"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoCSUIProps,
  PlasmoRender
} from "plasmo"
import { useEffect, type FC } from "react"
import { createRoot } from "react-dom/client"
import { useSelector } from "~node_modules/react-redux/dist/react-redux"
import { mainModalSelector } from "~redux/main-modal-slice"
 import { Provider } from "react-redux"

import { PersistGate } from "@plasmohq/redux-persist/integration/react"

import { persistor, store } from "~/redux/store"
import { Card } from "~components/ui/card"



export const config: PlasmoCSConfig = {
  matches: ["https://www.x.com/*","https://x.com/*"],
}

function deleteAllLikes(){}
function deleteAllPosts(){}
function deleteAllReplies(){}
//TODO
// function exportAllLikes(){}
// function exportAllPosts(){}
// function exportAllReplays(){}

window.addEventListener("load", async () => {
  try {
 
    const { queries } : { queries: Record<OperationName, string> } =  await sendToBackground({ name: "queries" })
    let data =  { queryId : queries[OperationName.LIKES] , cursor: null}
    let n = 0
    let tweetsList = []

    if(!!queries) {
      // while(n < 3){
      //   const { items, cursor } =  await getLikes(data)
      //   data.cursor = cursor
      //   tweetsList.push(items)
      //   n++
      //   if (items.length === 0) break;
      // }
      // tweetsList.flat()
      // console.log({tweetsList})
    }
    
  } catch (error) {
    console.log(error)
  }

})
/// display overlay 



export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.querySelector(`[id="react-root"]`)
      if (rootContainerParent) {
        clearInterval(checkInterval)
        const rootContainer = document.createElement("div")
        rootContainerParent.appendChild(rootContainer)
        resolve(rootContainer)
      }
    }, 137)
  })

const PlasmoOverlay: FC<PlasmoCSUIProps> = () => {
   const display = useSelector(mainModalSelector)
   const rootContainer : HTMLDivElement= document.querySelector(`div[id="x-twitter-root-container"]`)
   useEffect(()=>{
     console.log({display})
    rootContainer.style.display = display ? "flex" : "none"
    document.body.style.overflowY = display ? "hidden" : "scroll" 
  
   },[display])
  return (
    <Card className="w-full"
     >
  
    </Card>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  rootContainer.setAttribute("id", "x-twitter-root-container")
  const root = createRoot(rootContainer)
  root.render(
         <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PlasmoOverlay />
      </PersistGate>
    </Provider>
)
}

export default PlasmoOverlay
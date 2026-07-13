
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
   useEffect(()=>{
     const rootContainer : HTMLDivElement= document.querySelector(`div[id="x-twitter-root-container"]`)
    rootContainer.style.display = display ? "flex" : "none"
    document.body.style.overflowY = display ? "hidden" : "scroll" 
  
   },[display])
  return (

  <div id="x-twitter-overlay-root" role="dialog" aria-modal="true" aria-labelledby="x-twitter-title">
  <div className="x-twitter-backdrop" data-x-twitter-dismiss></div>

  <div className="x-twitter-panel">
    <div className="x-twitter-header">
      <div className="x-twitter-title-group">
        <span className="x-twitter-eyebrow">Bulk action</span>
        <h2 className="x-twitter-title" id="x-twitter-title">Delete posts, likes &amp; replies</h2>
        <p className="x-twitter-description">
          Choose what to remove and an optional date range. This runs in your
          browser and can't be undone once started.
        </p>
      </div>
      <button className="x-twitter-close" data-x-twitter-dismiss aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <div className="x-twitter-body">
      <div>
        <div className="x-twitter-section-label">What to delete</div>
        <div className="x-twitter-check-grid">
          <label className="x-twitter-check-item">
            <input type="checkbox" name="x-twitter-target" value="posts" checked />
            <div className="x-twitter-check-text">
              <span className="x-twitter-check-title">Posts</span>
              <span className="x-twitter-check-sub">Original tweets and quote posts</span>
            </div>
          </label>
          <label className="x-twitter-check-item">
            <input type="checkbox" name="x-twitter-target" value="replies" checked />
            <div className="x-twitter-check-text">
              <span className="x-twitter-check-title">Replies</span>
              <span className="x-twitter-check-sub">Replies you've posted to others</span>
            </div>
          </label>
          <label className="x-twitter-check-item">
            <input type="checkbox" name="x-twitter-target" value="likes" />
            <div className="x-twitter-check-text">
              <span className="x-twitter-check-title">Likes</span>
              <span className="x-twitter-check-sub">Unlikes posts, doesn't delete them</span>
            </div>
          </label>
        </div>
      </div>

      <div>
        <div className="x-twitter-section-label">Filter by date</div>
        <div className="x-twitter-date-row">
          <div className="x-twitter-field">
            <label htmlFor="x-twitter-date-from">From</label>
            <input type="date" id="x-twitter-date-from" />
          </div>
          <div className="x-twitter-field select-none">
            <label htmlFor="x-twitter-date-to">To</label>
            <input type="date" id="x-twitter-date-to" />
          </div>
        </div>
        <div className="x-twitter-quick-ranges">
          <button className="x-twitter-chip" data-range="7">Last 7 days</button>
          <button className="x-twitter-chip" data-range="30">Last 30 days</button>
          <button className="x-twitter-chip" data-range="365">Last year</button>
          <button className="x-twitter-chip x-twitter-chip-active" data-range="all">All time</button>
        </div>
      </div>

      <div className="x-twitter-warning">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>
        <span>This action is permanent. Deleted posts and replies can't be recovered, and unliked posts will disappear from your Likes tab.</span>
      </div>
    </div>

    <div className="x-twitter-footer flex-col items-stretch gap-3">
      <div className="x-twitter-confirm-row">
        Type <strong>&nbsp;DELETE&nbsp;</strong> to confirm:
        <input type="text" id="x-twitter-confirm-input" autoComplete="off" spellCheck="false" />
      </div>
      <div className="flex items-center justify-between gap-3" >
        <span className="x-twitter-count" id="x-twitter-count-label"><strong>—</strong> items match this filter</span>
        <div className="x-twitter-actions">
          <button className="x-twitter-btn x-twitter-btn-ghost" data-x-twitter-dismiss>Cancel</button>
          <button className="x-twitter-btn x-twitter-btn-danger" id="x-twitter-submit" disabled>Delete selected</button>
        </div>
      </div>
    </div>
  </div>
</div>
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
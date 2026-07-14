
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
import { useEffect, useState, type FC } from "react"
import { createRoot } from "react-dom/client"
import { useSelector } from "~node_modules/react-redux/dist/react-redux"
import { mainModalSelector } from "~redux/main-modal-slice"
 import { Provider } from "react-redux"

import { PersistGate } from "@plasmohq/redux-persist/integration/react"

import { persistor, store } from "~/redux/store"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "~components/ui/field"
import { Checkbox } from "~components/ui/checkbox"
import { cn } from "~lib/utils"
import { CloseIcon, WarningIcon } from "~components/x-twitter"
import { DatePicker } from "~components/date-picker"



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


type rangeType = 7 | 30 | 365 | null
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
   const [postsChecked, setPostsChecked] = useState(false)
   const [repliesChecked, setRepliesChecked] = useState(false)
   const [likesChecked, setLikesChecked] = useState(false)
   const [range, setRange] = useState<rangeType>(null)
   const [startDate, setStartDate] = useState(undefined)
   const [endDate, setEndDate] = useState(undefined)

   const options = [
    {
      id: "posts-checkbox" ,
      label: "Posts",
      description: "Original tweets and quote posts",
      value: postsChecked,
      onChecked: setPostsChecked,
    },
    {
      id: "replies-checkbox" ,
      label: "Replies",
      description: "Replies you've posted to others",
      value: repliesChecked,
      onChecked: setRepliesChecked,
    },
    {
      id: "likes-checkbox" ,
      label: "Likes",
      description: "Unlikes posts, doesn't delete them",
      value: likesChecked,
      onChecked: setLikesChecked,
    }
  ]

   const display = useSelector(mainModalSelector)
   const rootContainer : HTMLDivElement= document.querySelector(`div[id="x-twitter-root-container"]`)
   useEffect(()=>{
    rootContainer.style.display = display ? "flex" : "none"
  
   },[display])
  return (

  <div className="font-custom" id="x-twitter-overlay-root" role="dialog" aria-modal="true" aria-labelledby="x-twitter-title">
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
        <CloseIcon />
      </button>
    </div>

    <div className="x-twitter-body">
      <FieldSet>
        <FieldLegend variant="label">What to delete</FieldLegend>
          <FieldGroup className="gap-3">
             {options.map(({id,value,label,onChecked, description})=>(<Field key={id} onClick={()=> onChecked(!value)} className="bg-x-twitter-panel-raised border-x-twitter-border select-none cursor-pointer transition-[border-color] duration-150 py-3 px-2 border rounded-x-twitter-sm  has-[.checked]:border-x-twitter-accent flex items-center justify-center" orientation="horizontal">
              <Checkbox
                id={id}   
                name={id}
                checked={value}
                className={cn(value && "checked", "border-x-twitter-border-second data-[state=checked]:bg-x-twitter-accent data-[state=checked]:border-x-twitter-accent border-[1.5px] w-[18px] h-[18px] rounded-[5px] transition-none" )}
              />
              <FieldContent >
                <FieldLabel htmlFor={id}>
                  {label}
                </FieldLabel>
                <FieldDescription className="text-x-twitter-text-dim text-xs">
                  {description}
                </FieldDescription>
              </FieldContent>
            </Field>))}

        </FieldGroup>
      </FieldSet>

      <div>

        <div className="text-xs font-bold text-x-twitter-text-dim uppercase tracking-[0.04em] mb-[10px]">Filter by date</div>
        <div className="flex gap-3" >
          <div className="x-twitter-field">
            <label htmlFor="x-twitter-date-from">From</label>
            {/* <input className={cn(!!range && "opacity-45")} disabled={!!range} type="date" id="x-twitter-date-from" /> */}
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>
          <div className="x-twitter-field select-none">
            <label htmlFor="x-twitter-date-to">To</label>
            <input className={cn(!!range && "opacity-45")} disabled={!!range}  type="date" id="x-twitter-date-to" />
          </div>
        </div>
        <div className="x-twitter-quick-ranges">
          <button onClick={()=> setRange(7)} className={cn("x-twitter-chip", range === 7 && "x-twitter-chip-active")}  data-range="7">Last 7 days </button>
          <button onClick={()=> setRange(30)}  className={cn("x-twitter-chip", range === 30  && "x-twitter-chip-active")}  data-range="30">Last 30 days</button>
          <button onClick={()=> setRange(365)}  className={cn("x-twitter-chip", range === 365  && "x-twitter-chip-active")}  data-range="365">Last year</button>
          <button onClick={()=> setRange(null)} className={cn("x-twitter-chip",  !range && "x-twitter-chip-active")} data-range="all">All time</button>
        </div>
      </div>

      <div className="x-twitter-warning">
      <WarningIcon/>
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
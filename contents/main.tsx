
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
import { DatePickerRange } from "~components/date-picker"
import type { DateRange } from "~node_modules/react-day-picker/dist/cjs"
import { subDays } from "date-fns"





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


type rangeType = 7 | 30 | 365 | "all"

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
  const rangeValues  = [ 7 , 30 , 365 ]
  const [postsChecked, setPostsChecked] = useState(true)
  const [repliesChecked, setRepliesChecked] = useState(false)
  const [likesChecked, setLikesChecked] = useState(false)
  const [date, setDate] = useState<DateRange | undefined>(undefined) ;
  const [range, setRange] = useState< rangeType | undefined>("all")
  const [confirmInput, setConfirmInput] = useState("")
     
// value.trim().toUpperCase() !== 'DELETE'
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


   const handleRange = (value) => {
       switch (value) {
        case rangeValues[0]:
            setDate( {
            from: subDays(new Date(), rangeValues[0]),
            to: new Date(),
          }) 
          setRange(rangeValues[0] as rangeType)
          break;
          case rangeValues[1]:
            setDate( {
              from: subDays(new Date(), rangeValues[1]),
              to: new Date(),
            }) 
            setRange(rangeValues[1] as rangeType)
            break;
            case rangeValues[2]:
              setDate( {
                from: subDays(new Date(), rangeValues[2]),
                to: new Date(),
              }) 
              setRange(rangeValues[2] as rangeType)
              break;
              
              default:
                setDate(undefined) 
                setRange("all")
          break;
       } 

   }

const handleSubmit : React.FormEventHandler<HTMLFormElement>= (e: React.FormEvent<HTMLFormElement>)=> {
   e.preventDefault();
   console.log(e)
   if (postsChecked || repliesChecked || likesChecked) {
    return null;
   } 
}
/// TODO Check at least one option
const handleCheck = ()=> {

}

  return (<div className="font-custom" id="x-twitter-overlay-root" role="dialog" aria-modal="true" aria-labelledby="x-twitter-title">
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
          <div onClick={()=>setRange(undefined)} className="x-twitter-field">
            <label htmlFor="x-twitter-date-from">Date picker range</label>
            <DatePickerRange  date={date} setDate={setDate} />
          </div>
       
        </div>
        <div className="x-twitter-quick-ranges">
          <button onClick={()=> handleRange(rangeValues[0])} className={cn("x-twitter-chip", range === rangeValues[0] && "x-twitter-chip-active")}  data-range={rangeValues[0]}>Last 7 days </button>
          <button onClick={()=> handleRange(rangeValues[1])}  className={cn("x-twitter-chip", range === rangeValues[1]  && "x-twitter-chip-active")}  data-range={rangeValues[1]}>Last 30 days</button>
          <button onClick={()=> handleRange(rangeValues[2])}  className={cn("x-twitter-chip", range === rangeValues[2]  && "x-twitter-chip-active")}  data-range={rangeValues[2]}>Last year</button>
          <button onClick={()=> handleRange(null)} className={cn("x-twitter-chip",  range === "all" && "x-twitter-chip-active")} data-range="all">All time</button>
        </div>
      </div>

      <div className="x-twitter-warning">
      <WarningIcon/>
        <span>This action is permanent. Deleted posts and replies can't be recovered, and unliked posts will disappear from your Likes tab.</span>
      </div>
    </div>

    <form  onSubmit={handleSubmit} className="x-twitter-footer flex-col items-stretch gap-3">
      <div className="x-twitter-confirm-row">
        Type <strong>&nbsp;DELETE&nbsp;</strong> to confirm:
        <input onChange={(e)=>setConfirmInput(e.target.value)} type="text" id="x-twitter-confirm-input" autoComplete="off" spellCheck="false" />
      </div>
      <div className="flex items-center justify-between gap-3" >
        <div className="x-twitter-actions">
          <button type="submit" className="x-twitter-btn x-twitter-btn-danger" id="x-twitter-submit" disabled={confirmInput.trim().toUpperCase() !== 'DELETE'}>Delete selected</button>
        </div>
      </div>
    </form>
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
  document.querySelector("html").setAttribute("class", "dark")

  root.render(
         <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PlasmoOverlay />
      </PersistGate>
    </Provider>
)
}

export default PlasmoOverlay
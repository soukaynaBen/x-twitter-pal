import "globals.css"
import { sendToBackground } from "@plasmohq/messaging"
import { getUserTweetsAndReplays, unfavoriteTweet , getLikes, deleteTweet, deleteRetweet} from "~factory"
import { OperationName } from "~factory/enum"

import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoCSUIProps,
  PlasmoRender
} from "plasmo"
import { useCallback, useEffect, useState, type FC } from "react"
import { createRoot } from "react-dom/client"
import { useSelector } from "~node_modules/react-redux/dist/react-redux"
import { mainModalSelector } from "~redux/main-modal-slice"
 import { Provider } from "react-redux"

import { PersistGate } from "@plasmohq/redux-persist/integration/react"

import { persistor, store } from "~/redux/store"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "~components/ui/field"
import { Checkbox } from "~components/ui/checkbox"
import { cn, Sleep } from "~lib/utils"
import { WarningIcon, XTwitterIcon } from "~components/x-twitter"
import { DatePickerRange } from "~components/date-picker"
import { subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { getQueryId } from "~factory/utils"
import { Spinner } from "~components/ui/spinner"
import { Progress } from "~components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "~components/ui/avatar"
import { tweets } from "~folder/tweets"


export const config: PlasmoCSConfig = {
  matches: ["https://www.x.com/*","https://x.com/*"],
}

type rangeType = 7 | 30 | 365 | "all"
const rangeValues  = [ 7 , 30 , 365 ]

enum OptionsEnum {
    POSTS = "posts-checkbox" ,
    REPLIES = "replies-checkbox" ,
    LIKES = "likes-checkbox" ,
}

  const options = [
  {
    id: OptionsEnum.POSTS ,
    label: "Posts",
    description: "Original tweets and quote posts",
  },
  {
    id: OptionsEnum.REPLIES ,
    label: "Replies",
    description: "Replies you've posted to others",
  },
  {
    id: OptionsEnum.LIKES ,
    label: "Likes",
    description: "Unlikes posts, doesn't delete them",
  }
]

// async function deleteLikes(startTimestamp: number, endTimestamp: number){
//   //OperationName.LIKES
//   console.log("delete...")
//          let done = false
//         try {
//               while(!done){
//                 const {items}  =  await getLikes({queryId: getQueryId(OperationName.LIKES)})
//                   if (items.length === 0) break;

//                   for (let i = 0; i < items.length; i++) {
//                    const element = items[i];
//                    const timeStamp =  new Date(element.itemContent.tweet_results.result.legacy.created_at).getTime()

//                    if (startTimestamp <= timeStamp && timeStamp <= endTimestamp){
//                       tweets.push({
//                        name:element.itemContent.tweet_results.result.core.user_results.result.core.name,
//                         screen_name:element.itemContent.tweet_results.result.core.user_results.result.core.screen_name,
//                         avatar:element.itemContent.tweet_results.result.core.user_results.result.avatar.image_url,
//                         text:element.itemContent.tweet_results.result.legacy.full_text,
//                         created_at:element.itemContent.tweet_results.result.legacy.created_at,
//                         state: "pending"
//                       })
//                       const tweetId = element.itemContent.tweet_results.result.rest_id
//                       await unfavoriteTweet({ queryId : getQueryId(OperationName.UNFAVORITE_TWEET), tweetId })
//                     }else if(timeStamp < startTimestamp ){
//                       done = true
//                       break;
//                     }
//                     await Sleep(5)

//                   }
                  
//               }
//         } catch (error) {
//           console.log(error)
//         }   

// }

async function deletePosts(startTimestamp: number, endTimestamp: number){
        // OperationName.USER_TWEETS

         let done = false
        try {
              while(!done){
                const {items}  =  await getLikes({queryId: getQueryId(OperationName.USER_TWEETS)})
                  if (items.length === 0) break;

                  for (let i = 0; i < items.length; i++) {
                   const element = items[i];
                   const timeStamp =  new Date(element.itemContent.tweet_results.result.legacy.created_at).getTime()

                   if (startTimestamp <= timeStamp && timeStamp <= endTimestamp){
                      const tweetId = element.itemContent.tweet_results.result.rest_id
                      await deleteTweet({ queryId : getQueryId(OperationName.DELETE_TWEET), tweetId })
                   }else if(timeStamp < startTimestamp ){
                     done = true
                     break;
                   }

                  }
                  
              }
        } catch (error) {
          console.log(error)
        }   
 
}

async function deleteReplies(startTimestamp: number, endTimestamp: number){
      // OperationName.USER_TWEETS_AND_REPLIES
            let done = false
        try {
              while(!done){
                const {items}  =  await getLikes({queryId: getQueryId(OperationName.USER_TWEETS_AND_REPLIES)})
                  if (items.length === 0) break;

                  for (let i = 0; i < items.length; i++) {
                   const element = items[i];
                   const timeStamp =  new Date(element.itemContent.tweet_results.result.legacy.created_at).getTime()

                   if (startTimestamp <= timeStamp && timeStamp <= endTimestamp){
                      const sourceTweetId = element.itemContent.tweet_results.result.rest_id
                      await deleteRetweet({ queryId : getQueryId(OperationName.DELETE_RETWEET), sourceTweetId })
                   }else if(timeStamp < startTimestamp ){
                     done = true
                     break;
                   }

                  }
                  
              }
        } catch (error) {
          console.log(error)
        }   
 
}

//TODO
// function exportAllLikes(){}
// function exportAllPosts(){}
// function exportAllReplays(){}

window.addEventListener("load", async () => {
  try {
    await sendToBackground({ name: "queries" })
  
  } catch (error) {
    console.log(error)
  }

})

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

const BulkActionModal = ({ canUnCheck, setOptionsChecked, optionsChecked, setRange, range, date, setDate, handleRange, rangeValues, handleSubmit, setConfirmInput, confirmInput })=> {
  return (<> <div className="x-twitter-header">
       
      <div className="x-twitter-title-group">
        <span className="x-twitter-eyebrow">Bulk action</span>
        <h2 className="x-twitter-title" id="x-twitter-title">Delete posts, likes &amp; replies</h2>
        <p className="x-twitter-description">
          Choose what to remove and an optional date range. This runs in your
          browser and can't be undone once started.
        </p>
      </div>
    </div>

    <div className="x-twitter-body">
      <FieldSet>
        <FieldLegend variant="label">What to delete</FieldLegend>
          <FieldGroup className="gap-3">
             {options.map(({id, label, description})=>(<Field key={id} onClick={()=> canUnCheck(id) && setOptionsChecked({...optionsChecked,[id]:!optionsChecked[id]})} className="bg-x-twitter-panel-raised border-x-twitter-border select-none cursor-pointer transition-[border-color] duration-150 py-3 px-2 border rounded-x-twitter-sm  has-[.checked]:border-x-twitter-accent flex items-center justify-center" orientation="horizontal">
              <Checkbox
                id={id}   
                name={id}
                checked={optionsChecked[id]}
                className={cn(optionsChecked[id] && "checked", "border-x-twitter-border-second data-[state=checked]:bg-x-twitter-accent data-[state=checked]:border-x-twitter-accent border-[1.5px] w-[18px] h-[18px] rounded-[5px] transition-none" )}
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

    <form onSubmit={handleSubmit}>
      <div className="x-twitter-footer flex-col items-stretch gap-3">

        <div className="x-twitter-confirm-row">
          Type <strong>&nbsp;DELETE&nbsp;</strong> to confirm:
          <input onChange={(e)=>setConfirmInput(e.target.value)} type="text" id="x-twitter-confirm-input" autoComplete="off" spellCheck="false" />
        </div>
        <div className="flex items-center justify-between gap-3" >
          <div className="x-twitter-actions">
            <button type="submit" className="x-twitter-btn x-twitter-btn-danger min-w-32 flex-nowrap gap-2 flex justify-center items-center" id="x-twitter-submit" disabled={confirmInput.trim().toUpperCase() !== 'DELETE' }> Submit</button>
          </div>
        </div>
    </div>
    </form></>)
}

const DeletionnModal = ()=> {
  return (<>
      <div className="x-twitter-header flex-col">
      <div className="x-twitter-title-row">
        <div className="x-twitter-title-group">
          <span className="x-twitter-eyebrow"><span className="x-twitter-dot"></span> Deleting</span>
          <h2 className="x-twitter-title" id="x-twitter-title">Removing your posts</h2>
          <p className="x-twitter-description">Don't close this tab until it's finished.</p>
        </div>
  
      </div>

      <div className="x-twitter-progress-wrap w-full">
      
        <Progress value={30}  className="bg-[#6d5de733]" />
        <div className="x-twitter-progress-meta">
          <span><strong id="x-twitter-count-done">0</strong> removed</span>
          <span id="x-twitter-eta">estimating…</span>
        </div>
      </div>
    </div>
      {
        false ? 
        (<div className="x-twitter-empty" id="x-twitter-empty">
        <strong>All done</strong>
        <span>Every matching post, reply, and like has been removed.</span>
        </div>) : 
        ( <div className="x-twitter-list" id="x-twitter-list">
        {!!tweets.length && tweets.map((item, id)=>(<div    
                key={id}
                className="x-twitter-item" data-state={item.state} >
                <Avatar>
                <AvatarImage src={item.avatar}/>
                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="x-twitter-item-body">
                  <div className="x-twitter-item-head">
                    <span className="x-twitter-name">{item.name}</span>
                    <span className="x-twitter-handle">@{item.screen_name}</span>
                    <span className="x-twitter-type-tag">{item.state}</span>
                  </div>
                  <div className="x-twitter-text line-clamp-3">{item.text}</div>
                  <div className="x-twitter-date">{ new Date(item.created_at).toLocaleString()}</div>
                </div>
                <div className="x-twitter-status-icon items-start">
                  {item.state === 'active'  && (<Spinner/> )}
                  {item.state === 'deleted' && (<svg className="x-twitter-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>)}
                </div>
              </div>))}
        </div>)
      }
   
    <div className="x-twitter-footer">
      <span className="x-twitter-summary" id="x-twitter-summary"><strong>0</strong> posts · <strong>0</strong> replies · <strong>0</strong> likes</span>
    </div></>)
}

const PlasmoOverlay: FC<PlasmoCSUIProps> = () => {

  const display = useSelector(mainModalSelector)
  const [date, setDate] = useState<DateRange | undefined>(undefined) ;
  const [range, setRange] = useState< rangeType | undefined>("all")
  const [confirmInput, setConfirmInput] = useState("")
  const [processing, setProcessing] = useState(false)   
  const [optionsChecked, setOptionsChecked] = useState<Record<OptionsEnum, boolean>>({
    [OptionsEnum.POSTS]: true,
    [OptionsEnum.REPLIES]: false,
    [OptionsEnum.LIKES]: false
  })



   let rootContainer : HTMLDivElement= document.querySelector(`div[id="x-twitter-root-container"]`)
   
   useEffect(()=>{
      rootContainer = document.querySelector(`div[id="x-twitter-root-container"]`)
    if (rootContainer) {
      rootContainer.style.display = display ? "flex" : "none"
    }
  
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

const handleSubmit : React.FormEventHandler<HTMLFormElement> = useCallback(async(e: React.FormEvent<HTMLFormElement>)=> {
      e.preventDefault();
      setProcessing(true)
      if(!Object.values(optionsChecked).reduce((acc, item)=> item || acc, false)) return null
      if (confirmInput.trim().toUpperCase() !== 'DELETE')  return null
         

      // if (date) {
      // //  if (optionsChecked["posts-checkbox"]) {
      // //    deletePosts( date.from.getTime(), date.to.getTime())
      // //   }
      // //   if (optionsChecked["replies-checkbox"]) {
      // //     deleteReplies( date.from.getTime(), date.to.getTime())
      // //   }
      //   if (optionsChecked["likes-checkbox"]) {
      //     console.log("")
      //     await deleteLikes( date.from.getTime(), date.to.getTime())
      //   }
      // }else if(range === "all"){
      //   // if (optionsChecked["posts-checkbox"]) {
          
      //   //   deletePosts( 0 , Date.now())
      //   // }
      //   // if (optionsChecked["replies-checkbox"]) {
          
      //   //   deleteReplies( 0 , Date.now())
      //   // }
      //   if (optionsChecked["likes-checkbox"]) {    
      //     console.log("")
      //     await deleteLikes( 0 , Date.now())
      //   }
      // }
      setProcessing(false)

},[confirmInput,optionsChecked, date, range])
/// Check at least one option
const canUnCheck = useCallback((id) => Object.values({...optionsChecked,[id] : !optionsChecked[id]}).reduce((acc, item)=> item || acc, false),[optionsChecked]) 
   
  return (<div className="font-custom" id="x-twitter-overlay-root" role="dialog" aria-modal="true" aria-labelledby="x-twitter-title">
  <div className="x-twitter-backdrop" data-x-twitter-dismiss></div>
  <div className="x-twitter-panel">
   {  processing ?  <BulkActionModal 
        canUnCheck={canUnCheck}
        setOptionsChecked={setOptionsChecked}
        optionsChecked={optionsChecked}
        setRange={setRange}
        range={range}
        date={date}
        setDate={setDate}
        handleRange={handleRange}
        rangeValues={rangeValues}
        handleSubmit={handleSubmit}
        setConfirmInput={setConfirmInput}
        confirmInput={confirmInput}
       /> :
       <DeletionnModal />}
  </div>
</div>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  document.querySelector("html").setAttribute("class", "dark")
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
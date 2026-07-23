import "globals.css"
import { sendToBackground } from "@plasmohq/messaging"
import { getUserTweetsAndReplays, unfavoriteTweet , getLikes, deleteTweet, deleteRetweet, getParsedItem, getUserTweets} from "~factory"
import { OperationName } from "~factory/enum"

import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoCSUIProps,
  PlasmoRender
} from "plasmo"
import { useCallback, useEffect, useMemo, useState, type FC } from "react"
import { createRoot } from "react-dom/client"
import { useSelector } from "~node_modules/react-redux/dist/react-redux"
import { mainModalSelector } from "~redux/main-modal-slice"
 import { Provider } from "react-redux"

import { PersistGate } from "@plasmohq/redux-persist/integration/react"

import { persistor, store } from "~/redux/store"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "~components/ui/field"
import { Checkbox } from "~components/ui/checkbox"
import { cn, Sleep } from "~lib/utils"
import { WarningIcon } from "~components/x-twitter"
import { DatePickerRange } from "~components/date-picker"
import { subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { getQueryId } from "~factory/utils"
import { Spinner } from "~components/ui/spinner"
import { Progress } from "~components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "~components/ui/avatar"
import type { metaDataInterface } from "~factory/interface"

export const config: PlasmoCSConfig = {
  matches: ["https://www.x.com/*","https://x.com/*"],
}

type rangeType = 7 | 30 | 365 | "all"
const rangeValues  = [ 7 , 30 , 365 ]

type CountType = {
    likesCount: number;
    repliesCount: number;
    postsCount: number;
    repostsCount: number;
    totalCount: number;
  }

enum OptionsEnum {
    POSTS = "posts-checkbox" ,
    REPOSTS = "reposts-checkbox" ,
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
    id: OptionsEnum.REPOSTS ,
    label: "Reposts",
    description: "Retweets",
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

type tweetsType = Record<number, {
    id: string;
    avatar: string;
    text: string;
    created_at: string;
    retweeted: boolean;
    is_my_reply: boolean;
    state: string;
    name: string;
    screen_name: string;
}>




//TODO
// function exportAllLikes(){}
// function exportAllReposts(){}
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

const BulkActionModal = ({ canUnCheck, setOptionsChecked, optionsChecked, setRange, range, date, setDate, handleRange, rangeValues, handleSubmit, setConfirmInput, confirmInput , processing })=> {

  return (<div className={cn("x-twitter-panel block", processing && "hidden")} > <div className="x-twitter-header">
       
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
             {options?.map(({id, label, description})=>(<Field key={id} onClick={()=> canUnCheck(id) && setOptionsChecked({...optionsChecked,[id]:!optionsChecked[id]})} className="bg-x-twitter-panel-raised border-x-twitter-border select-none cursor-pointer transition-[border-color] duration-150 py-3 px-2 border rounded-x-twitter-sm  has-[.checked]:border-x-twitter-accent flex items-center justify-center" orientation="horizontal">
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
          <input value={confirmInput} onChange={(e)=>setConfirmInput(e.target.value)} type="text" id="x-twitter-confirm-input" autoComplete="off" spellCheck="false" />
        </div>
        <div className="flex items-center justify-between gap-3" >
          <div className="x-twitter-actions">
            <button type="submit" className={cn("x-twitter-btn x-twitter-btn-danger min-w-32 flex-nowrap gap-2 flex justify-center items-center", (confirmInput.trim().toUpperCase() !== 'DELETE' || processing) && "disabled")} id="x-twitter-submit">Submit</button>
          </div>
        </div>
    </div>
    </form></div>)
}

const DeletionModal = ({ tweets, count ,doneCount, percentage , done, processing}: { tweets:tweetsType , doneCount: number, percentage: number , done: boolean, processing: boolean, count: CountType})=> {
  
  return (<div className={cn("x-twitter-panel hidden", processing && "block")}>
      <div className="x-twitter-header flex-col">
      <div className="x-twitter-title-row">
        <div className="x-twitter-title-group">
          <span className="x-twitter-eyebrow"><span className="x-twitter-dot"></span> Deleting</span>
          <h2 className="x-twitter-title" id="x-twitter-title">Removing your posts</h2>
          <p className="x-twitter-description">Don't close this tab until it's finished.</p>
        </div>
      </div>

      <div className="x-twitter-progress-wrap w-full">
      
        <Progress value={percentage}  className="bg-[#6d5de733]" />
        <div className="x-twitter-progress-meta">
          <span><strong id="x-twitter-count-done">{doneCount}</strong> removed</span>
          <span id="x-twitter-eta">estimating…</span>
        </div>
      </div>
    </div>
      
         <div className="x-twitter-list" id="x-twitter-list">
        <div className={cn("x-twitter-empty hidden", done && "flex")} id="x-twitter-empty">
        <strong>All done</strong>
        <span>Every matching post, reply, and like has been removed.</span>
        </div>
        { Object.values(tweets)?.map((item, id)=>(<div    
                key={id}
                className={cn("x-twitter-item",`x-twitter-item-${item.state}`)}>
                <Avatar>
                <AvatarImage src={item.avatar}/>
                <AvatarFallback>{item?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="x-twitter-item-body">
                  <div className="x-twitter-item-head"> 
                    <span className="x-twitter-name">{item.name}</span>
                    <span className="x-twitter-handle">@{item.screen_name}</span>
                    <span className="x-twitter-type-tag">{item.state}</span>
                  </div>
                  <div className="x-twitter-text line-clamp-3">{item.text}</div>
                  <div className="x-twitter-date">{item.created_at.toLocaleString()}</div>
                </div>
                <div className="x-twitter-status-icon items-start">
                  {item.state === 'active'  && (<Spinner/> )}
                  {item.state === 'deleted' && (<svg className="x-twitter-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>)}
                </div>
              </div>))}
        </div>
      
   
    <div className="x-twitter-footer">
      <span className="x-twitter-summary" id="x-twitter-summary">
        <strong>{count.postsCount}</strong> posts · <strong>{count.repliesCount}</strong> replies · <strong>{count.likesCount}</strong> likes · <strong>{count.repostsCount}</strong> reposts</span>
    </div></div>)
}

const PlasmoOverlay: FC<PlasmoCSUIProps> = () => {

  const display = useSelector(mainModalSelector)
  const [date, setDate] = useState<DateRange | undefined>(undefined) ;
  const [range, setRange] = useState< rangeType | undefined>("all")
  const [confirmInput, setConfirmInput] = useState("")
  const [processing, setProcessing] = useState(false)   
  const [optionsChecked, setOptionsChecked] = useState<Record<OptionsEnum, boolean>>({
    [OptionsEnum.POSTS]: true,
    [OptionsEnum.REPOSTS]: false,
    [OptionsEnum.REPLIES]: false,
    [OptionsEnum.LIKES]: false,
  })
  const [tweets, setTweets] = useState<tweetsType >({})
  const [count, setCount] = useState<CountType>({ likesCount: 0, repliesCount: 0, postsCount: 0, repostsCount: 0, totalCount: 0 })
  const [done, setDone] = useState(false)
  let rootContainer : HTMLDivElement = document.querySelector(`div[id="x-twitter-root-container"]`)

  useEffect(() => {
    rootContainer = document.querySelector(`div[id="x-twitter-root-container"]`)
    if (rootContainer) {
      rootContainer.style.display = display ? "flex" : "none"
    }
  },[display])

  const doneCount = useMemo(()=> Object.values({...count, totalCount: 0}).reduce((acc,value)=> acc + value,0) ,[count])
  const percentage = useMemo(()=> count.totalCount ? Math.round((doneCount / count.totalCount) * 100) : 0 ,[doneCount, count.totalCount])
   const handleRange = useCallback((value) => {
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

   },[]) 

const handleSubmit : React.FormEventHandler<HTMLFormElement> = useCallback(async(e: React.FormEvent<HTMLFormElement>)=> {
      e.preventDefault();
      const  { isTwitterLoggedIn } =   await sendToBackground({"name": "logged-in"})
      if (!isTwitterLoggedIn) {
          alert("Please log in to start using this exension!")
        return null 
      } 
      if(!Object.values(optionsChecked).reduce((acc, item)=> item || acc, false)) return null
      if (confirmInput.trim().toUpperCase() !== 'DELETE')  return null

      const  { metaData } =   await sendToBackground({"name": "metadata"})

      try {
        
        setConfirmInput("")
        setDone(false)
        setProcessing(true)
        if (date) {
          if (optionsChecked["posts-checkbox"]) {
           await deletePosts( date.from.getTime(), date.to.getTime(), metaData)
          }
          if (optionsChecked["reposts-checkbox"]) {
           await deleteReposts( date.from.getTime(), date.to.getTime(), metaData)
          }
          if (optionsChecked["replies-checkbox"]) {
            await deleteReplies( date.from.getTime(), date.to.getTime(), metaData)
          }
          if (optionsChecked["likes-checkbox"]) {
            await deleteLikes( date.from.getTime(), date.to.getTime(), metaData)
          }
        }else if(range === "all"){
          if (optionsChecked["posts-checkbox"]) {
            
            await deletePosts( 0 , Date.now(), metaData)
          }
          if (optionsChecked["reposts-checkbox"]) {
            
            await deleteReposts( 0 , Date.now(), metaData)
          }
          if (optionsChecked["replies-checkbox"]) {
            
            await deleteReplies( 0 , Date.now(), metaData)
          }
          if (optionsChecked["likes-checkbox"]) {    
            await deleteLikes( 0 , Date.now(), metaData)
          }
        }
 
      } catch (error) {
        
      }finally {
         setTweets({})
         setDone(true)
         setTimeout(()=>{
          setProcessing(false)
          setCount({
            likesCount: 0,
            repliesCount: 0,
            repostsCount: 0,
            postsCount: 0,
            totalCount: 0,
          })
        },2000)
        
      }
               


},[confirmInput,optionsChecked, date, range, tweets])
/// Check at least one option

const canUnCheck = useCallback((id) => Object.values({...optionsChecked,[id] : !optionsChecked[id]}).reduce((acc, item)=> item || acc, false),[optionsChecked]) 
const deleteLikes = useCallback(async (startTimestamp: number, endTimestamp: number, metaData: metaDataInterface)=>{
   //OperationName.LIKES

         try { 
              let  loop = true
               while(loop){
                  const {items}  =  await getLikes({queryId: getQueryId(OperationName.LIKES)})
                   if (items.length === 0) break;
                   let newItems = {}
                    let index = 0
                    items.forEach((item) => {
                        const parsedItem = getParsedItem(item, metaData)
                        if(!!parsedItem){
                          newItems[index] = parsedItem
                          index++
                        }
                    }) 

                  setTweets(newItems)
                  setCount((count) => ({...count, totalCount : count.totalCount + Object.keys(newItems).length }))
               
                   for (let i = 0; i < Object.keys(newItems).length ; i++) {
                    const timeStamp = newItems[i].created_at.getTime()

                    if (startTimestamp <= timeStamp && timeStamp <= endTimestamp){
                      const tweetId = newItems[i].id
                   
                      newItems = {...newItems,[i]: {...newItems[i], state: "active"}}
                      setTweets(newItems)

                      const {data} = await unfavoriteTweet({ queryId : getQueryId(OperationName.UNFAVORITE_TWEET), tweetId })
                      if (data?.unfavorite_tweet === "Done") {
                        newItems = {...newItems,[i]: {...newItems[i], state: "deleted"}}
                        setTweets(newItems)
                        setCount((count)=>  ({...count, likesCount : count.likesCount + 1}))       
                      } 

                     }else if(timeStamp < startTimestamp ){
                       loop = false
                       break;
                     }
                    }
                    await Sleep(1)
              }
              return null
        } catch (error) {
          console.log(error)
        }   

}
,[]) 


const deletePosts = useCallback(async(startTimestamp: number, endTimestamp: number, metaData: metaDataInterface)=>{
        // OperationName.USER_TWEETS

       try { 
              let  loop = true
               while(loop){
                 const {items}  =  await getUserTweets({queryId: getQueryId(OperationName.USER_TWEETS)})
                
                   if (items.length === 0) break;
                   let newItems = {}
                    let index = 0
                    items.forEach((item) => {
                        const parsedItem = getParsedItem(item, metaData)
                        
                        if(!!parsedItem && !parsedItem.retweeted){
                          newItems[index] = parsedItem
                          index++
                        }
                    }) 
                    
                  setTweets(newItems)
                  setCount((count) => ({...count, totalCount : count.totalCount + Object.keys(newItems).length }))

                   for (let i = 0; i < Object.keys(newItems).length ; i++) {
                    const timeStamp = newItems[i].created_at.getTime()

                    if (startTimestamp <= timeStamp && timeStamp <= endTimestamp){
                      const tweetId = newItems[i].id
                     
                   
                      newItems = {...newItems,[i]: {...newItems[i], state: "active"}}
                      setTweets(newItems)

                      const {data} = await deleteTweet({ queryId : getQueryId(OperationName.DELETE_TWEET), tweetId })
                      if (!!data?.delete_tweet) {
                        newItems = {...newItems,[i]: {...newItems[i], state: "deleted"}}
                        setTweets(newItems)
                        setCount((count)=>  ({...count, postsCount : count.postsCount + 1}))       
                      }  
            
                     }else if(timeStamp < startTimestamp ){
                       loop = false
                       break;
                     }
                    }
                    await Sleep(1)

              }
              return null
        } catch (error) {
          console.log(error)
        }     
 
}, []
)

const deleteReposts = useCallback(async(startTimestamp: number, endTimestamp: number, metaData: metaDataInterface)=>{
      // OperationName.USER_TWEETS_AND_REPLIES
  try { 
              let  loop = true
               while(loop){
                 const {items}  =  await getUserTweetsAndReplays({queryId: getQueryId(OperationName.USER_TWEETS_AND_REPLIES)})
                 
                   if (items.length === 0) break;
                   let newItems = {}
                    let index = 0
                    items.forEach((item) => {
                        const parsedItem = getParsedItem(item, metaData)
                       
                        if(!!parsedItem &&  parsedItem.retweeted){
                          newItems[index] = parsedItem
                          index++
                        }
                    }) 
              
                  setTweets(newItems)
                  setCount((count) => ({...count, totalCount : count.totalCount + Object.keys(newItems).length }))

                   for (let i = 0; i < Object.keys(newItems).length ; i++) {
                    const timeStamp = newItems[i].created_at.getTime()

                    if (startTimestamp <= timeStamp && timeStamp <= endTimestamp){
                      const tweetId = newItems[i].id
                     
                   
                      newItems = {...newItems,[i]: {...newItems[i], state: "active"}}
                      setTweets(newItems)

                      const {data} = await deleteRetweet({ queryId : getQueryId(OperationName.DELETE_RETWEET), sourceTweetId: tweetId })
                      if (!!data?.unretweet) {
                        newItems = {...newItems,[i]: {...newItems[i], state: "deleted"}}
                        setTweets(newItems)
                        setCount((count)=>  ({...count, respostsCount  : count.repostsCount + 1}))       
                      }  
     
                     }else if(timeStamp < startTimestamp ){
                       loop = false
                       break;
                     }
                    }
                    await Sleep(1)
              }
              return null
        } catch (error) {
          console.log(error)
        }   

}
,[])

const deleteReplies = useCallback(async (startTimestamp: number, endTimestamp: number, metaData: metaDataInterface) => {
      // OperationName.USER_TWEETS_AND_REPLIES
 try { 
              let  loop = true
               while(loop){
                 const {items}  =  await getUserTweetsAndReplays({queryId: getQueryId(OperationName.USER_TWEETS_AND_REPLIES)})
                   if (items.length === 0) break;
                   let newItems = {}
                    let index = 0
                    items.forEach((item) => {
                        const parsedItem = getParsedItem(item, metaData)
                        
                        if(!!parsedItem && parsedItem.is_my_reply){
                          newItems[index] = parsedItem
                          index++
                        }
                    }) 
                
                  setTweets(newItems)
                  setCount((count) => ({...count, totalCount : count.totalCount + Object.keys(newItems).length }))

                   for (let i = 0; i < Object.keys(newItems).length ; i++) {
                    const timeStamp = newItems[i].created_at.getTime()

                    if (startTimestamp <= timeStamp && timeStamp <= endTimestamp){
                      const tweetId = newItems[i].id
                     
                   
                      newItems = {...newItems,[i]: {...newItems[i], state: "active"}}
                      setTweets(newItems)

                      const {data} = await deleteTweet({ queryId : getQueryId(OperationName.DELETE_TWEET), tweetId: tweetId })
                      if(!!data?.delete_tweet) {
                        newItems = {...newItems,[i]: {...newItems[i], state: "deleted"}}
                        setTweets(newItems)
                        setCount((count)=>  ({...count, repliesCount  : count.repliesCount + 1}))       
                      }  
          
                     }else if(timeStamp < startTimestamp ){
                       loop = false
                       break;
                     }
                   }
                     await Sleep(1)

              }
              return null
        } catch (error) {
          console.log(error)
        }   

},[]) 

      return (<div className="font-custom" id="x-twitter-overlay-root" role="dialog" aria-modal="true" aria-labelledby="x-twitter-title">
        <div className="x-twitter-backdrop"></div>
         <BulkActionModal 
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
          processing={processing}
       /> 
        <DeletionModal 
          tweets ={tweets}
          count ={count}
          percentage={percentage}
          doneCount={doneCount}
          done= {done}
          processing={processing}
       />

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
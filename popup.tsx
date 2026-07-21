
import "globals.css"
import { XTwitterIcon } from "~components/x-twitter"
 import { Provider, useDispatch, useSelector } from "react-redux"
import {useEffect} from "react"
import { PersistGate } from "@plasmohq/redux-persist/integration/react"

import { persistor, store } from "~/redux/store"
import { mainModalSelector, toggleModal } from "~redux/main-modal-slice"
import { Switch } from "~components/ui/switch"
import { Label } from "~components/ui/label"
import setting from "~package.json"
const PopupView = ()=> {
  const dispatch = useDispatch()
  const display = useSelector(mainModalSelector)
  useEffect(()=>{
         console.log({popup:display})
  },[display])
  return (
<div className="h-[25rem] w-[25rem] p-8 flex flex-col bg-x-twitter-panel text-white">

<div className="flex justify-between items-start gap-6 p-4 border-b border-x-twitter-accent ">
  <div className="x-twitter-logo self-center">
      <XTwitterIcon size={14} className="text-white"/>
  </div>
  <div className="flex-1 ">
    <p className="x-twitter-title">X-Twitter Pal</p>
    <p className="x-twitter-description">Clean up posts, replies &amp; likes</p>
  </div>
</div>

  <div className="x-twitter-body">
    <div className="flex gap-6 justify-between pt-6">
    <Label  className="font-semibold">Show overlay on x-twitter page</Label>
    <Switch checked={display} onCheckedChange={()=> dispatch(toggleModal(!display))} id="mode" />
    </div>
    <div className="leading-5 text-[12.5px] text-x-twitter-accent-hover border  p-4 border-x-twitter-accent bg-gradient-to-br from-violet-600/20 to-violet-400/20 to-[80%] rounded-xl">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
      <span>Turning this on injects the bulk-action panel into the current X/Twitter tab. It won't delete anything until you confirm inside the panel.</span>
    </div>
   </div>
  <div className="mt-auto flex flex-col justify-center items-center font-semibold  ">
     <p className="">Developed by <span>{setting.author}</span> </p>
     <p><span className=" underline">v{setting.version}</span></p>
  </div>
 </div>
  )
}

const IndexPopup = () => {
  return (
        <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PopupView />
      </PersistGate>
    </Provider>

  )
}



export default IndexPopup

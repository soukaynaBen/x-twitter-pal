
import "globals.css"
import { Button } from "~components/ui/button"
import { XTwitterIcon } from "~components/x-twitter"
 import { Provider, useDispatch, useSelector } from "react-redux"
import {useEffect} from "react"
import { PersistGate } from "@plasmohq/redux-persist/integration/react"

import { persistor, store } from "~/redux/store"
import { mainModalSelector, toggleModal } from "~redux/main-modal-slice"
import { Switch } from "~components/ui/switch"
import { Label } from "~components/ui/label"

const PopupView = ()=> {
  const dispatch = useDispatch()
  const display = useSelector(mainModalSelector)
  useEffect(()=>{
         console.log({popup:display})
  },[display])
  return (
        <div className="flex h-[25rem] w-[25rem] flex-col bg-background items-center p-8">
         <h1 className="font-bold text-xl flex items-baseline leading-8 gap-1"><span>Web extension for</span>  <XTwitterIcon size={14}/> </h1>
      <div className="flex items-center space-x-2">
      <Switch checked={display} onCheckedChange={()=> dispatch(toggleModal(!display))} id="mode" />
      <Label htmlFor="mode">Toggle bulk action modal</Label>
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

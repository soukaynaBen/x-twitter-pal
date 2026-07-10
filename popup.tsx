
import "globals.css"
import { Star, X }  from "lucide-react"
import { Button } from "~components/ui/button"
import { XTwitterIcon } from "~components/x-twitter"
 import { Provider } from "react-redux"

import { PersistGate } from "@plasmohq/redux-persist/integration/react"

import { persistor, store } from "~/redux/store"

const PopupView = ()=> {
  return (
        <div className="flex h-[25rem] w-[25rem] flex-col bg-background items-center p-8">
         <h1 className="font-bold text-xl flex items-baseline leading-8 gap-1"><span>Web extension for</span>  <XTwitterIcon size={14}/> </h1>

         <Button size="lg">Click here to delete your items</Button>
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

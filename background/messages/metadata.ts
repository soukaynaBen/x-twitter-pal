import type { PlasmoMessaging } from "@plasmohq/messaging"
import type { metaDataInterface } from "~factory/interface"
   


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
     const metaData = await chrome.storage.local.get({"userId": "", "screenName": ""}) as metaDataInterface

  res.send({ metaData })
  } catch (error) {
    console.log(error)
  }
    
}
 
export default handler

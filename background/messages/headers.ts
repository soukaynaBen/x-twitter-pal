import type { PlasmoMessaging } from "@plasmohq/messaging"
import { XApi } from "~factory/api"
import { xRequestHeaders } from "~factory/constants"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    try {
      
      let headers = {}
      chrome.storage.local.get(
       {[xRequestHeaders.cookie]: "", [xRequestHeaders.xCsrfToken] : "" , [xRequestHeaders.authorization]: "" ,[xRequestHeaders.xTwitterAuthType]: ""}
     ).then((result) => {
                   
        headers = {
         ...XApi.header, 
          [xRequestHeaders.xCsrfToken] : result[xRequestHeaders.xCsrfToken] ,
          [xRequestHeaders.authorization]:  result[xRequestHeaders.authorization]  ,
          [xRequestHeaders.xTwitterAuthType]: result[xRequestHeaders.xTwitterAuthType],
          [xRequestHeaders.cookie]: result[xRequestHeaders.cookie]
       }
 
 
       res.send({ headers})
     })
    } catch (error) {
      console.log(error)
    }

  
}
  

export default handler

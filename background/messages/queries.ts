
import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getQueryIdRegex } from "~lib/utils";
import { addQueries } from "~redux/queries-slice";
 import {store} from "~redux/store"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    let queries = JSON.parse(store.getState().queries.ids)
        
  if (!!queries) {
       res.send({queries})
  }else {
   queries = {}
    const response =  await fetch("https://x.com")
  
    const result = await response.text();
                    
    const mainFileLink = result.match(/https:\/\/abs.twimg.com\/responsive-web\/client-web\/main.([a-zA-Z0-9]+).js/)[0]
    
    const querylistSource = await (await fetch(mainFileLink)).text()
    const regex = /queryId:\s*"([^"]+)",\s*operationName:\s*"([^"]+)"/g
    const regex2 = new RegExp(`"screen_name":"([^"]+)","id_str":"([^"]+)",`)
    const queryResult = querylistSource.match( regex)
    const queryResult2 = result.match(regex2)
    chrome.storage.local.set({"screenName": queryResult2[1],"userId": queryResult2[2]})
    queryResult.forEach((result) => {
        const items = result.match(getQueryIdRegex())
        queries[items[2]] = items[1]
    })

    store.dispatch(addQueries(JSON.stringify(queries)))
    res.send({queries})
   }
  } catch (error) {
    console.log(error)
  }
}
 
export default handler

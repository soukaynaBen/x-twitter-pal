import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
      
   const {homepage} = await chrome.storage.local.get("homepage")
     if (!homepage) {
      
       const html = await fetch("https://x.com/home")
       const response = await html.text()
       chrome.storage.local.set({"homepage":response})
       res.send({response })
      }else {
       res.send({response: homepage })
     }
    
  } catch (error) {
    console.log(error)
  }
}
 
export default handler

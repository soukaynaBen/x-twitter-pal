
import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
      
    const cookie = await chrome.cookies.get({
        url: "https://x.com",
        name: "auth_token"
    })
    
    const isTwitterLoggedIn = cookie !== null && cookie.value.length > 0
    res.send({isTwitterLoggedIn}) 

  } catch (error) {
    console.log(error)
  }
}
 
export default handler

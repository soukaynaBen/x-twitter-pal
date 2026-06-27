import { CODES, OperationName } from "~factory/enum"

export const USER_TWEETS_AND_REPLIES_PATH = `${CODES[OperationName.USER_TWEETS_AND_REPLIES]}/${OperationName.USER_TWEETS_AND_REPLIES}`
export const LIKES_PATH = `${CODES[OperationName.LIKES]}/${OperationName.LIKES}`
export const DELETE_TWEET_PATH = `${CODES[OperationName.DELETE_TWEET]}/${OperationName.DELETE_TWEET}`
export const UNFAVORITE_TWEET_PATH = `${CODES[OperationName.UNFAVORITE_TWEET]}/${OperationName.UNFAVORITE_TWEET}`
export const DELETE_RETWEET_PATH = `${CODES[OperationName.DELETE_RETWEET]}/${OperationName.DELETE_RETWEET}`


export const xRequestHeaders = {
   xClientUuid : "X-Client-Uuid",
   xClientTransactionId : "x-client-transaction-id",
   xCsrfToken : "x-csrf-token",
   authorization : "authorization",
   xTwitterAuthType : "x-twitter-auth-type"
} 


// https://abs.twimg.com/responsive-web/client-web/main.
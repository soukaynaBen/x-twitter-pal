import {  OperationName } from "~factory/enum"


export const xRequestHeaders = {
   xClientUuid : "X-Client-Uuid",
   xClientTransactionId : "x-client-transaction-id",
   xCsrfToken : "x-csrf-token",
   authorization : "authorization",
   xTwitterAuthType : "x-twitter-auth-type",
   cookie : "Cookie"
} 




// const raw = `variables=%7B...%7D&features=%7B...%7D` // your string

// const params = new URLSearchParams(raw)

// const result = {
//   variables: JSON.parse(params.get("variables")),
//   features: JSON.parse(params.get("features")),
//   fieldToggles: JSON.parse(params.get("fieldToggles"))
// }

// console.log(JSON.stringify(result, null, 2))

// const params = new URLSearchParams({
//   variables:    JSON.stringify(data.variables),
//   features:     JSON.stringify(data.features),
//   fieldToggles: JSON.stringify(data.fieldToggles)
// })

// const result = params.toString()
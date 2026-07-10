import { sendToBackground } from "@plasmohq/messaging";
import { apiPath, baseUrl } from "./api";
import { OperationName, REQUEST_METHOD } from "./enum";
import { xRequestHeaders } from "./constants";
import { fromEntriesToItems, generateTID } from "./utils";
import type { requestDataInterface } from "./interface";


export const requestBuilder = async (operationName : OperationName, data : requestDataInterface ) => {
            const  { headers } =   await sendToBackground({"name": "headers"})
            const  { metaData } =   await sendToBackground({"name": "metadata"})
            let path = ""
            let xTID 
            let queryId = data.queryId
            let url : URL
            let userId = metaData.userId
            let screenName = metaData.screenName
         
         switch (operationName) {
             case OperationName.DELETE_RETWEET:
                 xTID = await generateTID(OperationName.DELETE_RETWEET, data.queryId, REQUEST_METHOD.POST)
                 if (xTID) {
                     
                   path =`${baseUrl}${apiPath}${queryId}/${OperationName.DELETE_RETWEET}`
               
                   return  fetch(path,{    
                              headers: { ...headers,
                              "Referer": `${baseUrl}/${screenName}`,
                              "content-type": "application/json",
                              "x-twitter-client-language": document.documentElement.getAttribute("lang"),
                              [xRequestHeaders.xClientTransactionId] : xTID
                            },
                              "method": "POST",
                                body : JSON.stringify({
                                        variables: {
                                            source_tweet_id: data.sourceTweetId,
                                            queryId
                                        }
                                }) 
                            })
                 }
                 break;
            case OperationName.DELETE_TWEET:
                 
                 path =`${baseUrl}${apiPath}${queryId}/${OperationName.DELETE_TWEET}`
                 xTID = await generateTID(OperationName.DELETE_TWEET, data.queryId, REQUEST_METHOD.POST)
                if(xTID){

                    return fetch(path,{
                            headers: { ...headers,
                            "content-type": "application/json",
                            "Referer": `${baseUrl}/${screenName}`,
                            [xRequestHeaders.xClientTransactionId] : xTID
                            },
                            "method": "POST",
                            body: JSON.stringify({
                                    variables: {
                                        tweet_id: data.tweetId,
                                        queryId
                                    }
                            }) 
                    })
                }
                break;
            case OperationName.UNFAVORITE_TWEET:
                 
                 path =`${baseUrl}${apiPath}${queryId}/${OperationName.UNFAVORITE_TWEET}`

                 xTID = await generateTID(OperationName.UNFAVORITE_TWEET, data.queryId, REQUEST_METHOD.POST)
                 if(xTID){

                     return fetch(path,{
                             headers: { ...headers,
                               "content-type": "application/json",
                                "Referer": `${baseUrl}/${screenName}`,
                               [xRequestHeaders.xClientTransactionId] : xTID
                             },
                             "method": "POST",
                             body: JSON.stringify({
                                     variables: {
                                         tweet_id: data.tweetId,
                                         queryId
                                     }
                             }) 
                     })
                 }
                 break;

            case OperationName.USER_TWEETS_AND_REPLIES:
                 
                 path =`${baseUrl}${apiPath}${queryId}/${OperationName.USER_TWEETS_AND_REPLIES}`
           
                 url = new URL( path )

                url.searchParams.set("variables", JSON.stringify({
                    "userId": userId,
                    "count": 20,
                    "includePromotedContent": true,
                    "withCommunity": true,
                    "withVoice": true,
                }))
                      
                url.searchParams.set("features",  JSON.stringify( 
                   {
                    "rweb_video_screen_enabled": false,
                    "rweb_cashtags_enabled": true,
                    "profile_label_improvements_pcf_label_in_post_enabled": true,
                    "responsive_web_profile_redirect_enabled": false,
                    "rweb_tipjar_consumption_enabled": false,
                    "verified_phone_label_enabled": false,
                    "creator_subscriptions_tweet_preview_api_enabled": true,
                    "responsive_web_graphql_timeline_navigation_enabled": true,
                    "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
                    "premium_content_api_read_enabled": false,
                    "communities_web_enable_tweet_community_results_fetch": true,
                    "c9s_tweet_anatomy_moderator_badge_enabled": true,
                    "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
                    "responsive_web_grok_analyze_post_followups_enabled": true,
                    "rweb_cashtags_composer_attachment_enabled": true,
                    "responsive_web_jetfuel_frame": true,
                    "responsive_web_grok_share_attachment_enabled": true,
                    "responsive_web_grok_annotations_enabled": true,
                    "articles_preview_enabled": true,
                    "responsive_web_edit_tweet_api_enabled": true,
                    "rweb_conversational_replies_downvote_enabled": false,
                    "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
                    "view_counts_everywhere_api_enabled": true,
                    "longform_notetweets_consumption_enabled": true,
                    "responsive_web_twitter_article_tweet_consumption_enabled": true,
                    "content_disclosure_indicator_enabled": true,
                    "content_disclosure_ai_generated_indicator_enabled": true,
                    "responsive_web_grok_show_grok_translated_post": true,
                    "responsive_web_grok_analysis_button_from_backend": true,
                    "post_ctas_fetch_enabled": false,
                    "freedom_of_speech_not_reach_fetch_enabled": true,
                    "standardized_nudges_misinfo": true,
                    "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
                    "longform_notetweets_rich_text_read_enabled": true,
                    "longform_notetweets_inline_media_enabled": false,
                    "responsive_web_grok_image_annotation_enabled": true,
                    "responsive_web_grok_imagine_annotation_enabled": true,
                    "responsive_web_grok_community_note_auto_translation_is_enabled": true,
                    "responsive_web_enhance_cards_enabled": false
                }))

                url.searchParams.set("fieldToggles", JSON.stringify( {
                    "withArticlePlainText": false
                }))

                xTID = await generateTID(OperationName.USER_TWEETS_AND_REPLIES, data.queryId, REQUEST_METHOD.GET)
                if(xTID){

                    return fetch(url.toString(),{
                                headers: { ...headers,
                              "content-type": "application/json",
                            "Referer": `${baseUrl}/${screenName}/with_replies`,
                            "emitter": "graphql",
                              [xRequestHeaders.xClientTransactionId] : xTID
                            },
                                "method": "GET",
                                body: null
                           })
                }
                break;
            case OperationName.LIKES:
                 
                 path =`${baseUrl}${apiPath}${queryId}/${OperationName.LIKES}`
                 url = new URL( path )

                url.searchParams.set("variables", JSON.stringify({
                    "userId": userId,
                    "count": 20,
                    "includePromotedContent": false,
                    "withClientEventToken": false,
                    "withBirdwatchNotes": false,
                    "withVoice": true
                }))

                url.searchParams.set("features", JSON.stringify({
                        "rweb_video_screen_enabled": false,
                        "rweb_cashtags_enabled": true,
                        "profile_label_improvements_pcf_label_in_post_enabled": true,
                        "responsive_web_profile_redirect_enabled": false,
                        "rweb_tipjar_consumption_enabled": false,
                        "verified_phone_label_enabled": false,
                        "creator_subscriptions_tweet_preview_api_enabled": true,
                        "responsive_web_graphql_timeline_navigation_enabled": true,
                        "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
                        "premium_content_api_read_enabled": false,
                        "communities_web_enable_tweet_community_results_fetch": true,
                        "c9s_tweet_anatomy_moderator_badge_enabled": true,
                        "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
                        "responsive_web_grok_analyze_post_followups_enabled": true,
                        "rweb_cashtags_composer_attachment_enabled": true,
                        "responsive_web_jetfuel_frame": true,
                        "responsive_web_grok_share_attachment_enabled": true,
                        "responsive_web_grok_annotations_enabled": true,
                        "articles_preview_enabled": true,
                        "responsive_web_edit_tweet_api_enabled": true,
                        "rweb_conversational_replies_downvote_enabled": false,
                        "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
                        "view_counts_everywhere_api_enabled": true,
                        "longform_notetweets_consumption_enabled": true,
                        "responsive_web_twitter_article_tweet_consumption_enabled": true,
                        "content_disclosure_indicator_enabled": true,
                        "content_disclosure_ai_generated_indicator_enabled": true,
                        "responsive_web_grok_show_grok_translated_post": true,
                        "responsive_web_grok_analysis_button_from_backend": true,
                        "post_ctas_fetch_enabled": false,
                        "freedom_of_speech_not_reach_fetch_enabled": true,
                        "standardized_nudges_misinfo": true,
                        "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
                        "longform_notetweets_rich_text_read_enabled": true,
                        "longform_notetweets_inline_media_enabled": false,
                        "responsive_web_grok_image_annotation_enabled": true,
                        "responsive_web_grok_imagine_annotation_enabled": true,
                        "responsive_web_grok_community_note_auto_translation_is_enabled": true,
                        "responsive_web_enhance_cards_enabled": false
                    }))
                url.searchParams.set("fieldToggles", JSON.stringify({withArticlePlainText: false}))

                xTID = await generateTID(OperationName.LIKES, data.queryId, REQUEST_METHOD.GET)
                if(xTID){
                    return fetch(url.toString(),{
                                headers: { ...headers,
                            "content-type": "application/json",
                            "Referer": `${baseUrl}/${screenName}`,
                            [xRequestHeaders.xClientTransactionId] : xTID
                            },
                                "method": "GET",
                                body: null
                            })
                }

                break;
            case OperationName.USER_TWEETS:
                 
                 path =`${baseUrl}${apiPath}${queryId}/${OperationName.USER_TWEETS}`
                  url = new URL( path )

                url.searchParams.set("variables", JSON.stringify({
                    "userId" : userId,
                    "count" : 20,
                    "includePromotedContent" : true,
                    "withQuickPromoteEligibilityTweetFields" : true,
                    "withVoice" : true}
                ))

                url.searchParams.set("features", JSON.stringify({
                    "rweb_video_screen_enabled": false,
                    "rweb_cashtags_enabled": true,
                    "profile_label_improvements_pcf_label_in_post_enabled": true,
                    "responsive_web_profile_redirect_enabled": false,
                    "rweb_tipjar_consumption_enabled": false,
                    "verified_phone_label_enabled": false,
                    "creator_subscriptions_tweet_preview_api_enabled": true,
                    "responsive_web_graphql_timeline_navigation_enabled": true,
                    "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
                    "premium_content_api_read_enabled": false,
                    "communities_web_enable_tweet_community_results_fetch": true,
                    "c9s_tweet_anatomy_moderator_badge_enabled": true,
                    "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
                    "responsive_web_grok_analyze_post_followups_enabled": true,
                    "rweb_cashtags_composer_attachment_enabled": true,
                    "responsive_web_jetfuel_frame": true,
                    "responsive_web_grok_share_attachment_enabled": true,
                    "responsive_web_grok_annotations_enabled": true,
                    "articles_preview_enabled": true,
                    "responsive_web_edit_tweet_api_enabled": true,
                    "rweb_conversational_replies_downvote_enabled": false,
                    "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
                    "view_counts_everywhere_api_enabled": true,
                    "longform_notetweets_consumption_enabled": true,
                    "responsive_web_twitter_article_tweet_consumption_enabled": true,
                    "content_disclosure_indicator_enabled": true,
                    "content_disclosure_ai_generated_indicator_enabled": true,
                    "responsive_web_grok_show_grok_translated_post": true,
                    "responsive_web_grok_analysis_button_from_backend": true,
                    "post_ctas_fetch_enabled": false,
                    "freedom_of_speech_not_reach_fetch_enabled": true,
                    "standardized_nudges_misinfo": true,
                    "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
                    "longform_notetweets_rich_text_read_enabled": true,
                    "longform_notetweets_inline_media_enabled": false,
                    "responsive_web_grok_image_annotation_enabled": true,
                    "responsive_web_grok_imagine_annotation_enabled": true,
                    "responsive_web_grok_community_note_auto_translation_is_enabled": true,
                    "responsive_web_enhance_cards_enabled": false
                }))

                url.searchParams.set("fieldToggles", JSON.stringify({withArticlePlainText: false}))

                xTID = await generateTID(OperationName.USER_TWEETS, data.queryId, REQUEST_METHOD.GET)
                if(xTID){
                    return fetch(url.toString(),{
                        headers: { ...headers,
                    "content-type": "application/json",
                    "Referer": `${baseUrl}/${screenName}`,
                    [xRequestHeaders.xClientTransactionId] : xTID
                    },
                        "method": "GET",
                        body: null
                    })
                }

              
                break;
            default:
                break;
        }

}


export const pathBuilder =  (operationName: OperationName,queryId: string) => {
         switch (operationName) {
            case OperationName.DELETE_RETWEET:
                return `${apiPath}${queryId}/${OperationName.DELETE_RETWEET}`
                
            case OperationName.DELETE_TWEET:
                return `${apiPath}${queryId}/${OperationName.DELETE_TWEET}`
             
            case OperationName.UNFAVORITE_TWEET:
                return `${apiPath}${queryId}/${OperationName.UNFAVORITE_TWEET}`

            case OperationName.LIKES:
                return `${apiPath}${queryId}/${OperationName.LIKES}`

            case OperationName.USER_TWEETS_AND_REPLIES:
                return `${apiPath}${queryId}/${OperationName.USER_TWEETS_AND_REPLIES}`

            case OperationName.USER_TWEETS:
                return `${apiPath}${queryId}/${OperationName.USER_TWEETS}`

            default:
                return apiPath
        }       
}


export async function getUserTweets(data: requestDataInterface){
      const operationName = OperationName.USER_TWEETS
      try {
        const response =  await requestBuilder(operationName, data)        
          if (response.ok) {
               
                 return  await response.json()

               }
      } catch (error) {
                console.log(error)

      }

}
export async function getUserTweetsAndReplays(data: requestDataInterface){
      const operationName = OperationName.USER_TWEETS_AND_REPLIES
    try {
        const response =  await requestBuilder(operationName, data)        
          if (response.ok) {
               
                 return  await response.json()

               }
      } catch (error) {
                console.log(error)

      }
}
export async function getLikes(data: requestDataInterface){
      const operationName = OperationName.LIKES
    try {
        const response =  await requestBuilder(operationName, data)        
          if (response.ok) {
               
                 const  {data} : LikesResponse =  await response.json()
                 
                }
            } catch (error) {
                console.log(error)
            }

}
export async function deleteTweet(data: requestDataInterface){
    const operationName = OperationName.DELETE_TWEET
        try {
                const response =  await requestBuilder(operationName, data)
                  if (response.ok) {
               
                 return  await response.json()

               }
      } catch (error) {
                console.log(error)

      }
}
export async function deleteRetweet(data: requestDataInterface){
      const operationName = OperationName.DELETE_RETWEET
          try {
                  const response =  await requestBuilder(operationName, data)
                    if (response.ok) {
               
                 return  await response.json()

               }
      } catch (error) {
                console.log(error)

      }
}

export async function unfavoriteTweet(data: requestDataInterface){
      const operationName = OperationName.UNFAVORITE_TWEET
          try {
                  const response =  await requestBuilder(operationName, data)
                    if (response.ok) {
                    const result = await response.json()
                 const entries = result.data.user.result.timeline.timeline.instructions.find((ins) => ins.type === "TimelineAddEntries");
                	if (!entries) throw new Error("No TimelineAddEntries found");
			       const { items, cursor } = fromEntriesToItems(entries);
                 return  await response.json()

               }
      } catch (error) {
                console.log(error)

      }
}



    // const variables = `{"listId":"${this.listID}","count":20${cursor ? ",\"cursor\":\"" + cursor + "\"" : ""}}`
    // async *fetchPagesSource(chapter) {
    // 	let cursor;
    // 	while (true) try {
    // 		const [mediaPage, nextCursor] = await this.api.next(chapter, cursor);
    // 		cursor = nextCursor || "last";
    // 		if (!mediaPage || mediaPage.length === 0) break;
    // 		yield Result.ok(mediaPage);
    // 		if (!nextCursor) break;
    // 	} catch (error) {
    // 		yield Result.err(error);
    // 	}
    // }

// 	var Result = class {
// 		value;
// 		error;
// 		static ok(value) {
// 			return { value };
// 		}
// 		static err(error) {
// 			return { error };
// 		}
// 	};


// 		uuid = uuid();
// 		userID;
// 		async *fetchChapters() {
// 			if (window.location.href.includes("/media")) return [new Chapter(1, "User Medias", window.location.href, "https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_bigger.jpg")];
// 			else return [new Chapter(0, "User Posts", window.location.href, "https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_bigger.jpg"), new Chapter(1, "User Media", window.location.href, "https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_bigger.jpg")];
// 		}
// 		async next(chapter, cursor) {
// 			if (!this.userID) this.userID = getUserID();
// 			if (!this.userID) throw new Error("Cannot obatained User ID");
// 			let url = "";
// 			if (chapter.id === 0) {
// 				const variables = `{"userId":"${this.userID}","count":20,${cursor ? "\"cursor\":\"" + cursor + "\"," : ""}"includePromotedContent":true,"withQuickPromoteEligibilityTweetFields":true,"withVoice":true}`;
// 				url = `${window.location.origin}/i/api/graphql/ehYmFq6d3xwc49yqt52MIg/UserTweets?variables=${encodeURIComponent(variables)}&features=%7B%22rweb_video_screen_enabled%22%3Afalse`;
// 			} else {
// 				const variables = `{"userId":"${this.userID}","count":20,${cursor ? "\"cursor\":\"" + cursor + "\"," : ""}"includePromotedContent":false,"withClientEventToken":false,"withBirdwatchNotes":false,"withVoice":true,"withV2Timeline":true}`;
// 				url = `${window.location.origin}/i/api/graphql/MjGtmDI0wpveHq8k2zIlUQ/UserMedia?variables=${encodeURIComponent(variables)}&features=%7B%22rweb_video`;
// 			}
// 			try {
// 				const res = await window.fetch(url, {
// 					headers: createHeader(this.uuid),
// 					signal: AbortSignal.timeout(1e4)
// 				});
// 				const json = await res.json();
// 				if (res.status !== 200 && json?.errors?.[0].message) throw new Error(json?.errors?.[0].message);
// 				if (chapter.id === 0) {
// 					const entries = json.data.user.result.timeline.timeline.instructions.find((ins) => ins.type === "TimelineAddEntries");
// 					if (!entries) throw new Error("Not found TimelineAddEntries");
// 					const { items, cursor } = ForEntriesToItems(entries);
// 					return [items, cursor];
// 				} else {
// 					const instructions = json.data.user.result.timeline.timeline.instructions;
// 					const items = [];
// 					const addToModule = instructions.find((ins) => ins.type === "TimelineAddToModule");
// 					const entries = instructions.find((ins) => ins.type === "TimelineAddEntries");
// 					if (!entries) throw new Error("Not found TimelineAddEntries");
// 					if (addToModule) addToModule.moduleItems.forEach((i) => items.push(i.item));
// 					if (items.length === 0) (entries.entries.find((entry) => entry.content.entryType === "TimelineTimelineModule")?.content)?.items.forEach((i) => items.push(i.item));
// 					return [items, (entries.entries.find((entry) => entry.content.entryType === "TimelineTimelineCursor" && entry.entryId.startsWith("cursor-bottom"))?.content)?.value];
// 				}
// 			} catch (error) {
// 				throw new Error(`twitter api query error: ${error}`);
// 			}
// 		}
// 	};




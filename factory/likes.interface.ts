interface LikesResponse {
  data: {
    user: {
      result: {
        __typename: "User";
        timeline: {
          timeline: {
            instructions: LikesTimelineInstruction[];
            responseObjects?: {
              feedbackActions: any[];
            };
          };
        };
      };
    };
  };
}
type LikesTimelineInstruction =
  | LikesTimelineAddEntriesInstruction
  | LikesTimelineTerminateTimelineInstruction;

interface LikesTimelineAddEntriesInstruction {
  type: "TimelineAddEntries";
  entries: LikesTimelineEntry[];
}

interface LikesTimelineTerminateTimelineInstruction {
  type: "TimelineTerminateTimeline";
  direction: "Top" | "Bottom";
}

interface LikesTimelineEntry {
  entryId: string; // e.g. "tweet-1234567890" or "cursor-bottom-xxxx"
  sortIndex: string;
  content: LikesTimelineTweetContent | LikesTimelineCursorContent ;
}

interface LikesTimelineTweetContent {
  entryType: "TimelineTimelineItem";
  __typename: "TimelineTimelineItem";
  itemContent: {
    itemType: "TimelineTweet";
    __typename: "TimelineTweet";
    tweet_results: {
      result: TweetResult;
    };
    tweetDisplayType?: "Tweet" | "SelfThread";
  };
}

interface LikesTimelineCursorContent {
  entryType: "TimelineTimelineCursor";
  __typename: "TimelineTimelineCursor";
  value: string; // pagination cursor
  cursorType: "Top" | "Bottom";
}


type TweetResult = TweetResultTweet | TweetResultWithVisibility | TweetResultTombstone;

// Normal case — most tweets
interface TweetResultTweet {
  __typename: "Tweet";
  rest_id: string;
  core?: {
    user_results: {
      result: {
        __typename: "User";
        rest_id: string;
        legacy: UserLegacy;
        avatar: {
          image_url: string;
        }
         core: {
          created_at: string;
          name: string;
          screen_name: string
        }
      };
    };
  };
  legacy?: TweetLegacy;
  views?: {
    count?: string;
    state: string;
  };
  quoted_status_result?: {
    result: TweetResult;
  };
}

// Wrapper case — sensitive/age-restricted/limited-visibility tweets
interface TweetResultWithVisibility {
  __typename: "TweetWithVisibilityResults";
  tweet: TweetResultTweet;          // the actual tweet data lives here, same shape as above
  limitedActionResults?: {
    limited_actions: {
      action: string;               // e.g. "Reply", "Share"
      prompt?: {
        __typename: string;
        title: { text: string };
        subtitle?: { text: string };
        confirmation_button?: { text: string };
        dismiss_button?: { text: string };
      };
    }[];
  };
  tweetInterstitial?: {
    __typename: string;
    displayType: string;            // e.g. "SensitiveMediaWarning"
    text: {
      text: string;
      entities: any[];
    };
  };
}

// Deleted / withheld / unavailable tweets
interface TweetResultTombstone {
  __typename: "TweetTombstone";
  tombstone: {
    __typename: "TextTombstone";
    text: {
      text: string; // e.g. "This Tweet was deleted by the Tweet author."
      entities: any[];
    };
  };
}
interface TweetLegacy {
  created_at: string;
  full_text: string;
  favorite_count: number;
  retweet_count: number;
  reply_count: number;
  quote_count: number;
  bookmark_count?: number;
  favorited: boolean;
  retweeted: boolean;
  lang: string;
  id_str: string;
  conversation_id_str: string;
  in_reply_to_status_id_str?: string;
  entities: {
    hashtags: any[];
    urls: any[];
    user_mentions: any[];
    media?: any[];
  };
  extended_entities?: {
    media: any[];
  };
}

interface UserLegacy {
  name: string;
  screen_name: string;
  profile_image_url_https: string;
  followers_count: number;
  friends_count: number;
  verified: boolean;
  description: string;
}

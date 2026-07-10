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

interface TweetResult {
  __typename: "Tweet" | "TweetWithVisibilityResults" | "TweetTombstone";
  rest_id: string;
  core?: {
    user_results: {
      result: {
        __typename: "User";
        rest_id: string;
        legacy: UserLegacy;
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

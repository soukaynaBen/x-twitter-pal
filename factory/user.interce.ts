interface UserTweetsAndRepliesResponse {
  data: {
    user: {
      result: {
        __typename: "User";
        timeline_v2: {
          timeline: {
            instructions: UserTimelineInstruction[];
          };
        };
      };
    };
  };
}

type UserTimelineInstruction =
  | UserTimelinePinEntryInstruction
  | UserTimelineAddEntriesInstruction
  | UserTimelineTerminateTimelineInstruction;

interface UserTimelinePinEntryInstruction {
  type: "TimelinePinEntry";
  entry: UserTimelineEntry; // the pinned tweet, if any
}

interface UserTimelineAddEntriesInstruction {
  type: "TimelineAddEntries";
  entries: UserTimelineEntry[];
}

interface UserTimelineTerminateTimelineInstruction {
  type: "TimelineTerminateTimeline";
  direction: "Top" | "Bottom";
}

interface UserTimelineEntry {
  entryId: string; // "tweet-123", "profile-conversation-456-tweet-789", "cursor-bottom-xxx"
  sortIndex: string;
  content: UserTimelineTimelineItemContent | UserTimelineTimelineModuleContent | UserTimelineCursorContent;
}

// Single standalone tweet (a normal tweet, no thread context needed)
interface UserTimelineTimelineItemContent {
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

// Used for replies: groups the parent tweet(s) + the reply as a visual "module"
interface UserTimelineTimelineModuleContent {
  entryType: "TimelineTimelineModule";
  __typename: "TimelineTimelineModule";
  displayType: "VerticalConversation";
  items: {
    entryId: string; // "tweet-123-tweet-456"
    item: {
      itemContent: {
        itemType: "TimelineTweet";
        __typename: "TimelineTweet";
        tweet_results: {
          result: TweetResult;
        };
      };
    };
  }[];
}

interface UserTimelineCursorContent {
  entryType: "TimelineTimelineCursor";
  __typename: "TimelineTimelineCursor";
  value: string;
  cursorType: "Top" | "Bottom";
}



export interface metaDataInterface {
    userId: string
    screenName: string
}

export interface requestDataInterface {
    queryId : string
    sourceTweetId ?: string
    tweetId ?: string
    cursor?: string | null
}

interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: (string | number)[];
  extensions?: {
    name?: string;               // e.g. "AuthorizationError", "NotFoundError"
    source?: string;
    code?: number;
    kind?: string;
    tracing?: { trace_id: string };
  };
  code?: number;                 // legacy top-level error code (older responses)
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

// ─── DeleteTweet ───────────────────────────────────────────────

 interface DeleteTweetData {
  delete_tweet: {
    tweet_results: Record<string, never>; // typically empty object on success
  };
}

export type DeleteTweetResponse = GraphQLResponse<DeleteTweetData>;

// ─── UnfavoriteTweet (undo a like) ──────────────────────────────

interface UnfavoriteTweetData {
  unfavorite_tweet: string; // literal string "Done" on success
}

export type UnfavoriteTweetResponse = GraphQLResponse<UnfavoriteTweetData>;

// ─── DeleteRetweet ───────────────────────────────────────────────

interface DeleteRetweetData {
  unretweet: {
    source_tweet_results: {
      result: {
        __typename: "Tweet" | "TweetTombstone";
        rest_id?: string;        // present when __typename is "Tweet"
        tombstone?: {            // present when the source tweet is gone
          text: { text: string; entities?: unknown[]; rtl?: boolean };
        };
      };
    };
  };
}

export type DeleteRetweetResponse = GraphQLResponse<DeleteRetweetData>;

// ─── Tombstone shape (reused when fetching a deleted referenced tweet) ──

interface TweetTombstone {
  __typename: "TweetTombstone";
  tombstone: {
    text: {
      text: string;   // e.g. "This Tweet was deleted by the Tweet author."
      entities?: unknown[];
      rtl?: boolean;
    };
  };
}

// ─── Example: discriminated union for a tweet_results.result field ──

type TweetResultUnion =
  | { __typename: "Tweet"; rest_id: string; legacy: Record<string, unknown> }
  | TweetTombstone;
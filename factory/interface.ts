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

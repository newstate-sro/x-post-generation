import { ApifyClient } from 'apify-client'
import { ApifyPostError, ApifyPostResponse, ApifyPostSuccess } from './types'

export class ApifyService {
  private readonly apifyClient: ApifyClient

  constructor() {
    if (!process.env.APIFY_API_TOKEN) {
      throw new Error('APIFY_API_TOKEN not configured')
    }
    this.apifyClient = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    })
  }
  /**
   * Scrapes detailed Facebook posts data including comments, reactions, and shares.
   * Uses the Apify Facebook Posts Scraper actor (apify/facebook-posts-scraper).
   *
   * @param input - Configuration object for the scraper
   * @param input.pagesUrls - Array of Facebook page URLs to scrape
   * @param input.resultsLimit - Maximum number of posts to retrieve per page
   * @param input.captionText - Extract video transcript (if available).
   * @param input.onlyPostsNewerThan - Only scrape posts newer than this date
   * @param input.onlyPostsOlderThan - Only scrape posts older than this date
   * @returns Promise resolving to an array of scraped post data items
   *
   * @see https://console.apify.com/actors/KoJrdxJCTtpon81KY/input
   */
  public async getPostsData(input: {
    pagesUrls: string[]
    resultsLimit?: number
    captionText?: boolean
    onlyPostsNewerThan?: Date
    onlyPostsOlderThan?: Date
  }): Promise<(ApifyPostSuccess | ApifyPostError)[]> {
    try {
      // Initialize actor reference using the specific actor ID
      // Actor ID: 'apify/facebook-posts-scraper' (Facebook Posts Scraper)
      const actor = this.apifyClient.actor('apify/facebook-posts-scraper')

      // Start the actor run with input parameters and wait for completion
      // The .call() method automatically waits for the run to finish
      const run = await actor.call({
        // Array of URLs to scrape - can be Facebook page URLs or specific post URLs
        startUrls: input.pagesUrls.map((url) => ({ url: url })),
        // Maximum number of posts to scrape per page
        resultsLimit: input.resultsLimit,
        captionText: input.captionText,
        onlyPostsNewerThan: input.onlyPostsNewerThan ? input.onlyPostsNewerThan : undefined,
        onlyPostsOlderThan: input.onlyPostsOlderThan
          ? input.onlyPostsOlderThan.toISOString()
          : undefined,
      })

      // Fetch the dataset results after the actor run completes
      // The dataset contains all scraped post data as items
      const { items } = (await this.apifyClient
        .dataset(run.defaultDatasetId)
        .listItems()) as unknown as ApifyPostResponse

      return items
    } catch (error) {
      console.error('ERROR getPostsData:', error)
      throw error
    }
  }
}

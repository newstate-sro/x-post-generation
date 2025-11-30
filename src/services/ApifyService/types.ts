export type ApifyPostUser = {
  id: string
  name: string
  profileUrl: string
  profilePic: string
}

export type ApifyPostTextReference = {
  id: string
  url: string
  profile_url: string
  short_name: string
  work_info: null
  work_foreign_entity_info: null
  mobileUrl: string
}

export type ApifyPostMediaImage = {
  uri: string
  height: number
  width: number
}

export type ApifyPostMediaPhoto = {
  thumbnail?: string
  __typename: 'Photo'
  is_playable: boolean
  image?: ApifyPostMediaImage
  photo_image?: ApifyPostMediaImage
  id: string
  __isMedia: 'Photo'
  photo_cix_screen: null
  copyright_banner_info: null
  owner: {
    __typename: 'User'
    id: string
  }
  ocrText?: string
  accent_color?: string
  photo_product_tags?: unknown[]
  url?: string
}

export type ApifyPostMediaVideo = {
  thumbnail: string
  __typename: 'Video'
  thumbnailImage: {
    uri: string
  }
  id: string
  is_clipping_enabled: boolean
  live_rewind_enabled: boolean
  owner: {
    __typename: 'User'
    id: string
    __isVideoOwner: 'User'
    has_professional_features_for_watch: boolean
  }
  playable_duration_in_ms: number
  is_huddle: boolean
  url: string
  videoId: string
  isPremiere: boolean
  liveViewerCount: number
  is_gaming_video: boolean
  is_live_audio_room_v2_broadcast: boolean
  publish_time: number
  can_viewer_share: boolean
  is_soundbites_video: boolean
  is_looping: boolean
  width: number
  height: number
  is_live_streaming: boolean
  is_video_broadcast: boolean
  is_podcast_video: boolean
  loop_count: number
  is_spherical: boolean
  is_spherical_enabled: boolean
  can_play_undiscoverable: boolean
  permalink_url: string
  video_status_type: string
  can_use_oz: boolean
  dash_manifest: string
  dash_manifest_url: string
  browser_native_sd_url: string
  browser_native_hd_url: string
  audio_availability: string
  muted_segments: unknown[]
  original_width: number
  original_height: number
  original_rotation: string
  is_clip: boolean
  matcha_related_keywords_links: string[]
  is_music_clip: boolean
  image: {
    uri: string
  }
  [key: string]: unknown
}

export type ApifyPostMediaDescription = {
  description: {
    delight_ranges: unknown[]
    image_ranges: unknown[]
    inline_style_ranges: unknown[]
    aggregated_ranges: unknown[]
    ranges: unknown[]
    color_ranges: unknown[]
    text: string
  }
  media: null
  source: null
  title: string
}

export type ApifyPostMediaOther = {
  mediaset_token?: string
  url?: string
  comet_product_tag_feed_overlay_renderer?: null
  [key: string]: unknown
}

export type ApifyPostMedia =
  | ApifyPostMediaPhoto
  | ApifyPostMediaVideo
  | ApifyPostMediaDescription
  | ApifyPostMediaOther

export type ApifyPostPageAdLibrary = {
  is_business_page_active: boolean
  id: string
}

export type ApifyPostSuccess = {
  facebookUrl: string
  postId: string
  pageName: string
  url: string
  time: string
  timestamp: number
  user: ApifyPostUser
  text?: string
  textReferences?: ApifyPostTextReference[]
  link?: string
  likes: number
  comments: number
  shares: number
  topReactionsCount: number
  isVideo?: boolean
  viewsCount?: number
  media: ApifyPostMedia[]
  feedbackId: string
  topLevelUrl: string
  facebookId: string
  pageAdLibrary: ApifyPostPageAdLibrary
  inputUrl: string
}

export type ApifyPostError = {
  inputUrl: string
  error: string
  errorDescription: string
}

export type ApifyPostResponse = {
  items: (ApifyPostSuccess | ApifyPostError)[]
  total: number
  offset: number
  count: number
  limit: number
  desc: boolean
}

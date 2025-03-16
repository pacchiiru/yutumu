export const YtSelectors = {
    NAVBAR: "ytmusic-nav-bar",
    PLAYBAR_SONG_COVER_IMAGE: ".image.ytmusic-player-bar",
    PLAYBAR_SONG_CURRENT_TIME: ".time-info.ytmusic-player-bar",
    PLAYLIST: "#contents.ytmusic-playlist-shelf-renderer",
    PLAYLIST_CONTROLS: "ytmusic-editable-playlist-detail-header-renderer",
    PLAYLIST_SIDEBAR: "ytmusic-guide-section-renderer:not([is-primary]) #items",
    PLAYLIST_SONG: "ytmusic-responsive-list-item-renderer.ytmusic-playlist-shelf-renderer",
    SIDEBAR: "tp-yt-app-drawer",
    SORT_PLAYLIST_SONG_ARTIST_SELECTOR: ".secondary-flex-columns .flex-column",
    SORT_PLAYLIST_SONG_LENGTH_SELECTOR: ".fixed-column.MUSIC_RESPONSIVE_LIST_ITEM_COLUMN_DISPLAY_PRIORITY_HIGH",
    SORT_PLAYLIST_SONG_TITLE_SELECTOR: ".title.ytmusic-responsive-list-item-renderer.complex-string"
} as const;
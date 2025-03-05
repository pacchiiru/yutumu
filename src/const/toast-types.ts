export const ToastTypes = {
    CLOSE: "CLOSE",
    MINIMIZE: "MINIMIZE",
    OPEN: "OPEN",
    PLAYLIST_SORT: "PLAYLIST_SORT"
} as const;

export type ToastAction = (typeof ToastTypes)[keyof typeof ToastTypes];
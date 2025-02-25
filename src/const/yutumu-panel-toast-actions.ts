export const ToastActions = {
    OPEN: "YUTUMU_PANEL_OPEN",
    MINIMIZE: "YUTUMU_PANEL_MINIMIZE",
    CLOSE: "YUTUMU_PANEL_CLOSE",
    PLAYLIST_SORT: "YUTUMU_PANEL_PLAYLIST_SORT"
} as const;

export type ToastAction = (typeof ToastActions)[keyof typeof ToastActions];
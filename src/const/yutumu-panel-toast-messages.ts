import { ToastAction } from './yutumu-panel-toast-actions';

export const ToastMessages: Record<ToastAction, string[]> = {
    YUTUMU_PANEL_OPEN: [
        "Getting your muu-sic ready...",
        "Summoning your muu-sic..."
    ],
    YUTUMU_PANEL_MINIMIZE: [
        "Muu-ving over...",
        "Muu's in the shadows..."
    ],
    YUTUMU_PANEL_CLOSE: [
        "Muu out. Boo bye!"
    ],
    YUTUMU_PANEL_PLAYLIST_SORT: [
        "Playlist sorted!"
    ]
} as const;

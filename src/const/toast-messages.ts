import { ToastAction } from './toast-types';

export const ToastMessages: Record<ToastAction, string[]> = {
    CLOSE: [
        "Muu out. Boo bye!"
    ],
    MINIMIZE: [
        "Muu-ving over...",
        "Muu's in the shadows..."
    ],
    OPEN: [
        "Getting your muu-sic ready...",
        "Summoning your muu-sic..."
    ],
    PLAYLIST_SORT: [
        "Playlist sorted!"
    ]
} as const;

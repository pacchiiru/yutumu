export function getMuuStepStart(assetName: string): string {
    const url = chrome.runtime.getURL(`assets/images/${assetName}.webp`);
    return `<img src="${url}" class="yu-cl-intro-muu"/><div class="yu-cl-intro-text">`;
}

export const MuuSteps = {
    BWEH: getMuuStepStart('muu_bweh'),
    EXCITED: getMuuStepStart('muu_excited'),
    GHOST: getMuuStepStart('muu_ghost'),
    HAPPY: getMuuStepStart('muu_happy'),
    HUH: getMuuStepStart('muu_huh'),
    NORMAL: getMuuStepStart('muu_normal'),
    STEP_END: "</div>",
} as const;
import { YouTubeSelectors } from '../const/youtube-selectors';
import { YouTubeUrlPatterns } from '../const/youtube-url-patterns';
import { IntroPositions } from '../const/yutumu-intro-positions';
import { MuuSteps } from '../const/yutumu-muu-steps';
import { YutumuPanelSelectors } from '../const/yutumu-panel-selectors';

interface TutorialStep {
    element?: string;
    muuStepStart: string;
    intro: string;
    position?: string;
}

interface Tutorial {
    steps: TutorialStep[];
    urlRegex: RegExp;
}

interface TutorialQueue {
    home: Tutorial[];
    playlist: Tutorial[];
}

export const tutorialQueue: TutorialQueue = {
    playlist: [
        {
            steps: [
                {
                    element: YouTubeSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.HUH,
                    intro: "Moo! It looks like you're on a playlist page! I can help you manage your playlist.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YutumuPanelSelectors.SORT_PLAYLIST_BUTTON,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "One useful feature is the \"Sort Playlist\" button.",
                    position: IntroPositions.BOTTOM,
                },
                {
                    element: YutumuPanelSelectors.SORT_PLAYLIST_BUTTON,
                    muuStepStart: MuuSteps.EXCITED,
                    intro: "Select a sorting option, and this button will sort all songs in the playlist.",
                    position: IntroPositions.BOTTOM,
                },
                {
                    element: YouTubeSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "You'll also notice that all songs will have a static-y border applied to them, moo.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YouTubeSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.GHOST,
                    intro: "They're not haunted, I promise...",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YouTubeSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "The borders are just an indicator for you to drag and drop the song, to save it in it's new sorted position moo.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YouTubeSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "Once dragged and dropped by the user, the border will disappear, indicating the song's new ordering is saved.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YouTubeSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "To recap: to save the newly sorted playlist, you'll have to drag and drop each song in-place.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YouTubeSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.BWEH,
                    intro: "I know that's still a bit of work left for you, user...",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YouTubeSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "But currently its a better solution that doing everything completely manually, moo.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YutumuPanelSelectors.SORT_PLAYLIST_BUTTON,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "Well, that's all for now, we hope you find this feature useful.",
                    position: IntroPositions.BOTTOM,
                }
            ],
            urlRegex: YouTubeUrlPatterns.PLAYLIST
        },
    ],
    home: [
        {
            steps: [
                {
                    element: YutumuPanelSelectors.PANEL,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "Welcome to Yutumu!",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YutumuPanelSelectors.PANEL,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "My name is Muu, and my job is to help operate Yutumu for you, moo.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YutumuPanelSelectors.PANEL,
                    muuStepStart: MuuSteps.GHOST,
                    intro: "I'm a ghost so, I'll probably be doing this forever, moo.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YutumuPanelSelectors.PANEL,
                    muuStepStart: MuuSteps.EXCITED,
                    intro: "But I love muu-sic, so making your experience better (and listening in) isn't so bad, moo!",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YutumuPanelSelectors.PANEL,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "So, allow me to show you around Yutumu just a little bit, moo.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YutumuPanelSelectors.PANEL,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "This popup here is the Yutumu panel. You can resize it by dragging at the edges.",
                    position: IntroPositions.RIGHT,
                },
                {
                    element: YutumuPanelSelectors.HEADER,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "And you can move it around by dragging the top section here.",
                    position: IntroPositions.BOTTOM,
                },
                {
                    element: YutumuPanelSelectors.HEADER,
                    muuStepStart: MuuSteps.HUH,
                    intro: "Now pay attention, there's some important buttons up here too moo.",
                    position: IntroPositions.BOTTOM,
                },
                {
                    element: YutumuPanelSelectors.HELP_BUTTON,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "This is the help button - click it, and I'll give some tips depending on the page you're on, moo.",
                    position: IntroPositions.BOTTOM,
                },
                {
                    element: YutumuPanelSelectors.MINIMIZE_BUTTON,
                    muuStepStart: MuuSteps.GHOST,
                    intro: "This is the minimize button. If you click it, I'll ghost out of the way.",
                    position: IntroPositions.BOTTOM,
                },
                {
                    element: YutumuPanelSelectors.CLOSE_BUTTON,
                    muuStepStart: MuuSteps.BWEH,
                    intro: "And this... is the close button. You know, if you really don't want to see me any more, moo.",
                    position: IntroPositions.BOTTOM,
                },
                {
                    element: YutumuPanelSelectors.CLOSE_BUTTON,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "But if you change your mind, you can just reopen the Yutumu panel from the Extensions menu, moo.",
                    position: IntroPositions.BOTTOM,
                },
                {
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "Well, that's all for now. Please click the help button if you want to chat some more moo!"
                },
            ],
            urlRegex: YouTubeUrlPatterns.HOME
        },
    ]
};

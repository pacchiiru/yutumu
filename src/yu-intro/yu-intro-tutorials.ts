import { IntroJsPositions } from '../const/intro-js-positions';
import { MuuSteps } from '../const/muu-steps';
import { YtSelectors } from '../const/yt-selectors';
import { YtUrlPatterns } from '../const/yt-url-patterns';
import { YupSelectorsById } from '../const/yup-selectors-by-id';
import { TutorialQueue } from '../models/tutorial-queue';

export const tutorialQueue: TutorialQueue = {
    home: [
        {
            steps: [
                {
                    element: YupSelectorsById.YUP,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "Welcome to yutumu!",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YupSelectorsById.YUP,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "My name is Muu, and my job is to help operate yutumu for you, moo.",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YupSelectorsById.YUP,
                    muuStepStart: MuuSteps.GHOST,
                    intro: "I'm a ghost so, I'll probably be doing this forever, moo.",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YupSelectorsById.YUP,
                    muuStepStart: MuuSteps.EXCITED,
                    intro: "But I love muu-sic, so making your experience better isn't so bad, moo!",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YupSelectorsById.YUP,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "So, allow me to show you around yutumu just a little bit, moo.",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YupSelectorsById.YUP,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "This popup here is the yutumu panel. You can resize it by dragging at the edges.",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YupSelectorsById.HEADER,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "And you can move it around by dragging the top section here.",
                    position: IntroJsPositions.BOTTOM,
                },
                {
                    element: YupSelectorsById.HEADER,
                    muuStepStart: MuuSteps.HUH,
                    intro: "Now pay attention, there's some important buttons up here too moo.",
                    position: IntroJsPositions.BOTTOM,
                },
                {
                    element: YupSelectorsById.SETTINGS_BUTTON,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "This is the ⚙ Settings button. You can change various yutumu settings and smaller page features here moo.",
                    position: IntroJsPositions.BOTTOM,
                },
                {
                    element: YupSelectorsById.HELP_BUTTON,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "This is the ❔ Help button. Click it, and I'll give some tips depending on the page you're on, moo.",
                    position: IntroJsPositions.BOTTOM,
                },
                {
                    element: YupSelectorsById.MINIMIZE_BUTTON,
                    muuStepStart: MuuSteps.GHOST,
                    intro: "This is the ➖ Minimize button. If you click it, I'll ghost out of the way.",
                    position: IntroJsPositions.BOTTOM,
                },
                {
                    element: YupSelectorsById.CLOSE_BUTTON,
                    muuStepStart: MuuSteps.BWEH,
                    intro: "And this... is the ✖ Close button. You know, if you really don't want to see me any more, moo.",
                    position: IntroJsPositions.BOTTOM,
                },
                {
                    element: YupSelectorsById.CLOSE_BUTTON,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "But if you change your mind, you can just reopen the yutumu panel from the Extensions menu, moo.",
                    position: IntroJsPositions.BOTTOM,
                },
                {
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "Well, that's all for now. Please click the help button if you want to chat some more moo!"
                },
            ],
            urlRegex: YtUrlPatterns.HOME
        }
    ],
    playlist: [
        {
            steps: [
                {
                    element: YtSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.HUH,
                    intro: "Moo! It looks like you're on a playlist page! I can help you manage your playlist.",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YupSelectorsById.SORT_PLAYLIST_BUTTON,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "One useful feature is the \"Sort Playlist\" button.",
                    position: IntroJsPositions.BOTTOM,
                },
                {
                    element: YupSelectorsById.SORT_PLAYLIST_BUTTON,
                    muuStepStart: MuuSteps.EXCITED,
                    intro: "Select a sorting option, and this button will sort all songs in the playlist.",
                    position: IntroJsPositions.BOTTOM,
                },
                {
                    element: YtSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "You'll also notice that all songs will have a static-y border applied to them, moo.",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YtSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.GHOST,
                    intro: "They're not haunted, I promise...",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YtSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "The borders are just an indicator for you to drag and drop the song, to save it in it's new sorted position moo.",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YtSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "Once dragged and dropped by the user, the border will disappear, indicating the song's new ordering is saved.",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YtSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.BWEH,
                    intro: "I know that's still a bit of work left for you, user...",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YtSelectors.PLAYLIST_CONTROLS,
                    muuStepStart: MuuSteps.NORMAL,
                    intro: "But, it should still save you a lot of time moo.",
                    position: IntroJsPositions.RIGHT,
                },
                {
                    element: YupSelectorsById.SORT_PLAYLIST_BUTTON,
                    muuStepStart: MuuSteps.HAPPY,
                    intro: "Well, that's all for now, we hope you find this feature useful.",
                    position: IntroJsPositions.BOTTOM,
                }
            ],
            urlRegex: YtUrlPatterns.PLAYLIST
        }
    ]
};

import { TutorialStep } from './tutorial-step';

export interface Tutorial {
    steps: TutorialStep[];
    urlRegex: RegExp;
}
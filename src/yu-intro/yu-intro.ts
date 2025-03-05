import introJs from 'intro.js';

import { MuuSounds } from '../const/muu-sounds';
import { MuuSteps } from '../const/muu-steps';
import { YuLogService } from '../services/yu-log-service';
import { tutorialQueue } from './yu-intro-tutorials';

let lastSoundIndices: number[] = [];

// Returns first matching tutorial based on current URL
function getNextTutorial(): typeof tutorialQueue.home[0] | null {
  const url: string = window.location.href;

  for (const tutorial of tutorialQueue.playlist) {
    if (tutorial.urlRegex.test(url)) {
      return tutorial;
    }
  }

  for (const tutorial of tutorialQueue.home) {
    if (tutorial.urlRegex.test(url)) {
      return tutorial;
    }
  }

  return null;
}

// Starts intro.js tutorial
function startTutorial(): void {
  const tutorial = getNextTutorial();

  if (tutorial) {
    const tutorialOptions = {
      steps: tutorial.steps as any,
      nextLabel: "NEXT",
      prevLabel: "BACK",
      doneLabel: "OK!",
      tooltipClass: "yu-cl-intro",
    };

    const tour = introJs().setOptions(tutorialOptions);

    tour.onbeforechange(function (this: any) {
      const currentStep = this._introItems[this._currentStep];
      if (currentStep && !currentStep.intro.startsWith(currentStep.muuStepStart)) {
        currentStep.intro = `${currentStep.muuStepStart}${currentStep.intro}${MuuSteps.STEP_END}`;
      }
      return true;
    });

    tour.onafterchange(function (this: any) {
      
      // Delay to allow intro.js to display the next step and play sound
      setTimeout(() => {
        let randomIndex: number;
        if (MuuSounds.length > 3) {
          do {
            randomIndex = Math.floor(Math.random() * MuuSounds.length);
          } while (lastSoundIndices.includes(randomIndex));
        } else {
          randomIndex = Math.floor(Math.random() * MuuSounds.length);
        }

        // Update list of last three played sounds (prevent repeats)
        lastSoundIndices.push(randomIndex);
        if (lastSoundIndices.length > 3) {
          lastSoundIndices.shift();
        }

        const randomSound = MuuSounds[randomIndex];
        const soundUrl = chrome.runtime.getURL(randomSound);
        const audio = new Audio(soundUrl);
        audio.play().catch((err: Error) => YuLogService.error(`Error playing sound: ${err}`));
      }, 100);
    });

    tour.start();
  } else {
    YuLogService.log("No tutorial available for this page.");
  }
}

export { getNextTutorial, startTutorial };

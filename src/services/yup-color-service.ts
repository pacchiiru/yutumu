import { YtSelectors } from '../const/yt-selectors';
import { YuNamesClasses } from '../const/yu-names-classes';
import { YuNamesCssVariables } from '../const/yu-names-css-variables';
import { YupSelectorsById } from '../const/yup-selectors-by-id';
import { YuLogService } from './yu-log-service';

export class YupColorService {
  private defaultBackgroundColor: string = "#ffffff6e";
  private defaultBorderColor: string = "#ffffff80";
  private lastSongImageSrc: string | null = null;
  private lastComputedColor: string | null = null;
  private lastTimeText: string | null = null;

  public updateYupBorder(panelElement: HTMLElement): void {
    const songImageElement = document.querySelector(YtSelectors.PLAYBAR_SONG_COVER_IMAGE) as HTMLImageElement | null;
    const timeInfoElement = document.querySelector(YtSelectors.PLAYBAR_SONG_CURRENT_TIME) as HTMLElement | null;
    const innerElement = panelElement.querySelector(YupSelectorsById.INNER) as HTMLElement | null;

    // Determine if the song is playing by checking if the time has changed
    let isSongPlaying = false;
    if (timeInfoElement) {
      const currentTimeText = timeInfoElement.textContent?.trim() || "";
      if (this.lastTimeText !== currentTimeText) {
        isSongPlaying = true;
        this.lastTimeText = currentTimeText;
      } 
      else {
        isSongPlaying = false;
      }
    }

    if (songImageElement && isSongPlaying) {
      if (!songImageElement.complete) {
        songImageElement.onload = this.updateYupBorder.bind(this, panelElement);
        return;
      }
      if (songImageElement.naturalWidth === 0 || songImageElement.naturalHeight === 0) {
        return;
      }

      // Avoid recomputing if the song image hasn't changed
      const currentAlbumSource = songImageElement.src;
      if (this.lastSongImageSrc === currentAlbumSource && this.lastComputedColor !== null) {
        panelElement.classList.add(YuNamesClasses.YUP_SONG_PLAYING);
        if (innerElement) {
          innerElement.classList.add(YuNamesClasses.YUP_COLOR_PULSING);
        }
        return;
      }

      this.lastSongImageSrc = currentAlbumSource;

      this.getDominantColor(songImageElement)
        .then((adjustedColor: string) => {
          this.lastComputedColor = adjustedColor;
          panelElement.style.setProperty(YuNamesCssVariables.YUP_BORDER_COLOR, adjustedColor);

          // Instead of simply lowering opacity, we brighten the dominant color by overriding lightness
          if (innerElement) {
            const pulsingBgColor = this.brightenColorForBackground(adjustedColor, 0.6, 0.8);
            innerElement.style.setProperty(YuNamesCssVariables.YUP_BACKGROUND_COLOR, pulsingBgColor);
            innerElement.classList.add(YuNamesClasses.YUP_COLOR_PULSING);
          }
          panelElement.classList.add(YuNamesClasses.YUP_SONG_PLAYING);
        })
        .catch((error: Error) => {
          YuLogService.error(`Error extracting dominant color: ${error}`);
          panelElement.style.setProperty(YuNamesCssVariables.YUP_BORDER_COLOR, this.defaultBorderColor);
          if (innerElement) {
            innerElement.style.setProperty(YuNamesCssVariables.YUP_BACKGROUND_COLOR, this.defaultBackgroundColor);
            innerElement.classList.remove(YuNamesClasses.YUP_COLOR_PULSING);
          }
          panelElement.classList.remove(YuNamesClasses.YUP_SONG_PLAYING);
        });
    } 
    
    // Song is paused or song image is missing: revert to default styles
    else {
      panelElement.style.setProperty(YuNamesCssVariables.YUP_BORDER_COLOR, this.defaultBorderColor);
      if (innerElement) {
        innerElement.style.setProperty(YuNamesCssVariables.YUP_BACKGROUND_COLOR, this.defaultBackgroundColor);
        innerElement.classList.remove(YuNamesClasses.YUP_COLOR_PULSING);
      }
      panelElement.classList.remove(YuNamesClasses.YUP_SONG_PLAYING);
      this.lastSongImageSrc = null;
      this.lastComputedColor = null;
    }
  }

  private ensureBrightness(color: string): string {

    // Expecting color format "#RRGGBB"
    if (!color || color.length !== 7) return color;
    const redValue = parseInt(color.substr(1, 2), 16);
    const greenValue = parseInt(color.substr(3, 2), 16);
    const blueValue = parseInt(color.substr(5, 2), 16);

    // If the color is grayscale/monochrome, default to white
    if (redValue === greenValue && greenValue === blueValue) {
      return "#ffffff";
    }

    // Normalize RGB components to the [0, 1] range
    const normalizedRed = redValue / 255;
    const normalizedGreen = greenValue / 255;
    const normalizedBlue = blueValue / 255;

    // Determine the maximum and minimum values for lightness calculation
    const maximumComponent = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
    const minimumComponent = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
    const originalLightness = (maximumComponent + minimumComponent) / 2;

    // Calculate hue and saturation (if not a shade of gray)
    let hueValue: number = 0;
    let saturationValue: number = 0;
    if (maximumComponent !== minimumComponent) {
      const componentDifference = maximumComponent - minimumComponent;

      saturationValue = originalLightness > 0.5
        ? componentDifference / (2 - maximumComponent - minimumComponent)
        : componentDifference / (maximumComponent + minimumComponent);

      if (maximumComponent === normalizedRed) {
        hueValue = (normalizedGreen - normalizedBlue) / componentDifference + (normalizedGreen < normalizedBlue ? 6 : 0);
      } 
      else if (maximumComponent === normalizedGreen) {
        hueValue = (normalizedBlue - normalizedRed) / componentDifference + 2;
      } 
      else {
        hueValue = (normalizedRed - normalizedGreen) / componentDifference + 4;
      }
      hueValue /= 6;
      if (hueValue < 0) {
        hueValue += 1;
      }
    }

    // Define minimum thresholds for saturation and lightness
    const minimumSaturationThreshold = 0.5;
    const minimumLightnessThreshold = 0.5;

    // Ensure the saturation and lightness meet the minimum thresholds
    if (saturationValue < minimumSaturationThreshold) {
      saturationValue = minimumSaturationThreshold;
    }

    let adjustedLightness = originalLightness;
    if (adjustedLightness < minimumLightnessThreshold) {
      adjustedLightness = minimumLightnessThreshold;
    }

    // Convert HSL back to RGB
    let convertedRed: number, convertedGreen: number, convertedBlue: number;

    // Function to convert a hue value to an RGB component
    function hueToRgb(temporaryP: number, temporaryQ: number, temporaryHue: number): number {
      if (temporaryHue < 0) {
        temporaryHue += 1;
      }
      if (temporaryHue > 1) {
        temporaryHue -= 1;
      }
      if (temporaryHue < 1 / 6) {
        return temporaryP + (temporaryQ - temporaryP) * 6 * temporaryHue;
      }
      if (temporaryHue < 1 / 2) {
        return temporaryQ;
      }
      if (temporaryHue < 2 / 3) {
        return temporaryP + (temporaryQ - temporaryP) * (2 / 3 - temporaryHue) * 6;
      }
      return temporaryP;
    }

    const temporaryQ = adjustedLightness < 0.5
      ? adjustedLightness * (1 + saturationValue)
      : adjustedLightness + saturationValue - adjustedLightness * saturationValue;

    const temporaryP = 2 * adjustedLightness - temporaryQ;
    convertedRed = hueToRgb(temporaryP, temporaryQ, hueValue + 1 / 3);
    convertedGreen = hueToRgb(temporaryP, temporaryQ, hueValue);
    convertedBlue = hueToRgb(temporaryP, temporaryQ, hueValue - 1 / 3);

    // Helper to convert a decimal value to a two-digit hexadecimal string
    function toHex(decimalValue: number): string {
      const hexString = Math.round(decimalValue * 255).toString(16);
      return hexString.length === 1 ? "0" + hexString : hexString;
    }

    return `#${toHex(convertedRed)}${toHex(convertedGreen)}${toHex(convertedBlue)}`;
  }

  // Returns an RGBA color that retains the dominant color's hue and saturation
  // but forces the lightness to a high value (bright) with a specified opacity
  private brightenColorForBackground(hex: string, desiredLightness: number = 0.8, alpha: number = 0.8): string {

    // Convert hex to normalized RGB
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    // Convert to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0, s = 0;
    if (max === min) {
      h = 0;
      s = 0;
    } 
    else {

      const d = max - min;
      s = ((max + min) / 2) > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0);
      } 
      else if (max === g) {
        h = (b - r) / d + 2;
      } 
      else {
        h = (r - g) / d + 4;
      }
      h /= 6;
    }
    
    // Override lightness with the desired value
    const lNew = desiredLightness;
    
    // Convert HSL (with new lightness) back to RGB
    function hueToRgb(p: number, q: number, t: number): number {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    
    // Achromatic
    let rNew: number, gNew: number, bNew: number;
    if (s === 0) {
      rNew = gNew = bNew = lNew;
    } 
    else {
      const q = lNew < 0.5 ? lNew * (1 + s) : lNew + s - lNew * s;
      const p = 2 * lNew - q;
      rNew = hueToRgb(p, q, h + 1 / 3);
      gNew = hueToRgb(p, q, h);
      bNew = hueToRgb(p, q, h - 1 / 3);
    }
    const red = Math.round(rNew * 255);
    const green = Math.round(gNew * 255);
    const blue = Math.round(bNew * 255);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  private getDominantColor(imgElement: HTMLImageElement): Promise<string> {
    return new Promise((resolve, reject) => {

      // Use a cloned image with CORS enabled to avoid canvas tainting
      const clonedImage = new Image();
      clonedImage.crossOrigin = "anonymous";
      clonedImage.src = imgElement.src;
      clonedImage.onload = () => {
        if (clonedImage.naturalWidth === 0 || clonedImage.naturalHeight === 0) {
          return reject(new Error("Image dimensions are zero."));
        }

        const canvasElement = document.createElement("canvas");
        const canvasContext = canvasElement.getContext("2d");
        if (!canvasContext) {
          return reject(new Error("Could not get canvas context"));
        }
        canvasElement.width = clonedImage.naturalWidth;
        canvasElement.height = clonedImage.naturalHeight;
        canvasContext.drawImage(clonedImage, 0, 0);

        try {
          const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
          const pixelData = imageData.data;
          let totalRed = 0, totalGreen = 0, totalBlue = 0, pixelCount = 0;

          for (let index = 0; index < pixelData.length; index += 4) {
            totalRed += pixelData[index];
            totalGreen += pixelData[index + 1];
            totalBlue += pixelData[index + 2];
            pixelCount++;
          }

          totalRed = Math.floor(totalRed / pixelCount);
          totalGreen = Math.floor(totalGreen / pixelCount);
          totalBlue = Math.floor(totalBlue / pixelCount);

          const dominantColorHex = `#${((1 << 24) + (totalRed << 16) + (totalGreen << 8) + totalBlue)
            .toString(16)
            .slice(1)}`;

          // Adjust the dominant color so it meets minimum saturation and brightness
          resolve(this.ensureBrightness(dominantColorHex));
        } 
        catch (error) {
          reject(error);
        }
      };

      clonedImage.onerror = () => {
        reject(new Error("Failed to load image for processing."));
      };
    });
  }
}

export const yupColorService = new YupColorService();

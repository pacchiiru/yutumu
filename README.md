# Yutumu

![Yutumu Banner](assets/images/banner_small_cropped.webp)

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Yutumu is a Chrome extension that enhances **YouTube Music** with features to simplify playlist management.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Security](#security)
- [Roadmap](#roadmap)
- [Maintainers](#maintainers)
- [Thanks](#thanks)
- [Contributing](#contributing)
- [License](#license)

## Background

Yutumu was created to simplify **YouTube Music** playlist management. While YouTube Music allows users to add various content (covers, fan remixes, instrumentals, etc.) to playlists, its built-in sorting options (Manual, Newest first, Newest last) are limited. For users with large playlists, manually dragging and dropping hundreds of songs is **time-consuming** and **tedious**.

To address this, **Yutumu** introduces a **sort-by-artist** feature that sorts songs by artist and then by title within each group. The extension rearranges the songs in the **DOM**, and you only need to drag and drop each song to finalize the new order on YouTube’s backend.

> **Note:** This is an **unofficial** extension and is *not* affiliated with or endorsed by YouTube or Google.

## Install

To add Yutumu to your Chrome browser as a local extension:

1. Clone or download the repository:
    ```sh
    git clone https://github.com/your-repo/yutumu.git
    cd yutumu
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Compile:
    ```sh
    npm run build
    ```
4. Open Google Chrome and visit the Extensions page by typing `chrome://extensions` in the address bar.
5. Enable **Developer mode** by toggling the switch at the top-right of the page.
6. Click the **Load unpacked** button at the top-left.
7. Select the generated **dist** folder within the Yutumu repository.
8. Yutumu will now appear in your list of Chrome extensions.

![Yutumu Banner](assets/gifs/muu_excited.gif)

## Usage

1. Install the extension in Developer Mode (see [Install](#install)).
2. Visit any YouTube Music playlist page.
3. Click the **Sort Playlist** button to reorder your playlist.
4. Drag each song in-place to finalize the new order on YouTube’s backend.

![Yutumu Banner](assets/screenshots/yutumu_demo_1.gif)

## Security

Yutumu does **not** share, sell, or transmit your data to any external servers. If you have **any** concerns, **please do not install** the extension.

## Roadmap

Planned features include:

- **intro.js Help**  
  - Step-by-step contextual guides to help navigate Yutumu’s features

- **Additional Playlist Sorting**
  - Sort by song title
  - Sort by track length

- **Export Playlist**
  - Export artists and songs

- **Song Notes**  
  - Save personalized notes for each song (e.g., reasons for adding a song, marking a remix/live version)

- **Lyrics Lookup**  
  - Quickly access song lyrics

![Yutumu Banner](assets/gifs/muu_huh.gif)

## Maintainers

[@pacchiiru](https://github.com/pacchiiru)

## Thanks

Special thanks to the creators and maintainers of:
- [interact.js](https://interactjs.io/)
- [Intro.js](https://introjs.com/)
- [Krita](https://krita.org/)
- [VOICEVOX](https://voicevox.hiroshiba.jp/)
- [YouTube Music](https://music.youtube.com/)

![Yutumu Banner](assets/gifs/muu_happy.gif)

## Contributing

Not accepting contributions for now. Thank you for your interest and support.

## License

MIT License

Copyright (c) 2025 pacchiiru

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
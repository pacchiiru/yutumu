// Sort the playlist items
export function sortPlaylist(): void {
  const container = document.querySelector('#contents.style-scope.ytmusic-playlist-shelf-renderer');
  if (!container) {
    console.warn('YT Music sort: cannot find #contents container.');
    return;
  }

  const playlistItems = Array.from(
    container.querySelectorAll('ytmusic-responsive-list-item-renderer.style-scope.ytmusic-playlist-shelf-renderer')
  );
  if (!playlistItems.length) {
    console.warn('YT Music sort: no playlist items found.');
    return;
  }

  playlistItems.sort((a, b) => {
    const artistA = a.querySelector('.secondary-flex-columns .flex-column.style-scope')?.getAttribute('title') || '';
    const artistB = b.querySelector('.secondary-flex-columns .flex-column.style-scope')?.getAttribute('title') || '';
    const trackA = a.querySelector('.title.style-scope.ytmusic-responsive-list-item-renderer.complex-string')?.getAttribute('title') || '';
    const trackB = b.querySelector('.title.style-scope.ytmusic-responsive-list-item-renderer.complex-string')?.getAttribute('title') || '';
    const artistCompare = artistA.localeCompare(artistB);
    if (artistCompare !== 0) return artistCompare;
    return trackA.localeCompare(trackB);
  });

  playlistItems.forEach(item => container.appendChild(item));

  // Apply static-y border effect by adding the CSS class
  playlistItems.forEach(item => {
    item.classList.add('sorted-item-highlight');
    item.addEventListener('dragend', () => {
      item.classList.remove('sorted-item-highlight');
    });
  });
}

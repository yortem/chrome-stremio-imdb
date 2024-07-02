// Function to insert a new button before the IMDb watchlist button
function insertStremioButton() {
    // Select the IMDb watchlist button
    const imdbButton = document.querySelector('[data-testid="tm-box-wl-button"]');
    if (imdbButton) {
        // Create the new Stremio button
        const stremioButton = document.createElement('button');
        stremioButton.innerHTML = '<img title="Open in Stremio" style="width: 50px;height: 50px;" src="https://www.stremio.com/website/stremio-logo-small.png"/>';
        stremioButton.classList.add('ipc-split-button__btn');
        stremioButton.setAttribute('role', 'button');
        stremioButton.setAttribute('style', 'width: 50px;background-color: transparent;');
        stremioButton.setAttribute('tabindex', '0');
        stremioButton.setAttribute('aria-disabled', 'false');
        stremioButton.style.marginRight = '10px';  // Adjust margin as needed

        // Add click event listener to open Stremio link
        stremioButton.addEventListener('click', function() {
            const imdbIdMatch = window.location.pathname.match(/\/title\/(tt\d+)/);
            if (imdbIdMatch) {
                const imdbId = imdbIdMatch[1];
                const stremioLink = `stremio://detail/movie/${imdbId}`;
                window.open(stremioLink, '_blank');
            }
        });

        // Insert the Stremio button before the IMDb button
        imdbButton.parentNode.insertBefore(stremioButton, imdbButton);
    }
}

// Call the function to insert the Stremio button
insertStremioButton();

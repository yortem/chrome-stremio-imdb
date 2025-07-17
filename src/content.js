console.log('OIS: Extension loaded');
let stremioButtonAdded = false;

// Function to insert a new button before the IMDb watchlist button
function insertStremioButtonIMDB() {
    if (stremioButtonAdded) return;
    console.log('OIS: Run IMDB function');

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
                let stremioLink = `stremio:///detail/movie/${imdbId}`;

                // Check if it's a TV Series
                const ipcInlineListItems = document.querySelectorAll('.ipc-inline-list__item');
                ipcInlineListItems.forEach(item => {
                    if (item.textContent.includes('TV Series')) {
                        stremioLink = `stremio:///detail/series/${imdbId}`;
                    }
                });

                // Open the link using a temporary anchor element
                const tempLink = document.createElement('a');
                tempLink.href = stremioLink;
                tempLink.target = '_self';
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            }
        });

        // Insert the Stremio button before the IMDb button
        imdbButton.parentNode.insertBefore(stremioButton, imdbButton);
        stremioButtonAdded = true;
    }
}

function insertStremioButtonTrakt() {
    if (stremioButtonAdded) return;
    console.log('OIS: Run Trakt function');

    const episodeMatch = window.location.href.match(/\/seasons\/(\d+)\/episodes\/(\d+)/);
    if (episodeMatch) {
        return false;
    }

    // Check if the current URL contains '/shows/' (for TV shows) or '/movies/' (for movies)
    if (window.location.href.includes('/shows/') || window.location.href.includes('/movies/')) {
        console.log('OIS: Detected page');
        // Get the IMDb ID from the external link on Trakt.tv
        const imdbLinkElement = document.getElementById('external-link-imdb');
        if (imdbLinkElement) {
            console.log('OIS: Detected imdb');
            const imdbId = imdbLinkElement.getAttribute('href').split('/').pop(); // Extract IMDb ID from the href attribute

            // Create the new Stremio button
            const stremioButton = document.createElement('button');
            stremioButton.innerHTML = '<img title="Open in Stremio" style="float: left;width: 30px;" src="https://www.stremio.com/website/stremio-logo-small.png"/><span style="font-weight: bold;font-size: 16px;color: #5c58ee;flex-basis: 69%;">Open in Stremio';
            stremioButton.classList.add('ipc-split-button__btn');
            stremioButton.setAttribute('role', 'button');
            stremioButton.setAttribute('style', 'width: 100%;border-color: #5c58ee;height: calc(18px + 20px);margin-right: 10px;text-align: center;margin-bottom: 5px;background-color: white;display: flex;align-items: center;justify-content: flex-start;');
            stremioButton.setAttribute('tabindex', '0');
            stremioButton.setAttribute('aria-disabled', 'false');
            stremioButton.style.marginRight = '10px';  // Adjust margin as needed

            // Add click event listener to open Stremio link
            stremioButton.addEventListener('click', function() {
                let stremioLink = `stremio:///detail/movie/${imdbId}`;

                if (window.location.href.includes('/shows/')) {
                    stremioLink = `stremio:///detail/series/${imdbId}`;
                }

                // Open the link using a temporary anchor element
                const tempLink = document.createElement('a');
                tempLink.href = stremioLink;
                tempLink.target = '_self';
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            });

            // Find the action-buttons element on the page
            const actionButtons = document.querySelector('.action-buttons');
            if (actionButtons) {
                // Insert the Stremio button before the first child of action-buttons
                actionButtons.insertBefore(stremioButton, actionButtons.firstChild);
                stremioButtonAdded = true;
            }
        }
    }
}

function insertStremioButtonLetterboxd() {
    
    if (stremioButtonAdded) return;
    console.log('OIS: Run letterboxd function');
    
    // Check if the current URL contains '/film/' (for movies)
    if (window.location.href.includes('/film/')) {
        // Get the IMDb ID from the external link on Letterboxd
        const imdbLinkElement = document.querySelector('a[data-track-action="IMDb"]');
        if (imdbLinkElement) {
            const imdbHref = imdbLinkElement.getAttribute('href');
            const imdbId = imdbHref.split('/')[imdbHref.split('/').length - 2]; // Extract IMDb ID from the href attribute

            // Create the new Stremio button
            const stremioButton = document.createElement('button');
            stremioButton.innerHTML = '<img title="Open in Stremio" style="float: left;width: 30px;height: 30px;" src="https://www.stremio.com/website/stremio-logo-small.png"/><span style="font-weight: bold;font-size: 16px;margin-left: 10px;padding: 5px;float: left;color: #5c58ee;">Open in Stremio</span>';
            stremioButton.classList.add('ipc-split-button__btn');
            stremioButton.setAttribute('role', 'button');
            stremioButton.setAttribute('style', 'width: 100%;cursor:pointer;border-color: #5c58ee;height:54px;border-radius: 3px;margin-right: 10px;text-align: left;margin-bottom: 5px;background-color: white;');
            stremioButton.setAttribute('tabindex', '0');
            stremioButton.setAttribute('aria-disabled', 'false');
            stremioButton.style.marginRight = '10px';  // Adjust margin as needed

            // Add click event listener to open Stremio link
            stremioButton.addEventListener('click', function() {
                let stremioLink = `stremio:///detail/movie/${imdbId}`;

                // Open the link using a temporary anchor element
                const tempLink = document.createElement('a');
                tempLink.href = stremioLink;
                tempLink.target = '_self';
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
            });

            // Find the 'watch' element on the page
            const watchElement = document.querySelector('.js-actions-panel');
            if (watchElement) {
                // Insert the Stremio button inside the 'watch' element
                watchElement.insertBefore(stremioButton, watchElement.firstChild);
                stremioButtonAdded = true;
            }
        }
    }
}

function insertStremioButtonRT() {
    if (stremioButtonAdded) return;
    console.log('OIS: Run Rotten Tomatoes function');

    // Extract the name from the URL
    const nameMatch = window.location.pathname.match(/\/(?:tv|m)\/([^\/]+)/);
    if (!nameMatch) {
        console.log('OIS: No matching name in URL');
        return;
    }

    let name = nameMatch[1];
    name = name.replace(/_/g, '%20');
    console.log('OIS: Detected name:', name);

    // Create the new Stremio button
    const stremioButton = document.createElement('button');
    stremioButton.innerHTML = '<img title="Open in Stremio" style="float: left;width: 30px;height: 30px;" src="https://www.stremio.com/website/stremio-logo-small.png"/><span style="font-weight: bold;font-size: 16px;margin-top: -11px;margin-left: 10px;padding: 4px;float: left;color: #5c58ee;">Search in Stremio';
    stremioButton.classList.add('ipc-split-button__btn');
    stremioButton.setAttribute('role', 'button');
    stremioButton.setAttribute('style', 'height:50px;margin-right: 10px;text-align: left;margin-bottom: 5px;background-color: white;');
    stremioButton.setAttribute('tabindex', '0');
    stremioButton.setAttribute('aria-disabled', 'false');
    stremioButton.style.marginRight = '10px';  // Adjust margin as needed

    // Add click event listener to open Stremio link
    stremioButton.addEventListener('click', function() {
        let stremioLink = `stremio://search?search=${name}`;

        // Open the link using a temporary anchor element
        const tempLink = document.createElement('a');
        tempLink.href = stremioLink;
        tempLink.target = '_self';
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    });

    const ctaWrap = document.querySelector('.media-scorecard');
    if (ctaWrap) {

        ctaWrap.insertBefore(stremioButton, ctaWrap.firstChild);
        stremioButtonAdded = true;
    }
}

function insertStremioButtonTMDB() {
    if (stremioButtonAdded) return;
    console.log('OIS: Run TMDB function');

    // Check if the current URL contains '/tv/' (for TV shows) or '/movies/' (for movies)
    if (window.location.href.includes('/movie/') || window.location.href.includes('/tv/')) {
        console.log('OIS: Detected page');

        // Get the name of the movie or TV show
        const nameElement = document.querySelector('h2 > a');
        const yearElement = document.querySelector('span.tag.release_date');
        
        if (!nameElement || !yearElement) {
            console.error('OIS: Name or year element not found');
            return;
        }

        const name = nameElement.textContent.trim();
        const year = yearElement.textContent.trim().match(/\d{4}/)[0];

        const thetype = window.location.href.includes('/movie/') ? 'movie' : 'series';
        
        var moviequery = {
            name: name,
            type: thetype,
            year: year
        };

        const stremioButton = document.createElement('a');
        stremioButton.innerHTML = '<img title="Open in Stremio" style="width: 46px; height: 46px;" src="https://www.stremio.com/website/stremio-logo-small.png"/>';
        stremioButton.setAttribute('class', 'stremio-button');
        stremioButton.setAttribute('style', 'margin-left: 10px;');
        stremioButton.setAttribute('data-movie-name', name);
        stremioButton.setAttribute('data-movie-year', year);
        stremioButton.setAttribute('data-movie-type', thetype);

        const actionsElement = document.querySelector('ul.auto.actions');
        if (actionsElement) {
            actionsElement.appendChild(stremioButton);
            stremioButtonAdded = true;
        } else {
            console.error('OIS: Actions element not found');
        }

        metadataFind(moviequery, handleResult);

    }
}

function insertStremioButtonReddit() {
    if (stremioButtonAdded) return;

    // const dropdown = document.querySelector('shreddit-comments-sort-dropdown.flex.justify-between.flex-wrap.mt-sm');
    const dropdown = document.querySelector('h1');

    if (dropdown) {
        // Create the Stremio button
        const stremioButton = document.createElement('button');
        stremioButton.innerHTML = '<img title="Open in Stremio" style="width: 20px; height: 20px; vertical-align: middle; margin: 5px;" src="https://www.stremio.com/website/stremio-logo-small.png"/><span><span id="stremio-text">Create list</span> (<span class="count-stremio">0</span>)</span>';
        stremioButton.style.marginLeft = '10px'; // Adjust margin as needed
        stremioButton.style.cursor = 'pointer'; // Pointer cursor for better UX
        stremioButton.style.padding = '0px 15px 0px 0px';
        stremioButton.id = 'stremio-button';

        // Attach the click event to the button
        stremioButton.addEventListener('click', RedditLoadList);

        // Append the button to the dropdown element
        dropdown.appendChild(stremioButton);
        stremioButtonAdded = true;
    } else {
        console.error('Element "shreddit-comments-sort-dropdown" not found.');
    }

}

function RedditLoadList() {
    console.log('OIS: Run Reddit Button');

    // Check if the current URL contains '/tv/' (for TV shows) or '/movies/' (for movies)
    if (window.location.href.includes('/MovieSuggestions/') || window.location.href.includes('/televisionsuggestions/') || window.location.href.includes('/Letterboxd/')) {
        console.log('OIS: Detected page');

        const thetype = window.location.href.includes('/televisionsuggestions/') ? 'series' : 'movie';
        
        // Get the element with ID "comment-tree"
        const commentTree = document.getElementById("comment-tree");

        if (commentTree == null) {
            return false;
        }

        // Initialize an array to hold the lists of movies
        const movieLists = [];

        // Get all <p> elements within the "comment-tree" element
        const paragraphs = commentTree.querySelectorAll("p");

        // Loop through each <p> element
        paragraphs.forEach(p => {
            
            // Use a regular expression to match and extract the movie name and year
            const textContent = p.textContent.trim();

            const words = textContent.split(/\s+/);

            // Skip paragraphs with more than 8 words
            if (words.length > 8) {
                return;
            }

            // Use a regular expression to match and extract the movie name and year
            const match = textContent.match(/^(.*)\s\((\d{4})\)$/);

            let moviequery;
        
            if (match) {
                // Extract the movie name and year from the match groups
                let name = match[1].trim();
                // Remove the period at the end if it exists
                if (name.endsWith('.')) {
                    name = name.slice(0, -1);
                }
                const year = match[2];
        
                // Create the movie query object with the year
                moviequery = {
                    name: name,
                    type: thetype, // Set the type appropriately
                    year: year,
                    score: ''
                };
            } else {
                // No year found, create the movie query object with null year
                let name = p.textContent.trim();
                // Remove the period at the end if it exists
                if (name.endsWith('.')) {
                    name = name.slice(0, -1);
                }

                moviequery = {
                    name: name,
                    type: thetype,
                    score: ''
                };
            }

            metadataFind(moviequery, handleResult);
        
            // Add the movie query object to the movieLists array
            movieLists.push(moviequery);
        });

    }

    var textbutton = document.getElementById("stremio-text");
    textbutton.innerHTML = 'Download List';

    var stremioButton = document.getElementById("stremio-button");
    stremioButton.removeEventListener('click', RedditLoadList);
    stremioButton.addEventListener('click', downloadCSV);

}

function insertStremioButtonDouban() {
    if (stremioButtonAdded) return;
    console.log('Running insertStremioButtonDouban');

    // Find all span elements with class 'pl'
    const spanElements = document.querySelectorAll('span.pl');
    let imdbElement = null;

    // Find the span element that contains the text "IMDb:"
    spanElements.forEach(span => {
        if (span.textContent.trim() === 'IMDb:') {
            imdbElement = span;
        }
    });

    if (!imdbElement) {
        console.log('IMDb code not found');
        return;
    }

    // Extract the IMDb code
    const imdbText = imdbElement.nextSibling.textContent.trim();
    const imdbMatch = imdbText.match(/tt\d+/);
    if (!imdbMatch) {
        console.log('IMDb code not found in the text');
        return;
    }

    const imdbCode = imdbMatch[0];
    console.log('Found IMDb code:', imdbCode);

    // Determine if it's a movie or a TV show
    const infoElement = document.getElementById('info');
    const type = infoElement && infoElement.textContent.includes('集数') ? 'series' : 'movie';
    console.log('Type:', type);

    // Create the Stremio button
    const stremioButton = document.createElement('a');
    stremioButton.innerHTML = '<img title="Open in Stremio" style="width: 30px; height: 30px;" src="https://www.stremio.com/website/stremio-logo-small.png"/> Open in Stremio';
    stremioButton.classList.add('stremio-button');
    stremioButton.href = `stremio:///detail/${type}/${imdbCode}`;
    stremioButton.style.marginTop = '10px';
    stremioButton.style.fontWeight = 'bold';
    stremioButton.style.fontSize = '16px';
    stremioButton.style.color = '#5c58ee';
    stremioButton.style.textDecoration = 'none';
    stremioButton.style.background = 'white';
    stremioButton.style.display = 'block';

    // Insert the button next to the IMDb element
    infoElement.append(stremioButton);
    stremioButtonAdded = true;
}

function IMDBLoadList() {
    console.log('OIS: Run IMDB LIST Button');

    // Check if the current URL contains 'title_type=tv_series' to determine the type
    const urlParams = new URLSearchParams(window.location.search);
    const thetype = urlParams.get('title_type') === 'tv_series' ? 'TV Series' : 'Movie';
    
    console.log('OIS: Detected type:', thetype);

    // Get all elements with the class "ipc-metadata-list-summary-item"
    const listItems = document.querySelectorAll(".ipc-metadata-list-summary-item");

    // Loop through each list item element
    listItems.forEach(item => {
        // Get the element with the class "ipc-title__text" for the movie/TV show name
        const titleElement = item.querySelector(".ipc-title__text");
        if (!titleElement) return; // Skip if title element not found

        // Extract the name and remove the number and dot at the beginning
        let name = titleElement.textContent.trim();
        name = name.replace(/^\d+\.\s*/, ''); // Remove leading number and dot

        // Get the rating with the class "ipc-rating-star--rating"
        const ratingElement = item.querySelector(".ipc-rating-star--rating");
        const rating = ratingElement ? ratingElement.textContent.trim() : '';

        // Get the year from the first span inside the element with the class "dli-title-metadata"
        const yearElement = item.querySelector(".dli-title-metadata > span");
        const year = yearElement ? yearElement.textContent.trim().split('–')[0].trim() : '';
        const theyear = /^\d{4}$/.test(year) ? year : "";
        
        // Get the IMDb ID from the link inside the class "ipc-title-link-wrapper"
        const linkElement = item.querySelector(".ipc-title-link-wrapper");
        const imdbId = linkElement ? linkElement.href.match(/tt\d+/)[0] : null;

        const specificTypeElement = item.querySelector(".dli-title-type-data");
        const specificType = specificTypeElement ? specificTypeElement.textContent.trim() : thetype;

        // Create the movie/TV show query object
        const moviequery = {
            Position: '',
            Const: imdbId,
            Created: '',
            Modified: '',
            Description: '',
            Title: name,
            'Original Title': '',
            URL: '',
            'Title Type': specificType,
            'IMDb Rating': rating,
            'Runtime (mins)': '',
            Year: theyear,
            Genres: '',
            'Num Votes': '',
            'Release Date': '',
            Directors: '',
            'Your Rating': '',
            'Date Rated': ''
        };

        // Add the movie query object to the movieLists array
        moviesforCSV.push(moviequery);
    });

    var counter = document.querySelector(`.count-stremio`);
    counter.innerText = moviesforCSV.length;

    downloadCSV();

    moviesforCSV = [];
}

function IMDBLoadListButton() {
    if (stremioButtonAdded) return;
    console.log('OIS: Adding Download List Button');
    
    const dropdown = document.querySelector('h1');
    const stremioButton = document.createElement('a');
    stremioButton.innerHTML = '<img title="Download" style="width: 20px; height: 20px; vertical-align: middle; margin: 5px;" src="https://www.stremio.com/website/stremio-logo-small.png"/><span><span id="stremio-text">Download search results</span> (<span class="count-stremio">0</span>)</span>';
    stremioButton.style.cursor = 'pointer'; // Pointer cursor for better UX
    stremioButton.style.border = '2px solid #5c58ee';
    stremioButton.id = 'stremio-button';
    stremioButton.style.padding = '7px';
    stremioButton.style.borderRadius = '20px';
    stremioButton.style.marginTop = '10px';
    stremioButton.style.float = 'left';

    // Attach the click event to the button
    stremioButton.addEventListener('click', IMDBLoadList);

    // Get the .ipc-page-background element and prepend the button to it
    const pageBackground = document.querySelector('.ipc-title');
    if (pageBackground) {
        pageBackground.append(stremioButton);
        stremioButtonAdded = true;
    } else {
        console.log('OIS: .cIsnuK element not found');
    }

}

function runStremioButtons() {
    console.log('OIS: Functions run');
    if (window.location.hostname === 'www.imdb.com') {
        insertStremioButtonIMDB();
        IMDBLoadListButton();
    }

    if (window.location.hostname === 'trakt.tv') {
        insertStremioButtonTrakt();
    }

    if (window.location.hostname === 'letterboxd.com') {
        insertStremioButtonLetterboxd();
    }

    if (window.location.hostname === 'www.rottentomatoes.com') {
        insertStremioButtonRT();
    }

    if (window.location.hostname === 'www.themoviedb.org') {
        insertStremioButtonTMDB();
    }

    if (window.location.hostname === 'bestsimilar.com') {
        var runnedBestsimilar = false;
        const button = document.querySelector('#buttonMoreMovieRelListContainer button');
        
        if (button) {
            button.click();
        }
        if (!runnedBestsimilar) {
            runnedBestsimilar = true;
            setTimeout(insertStremioButtonBestSmilar, 1000);
        }
    }

    if (window.location.hostname === 'www.reddit.com') {
        setTimeout(insertStremioButtonReddit, 1500);
        window.addEventListener('popstate', handleNavigateEventReddit);
    }

    if (window.location.hostname === 'movie.douban.com') {
        insertStremioButtonDouban();
    }
}

function handleNavigateEventReddit(event) {
    stremioButtonAdded = false;
    movies.length = 0;
    moviesforCSV.length = 0;
    setTimeout(insertStremioButtonReddit, 1500);
}

document.addEventListener('DOMContentLoaded', runStremioButtons);

// Try running the functions after the entire page has loaded
window.addEventListener('load', runStremioButtons);

// Set a fallback to run the functions after 3 seconds
setTimeout(runStremioButtons, 1500);



const movies = [];
const moviesforCSV = [];

// Use cinemeta to pull names of movies and series against IMDB IDs
var cinemetaUrls = {
    'movie': 'https://cinemeta.strem.io/stremioget/stremio/v1/q.json?b=eyJwYXJhbXMiOltudWxsLHt9XSwibWV0aG9kIjoibmFtZXMubW92aWUiLCJpZCI6MSwianNvbnJwYyI6IjIuMCJ9',
    'series': 'https://cinemeta.strem.io/stremioget/stremio/v1/q.json?b=eyJwYXJhbXMiOltudWxsLHt9XSwibWV0aG9kIjoibmFtZXMuc2VyaWVzIiwiaWQiOjEsImpzb25ycGMiOiIyLjAifQ==',
}

// Simplify name (replace this function as needed)
function simplifyName(entry) {
    return entry.name.toLowerCase().replace(/[\W_]+/g, '');
}

// Check if two years are similar (replace this function as needed)
function yearSimilar(year1, year2) {
    return Math.abs(year1 - year2) <= 1;
}

// Index entry in our in-mem index
function indexEntry(entry) {
    if (entry.year) entry.year = parseInt(entry.year.toString().split("-")[0]); // first year for series
    var n = simplifyName(entry);
    if (!meta[n]) meta[n] = [];
    meta[n].push(entry);
    byImdb[entry.imdb_id] = entry;
}

// Find in our metadata set
var pulled = { movie: false, series: false };
var meta = {}, byImdb = {};

function metadataFind(query, cb) {
    // It's OK if we don't pass type and we don't fetch names, because we will go to google fallback
    if (query.type && !pulled[query.type] && cinemetaUrls[query.type]) {
        fetch(cinemetaUrls[query.type])
            .then(function (resp) { return resp.json() })
            .then(function (resp) { return resp.result })
            .then(function (res) {
                res.forEach(indexEntry);
                pulled[query.type] = true;
            })
            .catch(function (e) {
                console.error(e)
            })
            .then(function () {
                match();
            });
    } else {
        setTimeout(match, 0);
    }

    function match() {
        var name = simplifyName(query);
        if (!name) return cb(null, null);
        var matches = meta[name] || [];
        var m = matches.find(function (match) {
            if (!(match.type === query.type)) return false;

            if (query.type === 'movie' && query.hasOwnProperty('year'))
                return yearSimilar(query.year, match.year);

            return true;
        });
        // Uniform the result to imdbFind provider
        var res = m ? {
            id: m.imdb_id,
            name: m.name,
            year: m.year,
            type: m.type,
            yearRange: undefined,
            image: undefined,
            starring: undefined,
            similarity: undefined,
        } : false;
        return cb(null, res);
    };
}

// Callback function to handle the result
function handleResult(err, result) {
    if (err) {
        console.error('Error:', err);
    } else {
        if (result) {
            const button = document.querySelector(`a[data-movie-name="${result['name']}"]`);
            if (button) {
                button.href = `stremio:///detail/${result['type']}/${result['id']}`;
            }
            
            var Const = result['id'];
            var Title = result['name'];
            var Year = result['year'];

            moviesforCSV.push({ Const, Title, Year });

            var counter = document.querySelector(`.count-stremio`);
            counter.innerText = moviesforCSV.length;

            return result;
        } else {
            console.log('Movie not found');
        }
    }
}

function containsTextInElement(selector, text) {
    const element = document.querySelector(selector);
    return element ? element.innerText.includes(text) : false;
}

if (containsTextInElement("h1", "TV shows")) {
    const thetype = 'series';
} else {
    const thetype = 'movies';
}

function insertStremioButtonBestSmilar() {

    const items = document.querySelectorAll(".item.item-small");

    items.forEach((item) => {
        const nameElement = item.querySelector(".name-c .name");
        const idElement = item.querySelector(".fav_btn_img button");

        if (nameElement && idElement) {
            const nameYear = nameElement.textContent.trim();
            const id = idElement.getAttribute("data-id");

            // Extract the name and year from the text
            const match = nameYear.match(/^(.*) \((\d{4})\)$/);
            if (match) {
                const name = match[1];
                const year = match[2];

                movies.push({ id, name, year });
            }
        }
    });

    console.log(movies); // For debugging, to see the extracted array

    // Example of inserting a button for each movie
    movies.forEach((movie) => {

        const item = document.querySelector(`.fav_btn_img button[data-id='${movie.id}']`).closest(".item.item-small");
        const itemNameElement = item.querySelector(".name-c");
        const divi = document.createElement("div");
        divi.setAttribute('id','stremio-'+movie.id);
        divi.setAttribute('style','float: right;');

        var myEle = document.getElementById('stremio-'+movie.id);
        if(!myEle) {
            itemNameElement.appendChild(divi);
        } else {
            return false;
        }

        const stremioButton = document.createElement('div');
        stremioButton.innerHTML = '<a class="stremio-button" style="float: left;margin-left: 10px;padding: 2px 2px 2px 10px;border-left: 1px solid #dddcff;" data-movie-name="'+movie.name+'" href="#"><img title="Open in Stremio" style="float: left;width: 30px;height: 30px;" src="https://www.stremio.com/website/stremio-logo-small.png"/><span style="font-weight: bold;font-size: 14px;margin-top: 0px;margin-left: 2px;padding: 4px;float: left;color: #5c58ee;">Open in Stremio</a>';

    
        divi.appendChild(stremioButton);

        if (containsTextInElement("h1", "TV shows")) {
            var thetype = 'series';
        } else {
            var thetype = 'movie';
        }

        var moviequery = {
            name: movie.name,
            type: thetype,
            year: movie.year
        };

        metadataFind(moviequery, handleResult);
    });


    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = 'Download this list as CSV (<span class="count-stremio">0</span> titles)';
    downloadButton.setAttribute('id','download-as-csv');

    var csvdownload = document.getElementById('download-as-csv');
    if(!csvdownload) {
        downloadButton.style = 'float:left;width: 250px;margin: 10px; margin-top: 0px; border-radius: 5px;padding: 12px; background-color: #5c58ee; color: white; border: none; cursor: pointer;';
        downloadButton.addEventListener('click', downloadCSV);

        const textButton = document.createElement('div');
        textButton.setAttribute('style','float: left;width: calc(100% - 300px);padding: 10px; background-color: white; margin: 10px; border: 2px solid #5c58ee; border-radius: 5px;margin-top: 0px;');

        textButton.innerHTML = '<img title="Open in Stremio" style="float: left;width: 20px;height: 20px;margin-right: 15px;" src="https://www.stremio.com/website/stremio-logo-small.png"/> <span>You can then upload it to <a target="_blank" href="https://www.journey.co.il/stremio/">journey.co.il/stremio/</a> in order to create a catalog based on this list</span>';

        const headingExists = document.querySelector('.heading-c');
        if (headingExists) {
            
            document.querySelector(`.heading-c`).appendChild(downloadButton);
            document.querySelector(`.heading-c`).appendChild(textButton);
            document.querySelector('.heading-c').setAttribute('style','margin-bottom: 60px;');
        }
    } else {
        return false;
    }

}

function convertArrayToCSV(array) {
    const csvRows = [];
    const headers = Object.keys(array[0]);
    csvRows.push(headers.join(','));

    for (const row of array) {
        const values = headers.map(header => `"${row[header]}"`);
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

function downloadCSV() {
    if (moviesforCSV.length === 0) {
        return;
    }

    const csvData = convertArrayToCSV(moviesforCSV);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'movies.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

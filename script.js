console.log('I am connected :)');
// Burger menus
document.addEventListener('DOMContentLoaded', function () {
  // open
  const burger = document.querySelectorAll('.navbar-burger');
  const menu = document.querySelectorAll('.navbar-menu');

  if (burger.length && menu.length) {
    for (var i = 0; i < burger.length; i++) {
      burger[i].addEventListener('click', function () {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden');
        }
      });
    }
  }

  // close
  const close = document.querySelectorAll('.navbar-close');
  const backdrop = document.querySelectorAll('.navbar-backdrop');

  if (close.length) {
    for (var i = 0; i < close.length; i++) {
      close[i].addEventListener('click', function () {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden');
        }
      });
    }
  }

  if (backdrop.length) {
    for (var i = 0; i < backdrop.length; i++) {
      backdrop[i].addEventListener('click', function () {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden');
        }
      });
    }
  }
});

//Code For Api requests from AudioDB and MusicBrainz
//Add an event listener to the Search Artist button
document.getElementById("searchButton").addEventListener("click", searchArtist);

//Add a keydown event listener to the input field
document.getElementById("audioDbSearch").addEventListener("keydown", function(event) {
    //Check if the pressed key is Enter
    if (event.key === "Enter") {
        searchArtist();
    }
});

//Your API key for theaudiodb.com
const apiKey = '523532';

//Function to search for an artist
function searchArtist() {
    const artistName = document.getElementById("audioDbSearch").value;

    //URL endpoint for artist search on theaudiodb.com
    const apiUrl = `https://www.theaudiodb.com/api/v1/json/${apiKey}/search.php?s=${artistName}`;

    //Make the API request and handle the response
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            displayArtistInfo(data);
            fetchMusicVideos(data);
            getMusicBrainzData(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

//Function to display artist information
function displayArtistInfo(data) {
    console.log(data)
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (data && data.artists) {
        const artist = data.artists[0];

        //Create an HTML template with the desired properties
        const artistInfoHTML = `
            <p><strong>Artist:</strong> ${artist.strArtist}</p>
            <p><strong>Birth Year:</strong> ${artist.intBornYear}</p>
            <p><strong>Gender:</strong> ${artist.strGender}</p>
            <p><strong>Country:</strong> ${artist.strCountry}</p>
            <p><strong>Genre:</strong> ${artist.strGenre}</p>
            <p><strong>Label:</strong> ${artist.strLabel}</p>
            <p><strong>Website:</strong> <a href="${artist.strWebsite}" target="_blank">${artist.strWebsite}</a></p>
            <p><strong>Biography:</strong><br>${artist.strBiographyEN}</p>
        `;

        //Append the HTML to the resultsDiv
        resultsDiv.innerHTML = artistInfoHTML;
    } else {
        resultsDiv.innerHTML = "No results found for the artist.";
    }
}

//Function to fetch music videos
function fetchMusicVideos(data) {
    if (data && data.artists) {
        const artistId = data.artists[0].idArtist;

        //URL endpoint for fetching music videos using the TADB_Artist_ID
        const apiUrl = `https://www.theaudiodb.com/api/v1/json/${apiKey}/mvid.php?i=${artistId}`;

        //Make the API request and handle the response
        fetch(apiUrl)
            .then((response) => response.json())
            .then((musicVideosData) => {
                displayMusicVideos(musicVideosData);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
}


//Function to display music videos as links with each title on a new line, along with the corresponding thumbnail
function displayMusicVideos(musicVideosData) {
    console.log(musicVideosData);
    const videosDiv = document.getElementById("videos");
    videosDiv.innerHTML = "";
    document.getElementById('slide-track').innerHTML = "";

    const maxVideosToShow = 50; 

    if (musicVideosData.mvids) {
        const musicVideos = musicVideosData.mvids;

        for (let i = 0; i < maxVideosToShow && i < musicVideos.length; i++) {
            const video = musicVideos[i];
            //Extract the YouTube video ID from the URL
            const videoId = getYouTubeVideoId(video.strMusicVid);

            //Check if a thumbnail is available
            if (videoId && video.strTrackThumb) {
              // Create div to hold slides with class styling added
              const slide = document.createElement('div')
              slide.classList.add('slide');
              document.getElementById('slide-track').appendChild(slide);

                //Create an anchor element for the thumbnail
                const thumbnailLink = document.createElement('a');
                thumbnailLink.href = `https://www.youtube.com/watch?v=${videoId}`;
                thumbnailLink.target = "_blank"; // Open the link in a new tab

                //Create an image element for the thumbnail and add to slide div
                const thumbnail = document.createElement('img');
                thumbnail.src = video.strTrackThumb;
                thumbnail.alt = `${video.strTrack} Thumbnail`;
                
                // append link in slide div, append image to anchor tag
                slide.appendChild(thumbnailLink)
                thumbnailLink.appendChild(thumbnail)


            }
        }
        // copy albums to create infinite loop effect
        var copy = document.querySelector('.slide-track').copyNode(true);
        document.querySelector('.slider').appendChild(copy);
    } else {
        console.log('No music videos found for this artist.');
    }
}



//Function to extract YouTube video ID from a URL
function getYouTubeVideoId(url) {
  const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}


//Function to grab more Artisit data from Musicbrainz APi by using MBID thats given from the audioDb request in the artist object
function getMusicBrainzData(data) {
  if (data && data.artists) {
      const strMusicBrainzID = data.artists[0].strMusicBrainzID;
      if (strMusicBrainzID) {
          const musicBrainzApiUrl = `https://musicbrainz.org/ws/2/artist/${strMusicBrainzID}?fmt=json`;

          fetch(musicBrainzApiUrl)
              .then((response) => response.json())
              .then((musicBrainzData) => {
                  displayMusicBrainzData(musicBrainzData);
              })
              .catch((error) => {
                  console.error("Error fetching from MusicBrainz:", error);
              });
      } else {
          console.error("No MusicBrainz ID found for the artist.");
      }
  } else {
      console.error("No artist data available to retrieve MusicBrainz ID.");
  }
}

//Function to display the results in a container ID mb Results
function displayMusicBrainzData(musicBrainzData) {
  console.log(musicBrainzData)
  const mbDataDiv = document.getElementById("mbResults");
  mbDataDiv.innerHTML = ""; // Clear previous results

  if (musicBrainzData) {
      const mbDataHTML = `
          <p><strong>Birth Area:</strong> ${musicBrainzData['begin-area'].name}</p>
          <p><strong>Life Span:</strong> ${musicBrainzData['life-span'].begin} to ${musicBrainzData['life-span'].end || 'present'}</p>
      `;

      //Append the HTML to the mbDataDiv
      mbDataDiv.innerHTML = mbDataHTML;
  } else {
      mbDataDiv.innerHTML = "No MusicBrainz data available for this artist.";
  }
}


const apiURL = 'https://api.lyrics.ovh'

const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')
const more = document.getElementById('more')


const searchSongs = async (term) => {
    let res = await fetch(`${apiURL}/suggest/${term}`)
    const data = await res.json()
    showData(data)
}

function showData(data) {
    let output = ''

    data.data.forEach(song => {
        output += `
        <li>
        <span>
          <strong>${song.artist.name} - ${song.title}</strong>
        </span>
        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
      </li>`

        result.innerHTML = `
      <ul class='songs'>
        ${output}
      </ul>
      `
        if (data.prev || data.next) {
            more.innerHTML = `
                ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
                ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
            `
        }
        else {
            more.innerHTML = ''
        }
    })
}

const getMoreSongs = async (url) => {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await res.json()
    showData(data)
}

// get lyrics for song
const getLyrics = async (artist, songtitle) => {
    const res = await fetch(`${apiURL}/v1/${artist}/${songtitle}`)
    const data = await res.json()

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    result.innerHTML = `<h2> <strong>${artist}</strong> - ${songtitle}</h2>
        <span>${lyrics}</span>`

    more.innerHTML = ''
}


//event listeners
form.addEventListener('submit', e => {
    e.preventDefault()
    const searchTerm = search.value.trim()

    if (!searchTerm) {
        alert('Please type in  a search term')
    } else {
        searchSongs(searchTerm)
    }
})

//get lyrics button 
result.addEventListener('click', e => {
    const clickedEl = e.target
    if (clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist')
        const songtitle = clickedEl.getAttribute('data-songtitle')

        getLyrics(artist, songtitle)
    }
})
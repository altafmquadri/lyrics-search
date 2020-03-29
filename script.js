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
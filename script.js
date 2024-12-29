
console.log('"Starting the script"');

async function songFetcherFromLocalDir(link) {

    let a = await fetch(link)
    let response = await a.text();

    let tempDiv = document.createElement("div")
    tempDiv.innerHTML = response

    let as = tempDiv.getElementsByTagName("a")
    let links = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index].href;
        if (element.endsWith(".m4a") || element.endsWith(".mp3") || element.endsWith(".wav") || element.endsWith(".ogg")) {
            links.push(element)
        }
    }
    return links

}

function songLinkToText(link) {

    let tempArr = link.split('/').pop().split('.')[0].split("%20")
    let songName = ""

    for (const element of tempArr) {
        songName += element + " "
    }
    return songName.trim()
}

function leftSongList_songAdder(className, array) {
    let Artistname = "Umar"
    let one = document.querySelector(className)
    let songUL = one.querySelector("ul").innerHTML
    for (const songs of array) {
        let songName = songLinkToText(songs)
        let tempHTML = `<li>
                                    <img src="assets/icons/music-dvd.svg" alt="" height="50px">
                                    <div class="leftSongListItemsInfo"> 
                                        <span class="songName">${songName}</span>
                                        <span class="artistName">${Artistname}</span>
                                    </div>
                                    <img src="assets/icons/play-button.svg" alt="" height="30px">
                                </li>`
        songUL = songUL + tempHTML
    }

    one.querySelector("ul").innerHTML = songUL

    console.log(songUL);

}

async function main() {
    let songLinks = await songFetcherFromLocalDir("http://127.0.0.1:3000/assets/songs/")
    leftSongList_songAdder(".leftSongList", songLinks)

}

main().then(r => {})
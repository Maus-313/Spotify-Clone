let music
let songIdx = undefined
let folder = undefined

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

function rawDurationToProperDuration(rawDuration) {
    let minutes = Math.floor(rawDuration / 60);
    let seconds = Math.floor(rawDuration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
    let Artistname = "Kohei Tanaka"
    let one = document.querySelector(className)
    let songUL = one.querySelector("ul").innerHTML
    for (const songs of array) {
        let songName = songLinkToText(songs)
        let tempHTML = `<li>
                                    <div>
                                        <img src="assets/icons/music-dvd.svg" alt="" height="50px">
                                        <div class="leftSongListItemsInfo" data-music-url = "${songs}">
                                            <span class="songName">${songName}</span>
                                            <span class="artistName">${Artistname}</span>
                                        </div>
                                    </div>
                                    <img src="assets/icons/play-button.svg" alt="" height="30px">
                                </li>`
        songUL = songUL + tempHTML
    }

    one.querySelector("ul").innerHTML = songUL
}

function playMusic_updateTimer(link) {
    if (music == undefined) {
        music = new Audio(link)
        music.play().then(() => {
            let progress = (music.currentTime / music.duration) * 100;
            document.querySelector(".rightInfoBox span:last-child").innerHTML = rawDurationToProperDuration(music.duration)
        });

        music.addEventListener("timeupdate", () => {
            document.querySelector(".rightInfoBox span:first-child").innerHTML = rawDurationToProperDuration(music.currentTime)
            document.querySelector(".circle").style.left = `${((music.currentTime) / (music.duration)) * 100}%`
        })
    } else {
        document.querySelector(".circle").style.left = `0%`
        music.pause()
        music = new Audio(link)
        music.play().then(() => {
            document.querySelector(".rightInfoBox span:last-child").innerHTML = rawDurationToProperDuration(music.duration)
        })
        music.addEventListener("timeupdate", () => {
            document.querySelector(".rightInfoBox span:first-child").innerHTML = rawDurationToProperDuration(music.currentTime)
            document.querySelector(".circle").style.left = `${((music.currentTime) / (music.duration)) * 100}%`
        })
    }
    document.querySelectorAll(".player .playButtons button")[1].innerHTML = "Playing"

}

function controlMusic_updatePlayButton(music, command) {
    let musicList = document.querySelector(".leftSongList ul").getElementsByTagName("li")
    
    if (music == undefined) {
        alert("Please choose a music first!")
    } else {
        if (command == "play") {
            if (music.paused) {
                music.play()
                document.querySelectorAll(".player .playButtons button")[1].innerHTML = "Playing"

            } else {
                music.pause()
                document.querySelectorAll(".player .playButtons button")[1].innerHTML = "Paused"
            }
        } else if (command == "previous") {
            songIdx--;
            if (songIdx == -1) {
                alert("You are at end of the Beginning of the playlist")
                songIdx++;
            } else {
                let url = musicList[songIdx].getElementsByTagName("div")[1].getAttribute("data-music-url");
                playMusic_updateTimer(url)
                document.querySelector(".leftInfoBox").innerHTML = songLinkToText(url);
            }

        } else if (command == "next") {
            songIdx++;
            
            if (songIdx == (musicList.length)) {
                alert("You are at end of the End of the playlist")
                songIdx--;
            } else {
                let url = musicList[songIdx].getElementsByTagName("div")[1].getAttribute("data-music-url");
                playMusic_updateTimer(url)
                document.querySelector(".leftInfoBox").innerHTML = songLinkToText(url);
            }
        }
    }
}

function buttonActivityObserver(buttonArray) {
    buttonArray.forEach(element => {
        element.addEventListener("click", () => {
            controlMusic_updatePlayButton(music, element.getAttribute("data-action-name"))
        })
    });
}


function seekBarActivityObserver() {
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let progress = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = `${progress}%`
        music.currentTime = music.duration * (progress / 100);
    })
}

function volumeControllerActivityObserver(){
    document.getElementById("volumeControll").addEventListener("input",(e) => {
        if(music != undefined){
            music.volume = e.target.value/100;
        }
    } )
}

function leftPlaylistActivityObserver(musicList, buttonArray){
    for (let i = 0; i < musicList.length; i++) {
        musicList[i].addEventListener("click", () => {
            songIdx = i;
            let url = musicList[i].getElementsByTagName("div")[1].getAttribute("data-music-url");
            playMusic_updateTimer(url, buttonArray[1]);
            document.querySelector(".leftInfoBox").innerHTML = songLinkToText(url);
        });
    }
}

function mobileViewHandler(){
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector("main .left").style.left = "0%";
    })

    document.querySelector(".left_drawer_backButton").addEventListener("click", () => {
        document.querySelector("main .left").style.left = "-100%";
    })
}

async function main() {
    folder = "songs"
    let songLinks = await songFetcherFromLocalDir(`./assets/${folder}/`)
    leftSongList_songAdder(".leftSongList", songLinks)

    let musicList = document.querySelector(".leftSongList ul").getElementsByTagName("li")
    let buttonArray = document.querySelectorAll(".player .playButtons button")


    // Attaching event listner to all the songs in the left playlist!
    leftPlaylistActivityObserver(musicList,buttonArray)

    buttonActivityObserver(buttonArray)
    seekBarActivityObserver()
    volumeControllerActivityObserver()

    mobileViewHandler()
}

main()
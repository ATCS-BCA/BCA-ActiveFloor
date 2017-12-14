/* This is an object that makes interacting with audio simple.
[Methods]
.curTime()
.loadMusic(path)
.init()
.pauseMusic()
.playMusic()
==============
.curTime():
    Set the current position of the audio file in seconds from the start
.loadMusic(path):
    Loads the audio file at the given path (but does not play it)
.init():
    Creates an audio object for an audio file (path can be changed with .loadMusic())
.pauseMusic():
    Pauses the audio at the current time value
.playMusic():
    Plays the audio from the beginning or current time value

*/

var Music = {
    curTime: (time) => {
        Music.song.currentTime = time
    },
    loadMusic: (path) => {
        Music.song.src = path // e.g. 'myaudiofile.mp3'
        Music.song.load()
    },
    init: () => {
        Music.song = new Audio('myaudiofile.mp3')
    },
    pauseMusic: () => {
        Music.song.pause()
    },
    playMusic: () => {
        Music.song.play()
    }
}
const audio = new Audio("assets/alarm.mp3");

let isPlaying = false;

audio.onended = function onAudioEnd(){
    isPlaying =false;
}
audio.onplay = function onAdudioPlay(){
    isPlaying = true;
}

const play = function playAudio(){
    if(isPlaying) return;
    audio.currentTime = 0;
    audio.play();
}

const stop = function stopAudio(){
    if(!isPlaying) return;
    audio.pause();
    audio.currentTime = 0;
    isPlaying =false;
}

const setVolume = function setAudioVolume(val){
    if (val>1.0) val/=100;
    audio.volume = val
}

const alarm = { play, stop ,setVolume}

export default alarm;
import Timer from './Timer';
import voice from './voice';

let filteredCount = 0,filteredSum = 0,  canTrack = false, continuousNoise=0;

let sampler = new Timer(onTime,1000);
sampler.start();

function onTime(){
    
    let med = filteredSum/filteredCount;
    let wasNoise = med <= 0.5;

    

    continuousNoise += wasNoise? 1: -continuousNoise;

    

    const timeout  = tracker.timeout;
    if(continuousNoise>=timeout && !!tracker.onSilence){
        tracker.onSilence(continuousNoise-timeout+1);
    }


    filteredCount = 0;
    filteredSum = 0;
};



const tracker = {
    start(){
        canTrack = true;
        sampler.start();
    },
    stop(){
        canTrack = false;
        filteredCount=0;
        filteredSum=0;
        continuousNoise=0;
        sampler.stop();
    },
    onVolumeUpdate:null,
    onSilenceInterrupted:null,
    onSilence:null,
    threshold:10,
    timeout:3
};



voice.addListener((level)=>{
    if(!canTrack) return;

    let filtered =  (level <= tracker.threshold ? 0 : 1 );
    filteredSum+= filtered;
    filteredCount++;

    if(filtered > 0 && continuousNoise >0 ){
        tracker.stop();
        tracker.onSilenceInterrupted(); 
        tracker.start();
    }


    if(!tracker.onVolumeUpdate) return;
    tracker.onVolumeUpdate(level)
});

export default tracker;
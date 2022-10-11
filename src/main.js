import alarm from './lib/alarm';

import store from './lib/store';
import tracker from './lib/tracker';

import {switcher, threshold, timeout,volumeCtrl,indicator, badge}  from './lib/ui';

load();

tracker.onVolumeUpdate = onVolumeUpdate;
tracker.onSilence  = silenceHandler;
tracker.onSilenceInterrupted = silenceInterrupted

tracker.start();


function load(){
    store.load();
    volumeCtrl.value = store.volume;
    alarm.setVolume(volumeCtrl.value)
    timeout.value = store.timeout
    threshold.value = store.threshold;
    
    tracker.threshold = threshold.value;
    tracker.timeout = timeout.value;

}


function silenceHandler(time){
    console.log("silenceHandler")
    alarm.play();
    badge.show(time);
}
function silenceInterrupted(){
    console.log("silenceInterrupted")
    alarm.stop();
    badge.hide();

}


switcher.onChange = function switchHandler(){
    if( switcher.value){
        tracker.start();
        
    }else{
        tracker.stop();
        indicator.value = 0;
    }
    
 
};

threshold.onChange = function thresholdHandler(){
    let value = threshold.value;
    store.threshold  = value;
    tracker.threshold = value;
};

timeout.onChange = function handleTimoutChange(){
    var value = timeout.value;
    store.timeout = value;
    tracker.timeout = value;
};

volumeCtrl.onChange = function handleTimoutChange(){
    let value = volumeCtrl.value;
    store.volume = value;
    alarm.setVolume(value);
};






function onVolumeUpdate(value){
    indicator.value =value;
}







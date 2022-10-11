(function () {
    'use strict';

    const audio = new Audio("assets/alarm.mp3");

    let isPlaying = false;

    audio.onended = function onAudioEnd(){
        isPlaying =false;
    };
    audio.onplay = function onAdudioPlay(){
        isPlaying = true;
    };

    const play = function playAudio(){
        if(isPlaying) return;
        audio.currentTime = 0;
        audio.play();
    };

    const stop = function stopAudio(){
        if(!isPlaying) return;
        audio.pause();
        audio.currentTime = 0;
        isPlaying =false;
    };

    const setVolume = function setAudioVolume(val){
        if (val>1.0) val/=100;
        audio.volume = val;
    };

    const alarm = { play, stop ,setVolume};

    function has(key){
        return (localStorage.getItem(key) !== null);
    }

    function getValueFor(key, defaults=0){
        if(!has(key)){
            setValueFor(key,defaults);
            return defaults;
        }

        return localStorage.getItem(key);
    }

    function setValueFor(key,value){
        localStorage.setItem(key,value);

    }



    const store = {
        load(){
            this.threshold = getValueFor("threshold");
        },
        get threshold(){
                return getValueFor("threshold",12)
        },
        set threshold(val){
            setValueFor("threshold",val);
        },
        get volume(){
            return getValueFor("volume",50)
        },
        set volume(val){
            setValueFor("volume",val);
        }
        ,get timeout(){
            return getValueFor("timeout",10)
        },
        set timeout(val){
            setValueFor("timeout",val);
        },

    };

    class Timer{
        constructor(handler,interval=1000){
            this.handler  = handler;
            this.interval = interval;
            this.enabled = false;
            setInterval(() => {
                if(!this.enabled) return;
                handler();
            }, interval);

        }

        start(){
            this.enabled = true;

        }

        stop(){
           this.enabled = false;
        }
    }

    let level=0;

    const listeners = [];


    const voice= {
      get level(){
        return level;
      },
      addListener(listener){
        listeners.push(listener);
      },
      canPlay:true
      

    };

    function onInputUpdate(value){
      if(listeners.length<1) return;
      
      listeners.forEach(listener=>{
        listener(value);
      });
      
    }

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
    .then(function(stream) {
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
      
          analyser.smoothingTimeConstant = 0.8;
          analyser.fftSize = 1024;
      
          microphone.connect(analyser);
          analyser.connect(scriptProcessor);
          scriptProcessor.connect(audioContext.destination);
          scriptProcessor.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            const arraySum = array.reduce((a, value) => a + value, 0);
            const average = arraySum / array.length;
            onInputUpdate(average);
          };
    })
    .catch(function(err) {
        /* handle the error */
        alert(err);

    });

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
    }


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
        tracker.onVolumeUpdate(level);
    });

    function at(id){
        return document.getElementById(id)
    }




    let $switch = at("switch");
    const switcher = {
        set onChange(val){
            $switch.oninput = ()=> val(this.value);
        },
        get value(){
            return $switch.checked;
        }
    };



    let $threshold = at("threshold");
    const threshold = {
        set onChange(val){
            $threshold.oninput = ()=> val(this.value);
        },
        get value(){
            return $threshold.value;
        },
        set value(val){
            $threshold.value =val;
        }
    };


    let $badge = at("badge");
    const badge={
        show(val){
            //$badge.textContent  = val;
            $badge.style.visibility = "visible";
        },
        hide(){
            $badge.style.visibility = "hidden";
        }
    };




    let $timeout = at("timeout");
    const timeout = {
        set onChange(val){
            $timeout.oninput = ()=> val(this.value);
        },
        get value(){
            return $timeout.value || 3;
        },
        set value(val){
            $timeout.value = val;
        }
    };


    let $volumeCtrl = at("volumeCtrl");
    const volumeCtrl={
        set onChange(val){
            $volumeCtrl.oninput = ()=> val(this.value);
        },
        get value(){
            return $volumeCtrl.value || 0;
        },
        set value(val){
             $volumeCtrl.value = val;
        }

    };

    let $indicator =at("indicator");

    const indicator = {
        set value(val){
            $indicator.value =val;
        },
        get value(){
            return $indicator.value;
        }
    };



    //export default ui;

    load();

    tracker.onVolumeUpdate = onVolumeUpdate;
    tracker.onSilence  = silenceHandler;
    tracker.onSilenceInterrupted = silenceInterrupted;

    tracker.start();


    function load(){
        store.load();
        volumeCtrl.value = store.volume;
        alarm.setVolume(volumeCtrl.value);
        timeout.value = store.timeout;
        threshold.value = store.threshold;
        
        tracker.threshold = threshold.value;
        tracker.timeout = timeout.value;

    }


    function silenceHandler(time){
        console.log("silenceHandler");
        alarm.play();
        badge.show(time);
    }
    function silenceInterrupted(){
        console.log("silenceInterrupted");
        alarm.stop();
        badge.hide();

    }


    switcher.onChange = function switchHandler(){
        if( switcher.value){
            tracker.start();
            
        }else {
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

})();

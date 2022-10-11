

export default class Timer{
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
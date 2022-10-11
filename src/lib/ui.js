
function at(id){
    return document.getElementById(id)
}




let $switch = at("switch");
export const switcher = {
    set onChange(val){
        $switch.oninput = ()=> val(this.value)
    },
    get value(){
        return $switch.checked;
    }
}



let $threshold = at("threshold");
export const threshold = {
    set onChange(val){
        $threshold.oninput = ()=> val(this.value)
    },
    get value(){
        return $threshold.value;
    },
    set value(val){
        $threshold.value =val;
    }
}


let $badge = at("badge");
export const badge={
    show(val){
        //$badge.textContent  = val;
        $badge.style.visibility = "visible";
    },
    hide(){
        $badge.style.visibility = "hidden";
    }
}




let $timeout = at("timeout");
export const timeout = {
    set onChange(val){
        $timeout.oninput = ()=> val(this.value)
    },
    get value(){
        return $timeout.value || 3;
    },
    set value(val){
        $timeout.value = val;
    }
}


let $volumeCtrl = at("volumeCtrl");
export const volumeCtrl={
    set onChange(val){
        $volumeCtrl.oninput = ()=> val(this.value);
    },
    get value(){
        return $volumeCtrl.value || 0;
    },
    set value(val){
         $volumeCtrl.value = val;
    }

}

let $indicator =at("indicator");

export const indicator = {
    set value(val){
        $indicator.value =val;
    },
    get value(){
        return $indicator.value;
    }
}



//export default ui;
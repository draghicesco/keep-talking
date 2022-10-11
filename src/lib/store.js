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
        this.threshold = getValueFor("threshold")
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

}





export default store;
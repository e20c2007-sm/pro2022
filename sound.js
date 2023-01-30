const soundsDir = "./sounds";

let volumes = {
    "bgm": 0,
    "se": 0
}

let loopSound = {
    "bgm": [],
    "se": []
}

function playSound(data){
    let sound = new Audio(data.path);
    sound.volume = volumes[data.key];
    if(data.looped){
        sound.loop = true;
    }
    sound.play();

    if(sound.loop){
        loopSound[data.key].push(sound);
    }
}

function volumeChange(data){
    let volume = data.volume;
    switch(data.key){
        case "bgm":
            volumes.bgm = volume;
            loopSound.bgm.forEach(e => {
                e.volume = volume;
            });
            break;

        case "se":
            volumes.se = volume;
            loopSound.se.forEach(e => {
                e.volume = volume;
            });
            break;
        
        case "all":
            volumeChange({key: "bgm", volume: volume});
            volumeChange({key: "se", volume: volume});
            break;
    }
}

volumeChange({key: "all", volume: 0.3});
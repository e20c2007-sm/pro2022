const soundsDir = "./sounds";

let volumes = {
    "bgm": 0,
    "se": 0
}

function playSound(data){
    console.table(data);
    let sound = new Audio(data.path);
    sound.volume = volumes[data.key];
    if(data.looped){
        sound.loop = true;
    }
    sound.play();
}

function volumeChange(data){
    let volume = data.volume;
    switch(data.key){
        case "bgm":
            volumes.bgm = volume;
            break;

        case "se":
            volumes.se = volume;
            break;
        
        case "all":
            volumes.bgm = volume;
            volumes.se = volume;
            break;
    }
}

volumeChange({key: "all", volume: 0.3});
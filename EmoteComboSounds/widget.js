// URLs in userConfig are not real, please replace them with your URLs for sounds/images
// Sound files are mandatory, image files are optional
let globalCooldown = 60; //seconds
let userConfig = [
    {
        emote: "OMEGALUL",
        amount: 3,
        soundFile: "https://cdn.streamelements.com/uploads/OMEGALUL.mp3",
        imageFile: "https://cdn.streamelements.com/uploads/OMEGALUL_ANIMATED.gif",
        volume: 50,
        timeout: 10, //seconds for triggering combo (amount occurrences within timeout seconds)
        cooldown: 240, //seconds
        caseSensitive: true,
    },
    {
        emote: "hello",
        amount: 2,
        soundFile: "https://cdn.streamelements.com/uploads/Kappa.ogg",
        imageFile: "",
        volume: 50,
        timeout: 10, //seconds for triggering combo (amount occurrences within timeout seconds)
        cooldown: 240, //seconds
        caseSensitive: false,
    }
];


let queue = $("#placeholder");
let emoticons = [];
window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let message = data["text"];
    let words = message.split(" ");
    let results = words.filter(value => -1 !== emoticons.indexOf(value.toLowerCase()));
    console.log(results);
    results = Array.from(new Set(results)); //getting unique words
    for (let i in results) {
        index = userConfig.findIndex(x => x.emote.toLowerCase() === results[i].toLowerCase());
        if (index !== -1) {
            if (!userConfig[index]['caseSensitive'] || userConfig[index]['emote'] === results[i])
                checkPlay(index);
        }
    }

});
let cooldown = 0;

function checkPlay(index) {
    let sound = userConfig[index];


    if (sound.cooldownEnd < Date.now() / 1000) {
        userConfig[index]['counter']++;
        if (userConfig[index]['timer'] === 0) {
            userConfig[index]['timer'] = userConfig[index]['timeout'];
        }
        if (cooldown) return;
        if (userConfig[index]['counter'] >= userConfig[index]['amount']) {
            userConfig[index]['cooldownEnd'] = (Date.now() / 1000) + sound.cooldown;
            let tmpaudio = new Audio(sound.soundFile);
            tmpaudio.onloadeddata = function () {
                console.log(`adding ${index} to queue after ${tmpaudio.duration}`);

                queue
                    .queue(function () {
                        let audio = new Audio(sound.soundFile);
                        audio.volume = sound.volume * .01;
                        audio.play();
                        if (sound.imageFile.length > 10) {
                            $("#image").css('background-image', 'url(' + sound.imageFile + ')');
                            setTimeout(function () {
                                $("#image").css('background-image', '');
                            }, tmpaudio.duration * 1000);
                        }
                        $(this).delay(tmpaudio.duration * 1000);
                        $(this).dequeue();
                    });


            };
            cooldown = globalCooldown;
        }
    }
}

for (let key in userConfig) {
    emoticons.push(userConfig[key]["emote"].toLowerCase());
    userConfig[key]['counter'] = 0;
    userConfig[key]['cooldownEnd'] = 0;
    userConfig[key]['timer'] = 0;
}

let t = setInterval(function () {
    cooldown--;
    for (let key in userConfig) {
        userConfig[key]['timer'] = Math.max((userConfig[key]['timer'] - 1), 0);
        if (userConfig[key]['timer'] === 0) {
            userConfig[key]['counter'] = 0;
        }
    }
}, 1000);
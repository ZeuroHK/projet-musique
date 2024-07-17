let song = document.getElementById("song");
let ctrlIcon = document.getElementById("ctrlIcon");

function playPause(){
    if(ctrlIcon.classList.contains("fa-pause")){
        song.pause();
        ctrlIcon.classList.remove("fa-pause");
        ctrlIcon.classList.add("fa-play");
        playingNow();
    }
    else{
        song.play();
        ctrlIcon.classList.remove("fa-play");
        ctrlIcon.classList.add("fa-pause");
        playingNow();
    }
}

/* récupère les valeurs des balises auquels on a ajouté des ID, à savoir "song", "progress" et "ctrlIcon".
    "song" pour l'audio qu'on a ajouté
    "progress" pour la barre de durée du son
    "ctrlIcon" pour le bouton play/pause

    function play/pause relié au onclick du bouton play pour agir sur la valeur au clic
    song.onloadedmetadata pour récupérer les données de l'audio (la durée, la position de la musique, le volume etc..)
    la position du point de la barre (progress) = la position de la durée instantanée du son/la durée totale

    on appuie sur le bouton play (sous la valeur fa-play) pour lancer la musique

    si un clic sur l'icone pause est effectué , activation de ctrlIcon.classList.contains("fa-pause") qui remplace le terme fa-play par fa-pause et met donc le son sur pause
    une fois sur pause, si un clic sur l'icone pause (fa-pause du coup), l'effet inverse est produit

    setInterval avec song.currentTime = progress.value; pour que le niveau du point de notre barre et celle de l'audio soit au même stade
    progress.onchange = function() contenant song.currentTime = progress.value; pour que ce soit l'audio qui dépend de la position de la barre et pas l'inverse */



    // maintenant go sélectionner tout les tags ou éléments

const tahdeezer = document.querySelector(".tahdeezer"),
musicImg = tahdeezer.querySelector(".img-son"),
musicName = tahdeezer.querySelector(".song-name .name"),
musicArtist = tahdeezer.querySelector(".song-name .artist"),
musicAudio = tahdeezer.querySelector("#song"),
musicPrev = tahdeezer.querySelector(".controles #prev"),
musicNext = tahdeezer.querySelector(".controles #next"),
musicBar = tahdeezer.querySelector(".progress-bar"),
musicArea = tahdeezer.querySelector(".progress-area"),
musicList = tahdeezer.querySelector(".music-list"),
showMoreMusic = tahdeezer.querySelector("#more-music"),
hideMoreMusic = musicList.querySelector("#close");

// on va faire en sorte qu'a chaque refresh de la page c'est une musique random qui sort
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); // appeler la fonction musique par la fenetre chargée
    playingNow();
})

// fonction musique suivante
function nextMusic(){
    //incrémente musicIndex de 1
    musicIndex++;
    // si musicIndex est supérieur au nbr de musiques que t'as, il retourne au premier son (boucle)
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    song.play();
    ctrlIcon.classList.remove("fa-play");
    ctrlIcon.classList.add("fa-pause");
    playingNow();
}

// fonction musique précédente
function prevMusic(){
    //décrémente musicIndex de 1
    musicIndex--;
    // si musicIndex est inférieur à 1, il revient au dernier son (boucle inversée)
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    song.play();
    ctrlIcon.classList.remove("fa-play");
    ctrlIcon.classList.add("fa-pause");
    playingNow();
}

// charger la fonction musique
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `Images/${allMusic[indexNumb - 1].img}.jpg`;
    musicAudio.src = `Sons/${allMusic[indexNumb - 1].src}.mp3`;
}
//synchronisation musique/barre
musicAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; // prend la durée ou t'es du son
    const duration = e.target.duration; // prend la durée totale du son
    let progressWidth = (currentTime / duration) * 100;
    musicBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = tahdeezer.querySelector(".current"),
    musicDuration = tahdeezer.querySelector(".duration");

    musicAudio.addEventListener("loadeddata", ()=>{
        // met à jour le temps total de la musique
        let audioDuration = musicAudio.duration;
        let totalMin = Math.floor(audioDuration / 60); // minutes
        let totalSec = Math.floor(audioDuration % 60); // secondes
        if(totalSec < 10){ // ajoute 0 si sec est plus petit que 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
        // met à jour le temps de la progression de la musique
        let currentMin = Math.floor(currentTime / 60); // minutes
        let currentSec = Math.floor(currentTime % 60); // secondes
        if(currentSec < 10){ // ajoute 0 si sec est plus petit que 10
            currentSec = `0${currentSec}`;
        }
        musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// évenement musique suivante
musicNext.addEventListener("click", ()=>{
    nextMusic(); // Appelle la fonction de musique suivante
});
// évenement musique précédente
musicPrev.addEventListener("click", ()=>{
    if(musicAudio.currentTime > musicAudio.duration / 10){
        musicAudio.currentTime = 0;
    }
    else{
    prevMusic(); // Appelle la fonction de musique précédente
    }
});

//go accorder la lecture du son avec la hauteur de la barre
musicArea.addEventListener("click", (e)=>{
    let progressWidthval = musicArea.clientWidth; //avoir la hauteur de la barre
    let clickedOffSetX = e.offsetX; // positions relatives valeurs horizontales
    let songDuration = musicAudio.duration; // durée totale du son

    musicAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;

    /* L'expression "(clickedOffSetX / progressWidthval)" calcule la position relative 
    du clic de l'utilisateur sur la barre de progression, représentée comme une valeur entre 0 et 1.
    Cette valeur est ensuite multipliée par la durée totale de la chanson ("songDuration") pour obtenir
    le temps de lecture correspondant à l'endroit où l'utilisateur a cliqué sur la barre de progression.
    En fin de compte, cette ligne de code met à jour le temps de lecture actuel de la musique en fonction 
    de l'emplacement où l'utilisateur a cliqué sur la barre de progression, lui permettant ainsi de sauter 
    directement à un certain moment de la chanson. */

});


// Travaillons sur la répétition et le mélange des chansons en fonction de l'icône
const musicRepeat = tahdeezer.querySelector("#repeat-plist");
musicRepeat.addEventListener("click", ()=>{
    // d'abord on prend le innerText de l'icône (repeat) qu'on va changer en fction du clic
    let getText = musicRepeat.innerText; //prendre l'innerText de l'icône
    // maintenant on ouvre un switch pour changer l'icône an fonction du clic
    switch(getText){
        case "repeat":
            musicRepeat.innerText = "repeat_one"; // cliquer sur repeat le transforme en repeat_one
            musicRepeat.setAttribute("title", "Répéter un");
            break;
        case "repeat_one":
            musicRepeat.innerText = "shuffle"; // cliquer sur repeat_one le transforme en shuffle (aléatoire)
            musicRepeat.setAttribute("title", "Aléatoire");
            break;
        case "shuffle":
            musicRepeat.innerText = "repeat"; // cliquer sur shuffle le retransforme en repeat. ca fait une boucle.
            musicRepeat.setAttribute("title", "Répéter");
            break;
    }
});

//Maintenant qu'on a changé l'icône, on va attribuer une action par icône
// après la fin d'une musique :

musicAudio.addEventListener("ended", ()=>{
    //on va accorder l'action à l'icône pour que la musique tourne en fonction du bouton

    let getText = musicRepeat.innerText;
    switch(getText){
        case "repeat": // avec cette icône, on appelle juste la musique suivante indéfiniment
            nextMusic();
            break;
        case "repeat_one": // avec cette icône, la musique se remet à 0 lorsque celle-ci se finit puis la relance
            musicAudio.currentTime = 0;
            song.play();
            break;
        case "shuffle": // séléctionne un nbr aléatoire pour music index entre 1 et le nbr total de musiques que y'a sur musiqueit.js
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randomIndex); // cette boucle marche jusqu'a que le prochain nbr aléatoire n'est pas le même que le précédent (pour s'assurer de ne pas écouter la même 2 fois d'affilée)
            musicIndex = randomIndex; // attribuer le nbr aléatoire a musicIndex pour le prochain son^
            loadMusic(musicIndex); //refresh le musicIndex
            song.play(); // relance la musique
            playingNow();
            break;
    }
});

showMoreMusic.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
}); // fait apparaître la page de playlist

hideMoreMusic.addEventListener("click", ()=>{
    showMoreMusic.click();
}); // fait disparaître la page de playlist

const ulTag = tahdeezer.querySelector("ul");

// faire une boucle condition pour mettre autant de li que y'a de musiques
for (let i = 0; i < allMusic.length; i++) {
    //go mettre les infos des musiques du tableau dans le li
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio id="song" class="${allMusic[i].src}" src="Sons/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">-:--</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60); // minutes
        let totalSec = Math.floor(audioDuration % 60); // secondes
        if(totalSec < 10){ // ajoute 0 si sec est plus petit que 10
            totalSec = `0${totalSec1}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        // ajout d'un attribut t-duration que nous utiliserons ci-dessous
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });

}

// maintenant le code pour jouer la musique sur laquelle on a cliqué
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // on va s'assurer que tous les li sauf celui en cours de lecture ne soient pas pris en compte 
        // donc on retire tous les "playing" avant d'en rajouter un nouveau
        // le principe est un peu le même qu'avec les fa-play et fa-pause
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            // on récupère la valeur de la durée d'audio et on la convertit en innerText
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; //on convertit la valeur t-duration en innerText et on l'affiche
        }
        // si c'est un li avec son li-index qui est égal à un musicIndex
        // cette musique sera donc sélectionné dans le tableau.
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "En cours";
        }
    
        // on met l'attribut "onclick" a tous les li (tous les noms de musique du tableau en fait)
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// maintenant le code pour jouer la musique sélectionné
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //on attribue le nbr de li-index et on le met dans musicIndex pour jouer la musique correspondante
    loadMusic(musicIndex); // on refresh
    song.play(); // et on peut relancer la lecture
    ctrlIcon.classList.remove("fa-play");
    ctrlIcon.classList.add("fa-pause");
    playingNow();
}

window.onload=pageLoad;
function pageLoad(){
    var teams = document.getElementsByClassName('team');
    for (var i = 0; i < teams.length; i++) {
        teams[i].addEventListener('click', play);
    }
}
function play() { 
    var audio = document.getElementById("click_sound"); 
    if (audio.paused) { 
        audio.play(); 
    }else{ 
        audio.pause(); 
        audio.currentTime = 0 
    } 
} 
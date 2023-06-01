//Intro
var introLabel1;
var introLabel2;
var introDuration1;
var introDuration2;
var totalDuration;
var startBgm = new Audio("src/startbgm1.mp3");
startBgm.volume -= 0.5;
var bgm2 = new Audio("src/startbgm2.mp3");

introLabel1 = $("#gameIntro1").find($("label"));
introLabel2 = $("#gameIntro2").find($("label"));
introDuration1 = animateLabels(introLabel1, 0);

setTimeout(function () {
  $("#gameIntro1").hide();
}, introDuration1);
introDuration2 = animateLabels(introLabel2, introDuration1);
totalDuration = introDuration1 + introDuration2 - 2000;

setTimeout(function () {
  $(".gameIntroScreen").hide();
  displayHomeScreen();
  startBgm.play();
  startBgm.loop = true;
}, totalDuration);

//시작화면
var hue_value = 0;
var hit = new Audio("src/click2.mp3");
var bunt = new Audio("src/click1.mp3");
var clickSound1 = new Audio("src/click1.mp3");
var brickBreak = new Audio("src/brickBreak.mp3");
var over = new Audio("src/gameover.wav");
var clearSound = new Audio("src/clear.mp3");
var victorySound = new Audio("src/victoryAudio.mp3");
var teamType = 1;
var rankedGameScore = 0;
var lifeCount = 3;
var playerName = "익명의 플레이어";

var difficulty = 0; // easy:0, normal:1, hard:2
var isRanked = false;

//이지 모드 스토리
var keyboardSound = new Audio("src/keyboard1.mp3");
var contents = [
  "남들보다 뒤늦게 시작한 야구...\n더 높은곳으로 가고 싶다...\n\n지금은 독립리그 결승전\n9회말 2아웃 만루\n나는 타석에 올라간다...\n\n나의 안타 한번에\n팀의 승리가 걸려있다...",
  "한국 시리즈 결승전에서\n막강한 적을 만났다.\n상대는 ACE투수 이율원...\n\n수만명의 관객들이 나를 응원하고 있다...\n\n9회말 2아웃\n나는 타석에 올라간다...\n그를 꺾고 우승을 차지하겠다...",
  "WBC 결승전\n영원의 라이벌, 운명의 상대\n일본을 만났다.\n\n상대 투수는 일본 최고의 선수\n율타니 쇼헤이...\n\n9회말 2아웃\n나는 타석에 올라간다...\n대한민국의 명예를 위해\n그를 꺾고 우승을 차지하겠다...",
];

var i = 0;
var typingInterval;

var canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function animateLabels(inputs, initialDelay) {
  var totalDuration = initialDelay;
  for (var i = 0; i < inputs.length; i++) {
    var index = i + 1;
    var time = (inputs.length - i) * 50;
    totalDuration += time;
    $(inputs[i]).css(
      "-animation",
      "anim 3s " + (initialDelay + time) + "ms ease-in-out"
    );
  }
  setTimeout(function () {
    $("#introAudio")[0].play();
  }, initialDelay + time);

  return totalDuration;
}

function displayHomeScreen() {
  console.log("Displaying Homescreen...");
  $("#homeScreen").fadeIn();
  $("#gameStatus").hide();
  $("#skillStatusPage").hide();

  //시작화면
  $("#settingsButton").click(() => {
    $("#settingModal").fadeIn();
    $("#nameInput").val(playerName);
    const updateBallColor = () => {
      ballColor = `hsl(${hue_value}, 100%, 50%)`;
      $("#setting_color").css("filter", `hue-rotate(${hue_value}deg)`);
    };
    updateBallColor();
    $("#hueRange").on("input", (e) => {
      hue_value = $("#hueRange").val();
      updateBallColor();
    });

    $("#exitSettings").click(function () {
      if ($('input[name="rad"]:checked').val() == "b1") {
        bgm2.pause();
        startBgm.play();
        startBgm.loop = true;
      } else if ($('input[name="rad"]:checked').val() == "b2") {
        startBgm.pause();
        bgm2.play();
        bgm2.loop = true;
      } else {
        startBgm.pause();
        bgm2.pause();
      }
      playerName = $("#nameInput").val();
      $("#settingModal").fadeOut();
    });
  });

  $("#startGameButton").click(function () {
    $("#homeScreen").hide();
    $("#gameTypeSelectingScreen").show();
    $("#gameSelectingScreen").fadeIn();
  });
}

$("#selectStoryGameButton").click(function () {
  $("#gameTypeSelectingScreen").hide();
  $("#teamSelectingScreen").fadeIn();
  clickSound1.play();
});

const teamSelection = () => {
  $("#teamSelectingScreen").hide();
  $("#difficultyChoosingScreen").fadeIn();
  clickSound1.play();
};

$("#selectTeam1").click(() => {
  teamType = 1;
  teamSelection();
});

$("#selectTeam2").click(() => {
  teamType = 2;
  teamSelection();
});

$("#selectTeam3").click(() => {
  teamType = 3;
  teamSelection();
});

$("#selectTeam4").click(() => {
  teamType = 4;
  teamSelection();
});

const difficultySelection = () => {
  $("#difficultyChoosingScreen").hide();
  $("#story").fadeIn();
  typingInterval = setInterval(typing, 100);
  isRanked = false;
};

$("#selectEasyDifficulty").click(() => {
  difficulty = 0;
  difficultySelection();
});

$("#selectNormalDifficulty").click(() => {
  difficulty = 1;
  difficultySelection();
});

$("#selectHardDifficulty").click(() => {
  difficulty = 2;
  difficultySelection();
});

function typing() {
  const text = $(".text");
  keyboardSound.play();
  keyboardSound.loop = true;
  let txt = contents[difficulty][i++];
  if (txt === "\n") {
    text.html(text.html() + "<br/>");
  } else {
    text.html(text.html() + txt);
  }
  if (i >= contents[difficulty].length) {
    clearInterval(typingInterval);
    keyboardSound.pause();
  }
}

$("#nextBtn").click(function () {
  i = 0;
  clearInterval(typingInterval);
  keyboardSound.pause();
  $("#story").hide();
  $(".text").html("");

  play(difficulty);
});

$("#selectRankedGameButton").click(function () {
  $("#gameTypeSelectingScreen").hide();
  $("#gameCanvas").show();
  $("#beforePlayingRankedGamePage").css("display", "flex");
});

$("#playRankedGameButton").click(function () {
  $("#beforePlayingRankedGamePage").hide();
  isRanked = true;
  play();
});

$("#restartRankedgameButton").on("click", function () {
  console.log("Restarting Ranked Game...");
  $("#rankedGameEndingPage").hide();
  clearCanvas();
  lifeCount = 3;
  rankedGameScore = 0;
  play();
});

$("#backToHomeButton").click(function () {
  console.log("Back To Home...");
  $("#rankedGameEndingPage").hide();
  $("#gameCanvas").hide();
  startBgm.play();
  displayHomeScreen();
  isRanked = false;
});

$("#backToHomeButton_story").click(function () {
  lifeCount = 3;
  console.log("Back To Home...");
  $("#StroyGameOverPage").hide();
  $("#gameCanvas").hide();
  displayHomeScreen();
});

$("#restartStorygameButton").on("click", function () {
  console.log("Restarting Story Game...");
  $("#StroyGameOverPage").hide();
  lifeCount = 3;
  skillsLeft = 5;
  brickCnt = brickRowCount * brickColumnCount;
  play(difficulty);
});

$("#clearModalCloseButton").click(function () {
  console.log("Back To Home...");
  removeKeyHandler();
  $("#StoryClearPage").hide();
  $("#gameCanvas").hide();
  victorySound.pause();
  startBgm.play();
  displayHomeScreen();
});

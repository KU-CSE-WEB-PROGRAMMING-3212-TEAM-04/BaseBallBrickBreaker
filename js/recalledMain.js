//인트로
var introDuration1;
var introLabel2;
var introDuration1;
var introDuration2;
var totalDuration;

//시작화면
var hue_value = 0;
var startBgm = new Audio("src/startbgm1.mp3");
startBgm.volume -= 0.5;
var bgm2 = new Audio("src/startbgm2.mp3");
var hit = new Audio("src/click2.mp3");
var bunt = new Audio("src/click1.mp3");
var clickSound1 = new Audio("src/click1.mp3");
var brickBreak = new Audio("src/brickBreak.mp3");
var over = new Audio("src/gameover.wav");
var clearSound = new Audio("src/clear.mp3");
var victorySound = new Audio("src/victoryAudio.mp3");
var teamType = -1;
var rankedGameScore = 0;
var lifeCount = 3;
var playerName = "익명의 플레이어";

var difficulty = -1; // easy:0, normal:1, hard:2

//이지 모드 스토리
var keyboardSound = new Audio("src/keyboard1.mp3");
var content1 = "남들보다 뒤늦게 시작한 야구...\n";
content1 += "더 높은곳으로 가고 싶다...\n\n";
content1 += "지금은 독립리그 결승전\n";
content1 += "9회말 2아웃 만루\n";
content1 += "나는 타석에 올라간다...\n\n";
content1 += "나의 안타 한번에\n";
content1 += "팀의 승리가 걸려있다...";

//노말 모드 스토리
var content2 = "한국 시리즈 결승전에서\n";
content2 += "막강한 적을 만났다.\n";
content2 += "상대는 ACE투수 이율원...\n\n";
content2 += "수만명의 관객들의 나를 응원하고 있다...\n\n";
content2 += "9회말 2아웃\n";
content2 += "나는 타석에 올라간다...\n";
content2 += "그를 꺾고 우승을 차지하겠다...";

//하드 모드 스토리
var content3 = "WBC 결승전\n";
content3 += "영원의 라이벌, 운명의 상대\n";
content3 += "일본을 만났다.\n\n";
content3 += "상대 투수는 일본 최고의 선수\n";
content3 += "율타니 쇼헤이...\n\n";
content3 += "9회말 2아웃\n";
content3 += "나는 타석에 올라간다...\n";
content3 += "대한민국의 명예를 위해\n";
content3 += "그를 꺾고 우승을 차지하겠다...";
var content;
var storyPage;
var i = 0;
var typingInterval;

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM0rW9kzS-RyTSimfSUkB_65Tryb6PwR4",
  authDomain: "break-out-web.firebaseapp.com",
  projectId: "break-out-web",
  storageBucket: "break-out-web.appspot.com",
  messagingSenderId: "258505534376",
  appId: "1:258505534376:web:a7afb4f9ed674aa4c44b9d",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore and get a reference to the service
const db = firebase.firestore();

var rankingRef = db.collection("ranking");

var canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
$("#gameStatus").hide();

//인트로
introDuration1 = $("#gameIntro1").find($("label"));
introLabel2 = $("#gameIntro2").find($("label"));
introDuration1 = animateLabels(introDuration1, 0);
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

$("#selectTeam1").click(function () {
  teamType = 1;
  $("#teamSelectingScreen").hide();
  $("#difficultyChoosingScreen").fadeIn();
  clickSound1.play();
});

$("#selectTeam2").click(function () {
  teamType = 2;
  $("#teamSelectingScreen").hide();
  $("#difficultyChoosingScreen").fadeIn();
  clickSound1.play();
});

$("#selectTeam3").click(function () {
  teamType = 3;
  $("#teamSelectingScreen").hide();
  $("#difficultyChoosingScreen").fadeIn();
  clickSound1.play();
});

$("#selectTeam4").click(function () {
  teamType = 4;
  $("#teamSelectingScreen").hide();
  $("#difficultyChoosingScreen").fadeIn();
  clickSound1.play();
});

$("#selectEasyDifficulty").click(function () {
  console.log("Storygame Difficulty: Easy");
  $("#difficultyChoosingScreen").hide();
  $("#story").fadeIn();
  storyPage = 1;
  typingInterval = setInterval(typing, 100);
});

$("#selectNormalDifficulty").click(function () {
  console.log("Storygame Difficulty: Normal");
  $("#difficultyChoosingScreen").hide();
  $("#story").fadeIn();
  storyPage = 2;
  typingInterval = setInterval(typing, 100);
});

$("#selectHardDifficulty").click(function () {
  console.log("Storygame Difficulty: Hard");
  $("#difficultyChoosingScreen").hide();
  $("#story").fadeIn();
  storyPage = 3;
  typingInterval = setInterval(typing, 100);
});

function typing() {
  const text = $(".text");
  if (storyPage == 1) content = content1;
  else if (storyPage == 2) content = content2;
  else if (storyPage == 3) content = content3;
  keyboardSound.play();
  keyboardSound.loop = true;
  let txt = content[i++];
  if (txt === "\n") {
    text.html(text.html() + "<br/>");
  } else {
    text.html(text.html() + txt);
  }
  if (i >= content.length) {
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

  difficulty = storyPage - 1;
  if (difficulty == 0) {
    playEasyMode();
  } else if (difficulty == 1) {
    playNormalMode();
  } else if (difficulty == 2) {
    playHardMode();
  } else {
    console.log("Problem with #nextBtn");
  }
});

function playEasyMode() {
  console.log("Play Easy Mode");

  clearCanvas();
  $("#gameCanvas").show();
  $("#gameStatus").show();
  $("#livesLeft").text(lifeCount);
  $("#liveScore").text("");

  var skillsLeft = 5;

  $("#skillImg").attr("src", "src/skill" + teamType + ".png");
  $("#skillStatusPage").show();
  $("#skillsLeft").text(skillsLeft);

  //variables about the paddle
  var paddleWidth = 134;
  var paddleHeight = 18;
  const paddleSpeed = 7;
  const paddleMaxAngle = 105; // 최대 회전 각도 (방망이 휘두르는 각도)
  let paddleX = (canvas.width - paddleWidth) / 2;
  let paddleY = canvas.height - paddleHeight - 45;
  let paddleAngle = -25; // 현재 방망이 회전 각도
  const paddleImage = new Image();
  paddleImage.src = "src/batWithHands.png";

  //타자
  const hitterImage = new Image();
  hitterImage.src = "src/hitter" + teamType + ".png";
  const hitterWidth = 80;
  const hitterHeight = 120;
  let hitterX = paddleX - 70;
  let hitterY = paddleY - 65;

  const ballImage = new Image();
  ballImage.src = "src/ball.png";

  const backgroundImage = new Image();
  backgroundImage.src = "src/ground.jpg";

  let ballRotationAngle = 0;
  var ballRadius = 8;
  let ballX = canvas.width / 2;
  let ballY = paddleY - ballRadius;
  // 난이도 따라 수정
  let ballDX = 4;
  let ballDY = -4;
  const ballSpeed = 4;
  let ballSpeedY = 4;

  // variables about the brick
  const brickRowCount = 4; // number of rows of bricks
  const brickColumnCount = 6; // number of rows of bricks
  let brickCnt = brickRowCount * brickColumnCount;
  const brickWidth = 60;
  const brickHeight = 30;
  const brickPadding = 30; // spacing between bricks
  const brickOffsetTop = 30;
  const brickOffsetLeft = 150;

  var bricks = new Array(brickRowCount);
  for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = new Array(brickColumnCount);
    for (let j = 0; j < brickColumnCount; j++) {
      var randomStatusValue = Math.floor(Math.random() * (difficulty + 1) + 1);
      bricks[i][j] = { x: 0, y: 0, status: randomStatusValue };
    }
  }

  // 키보드 이벤트 처리를 위한 변수 선언
  let rightPressed = false;
  let leftPressed = false;
  let spacePressed = false;
  let resetPaddleAngle = false; // 'e' 키를 누르는 동안 패들 각도를 0으로 초기화하기 위한 변수

  function handleSkill() {
    $("#skillAlertPage").show();
    if (skillsLeft > 0) {
      if (teamType === 1) {
        // remove ramdom row
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");
        var randomRowIndex = Math.floor(Math.random() * brickRowCount + 1);
        for (let j = 0; j < brickColumnCount; j++) {
          const b = bricks[randomRowIndex][j];
          skill4SoundEffect.play();
          if (b.status > 0) {
            b.status--;
            if (b.status === 0) {
              brickCnt--;
            }
          }
        }
        $("#skillAlert").text("Attacked Random Row!!");
        setTimeout(hideSkillAlert, 2000);
      } else if (teamType === 2) {
        // make bat bigger
        $("#skillAlert").text("The Bat Got Bigger!!");
        setTimeout(hideSkillAlert, 2000);
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");
        skill4SoundEffect.play();
        paddleWidth += 50;
        paddleHeight += 25;
        setTimeout(skill2_backToNormal, 8000);
      } else if (teamType === 3) {
        // make ball bigger
        $("#skillAlert").text("The Ball Got Bigger!!");
        setTimeout(hideSkillAlert, 2000);
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");
        skill4SoundEffect.play();
        ballRadius += 10;
        setTimeout(skill3_backToNormal, 6000);
      } else if (teamType === 4) {
        // remove random column
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");

        var randomColumnIndex = Math.floor(
          Math.random() * brickColumnCount + 1
        );
        for (let j = 0; j < brickRowCount; j++) {
          const b = bricks[j][randomColumnIndex];
          skill4SoundEffect.play();
          if (b.status > 0) {
            b.status--;
            if (b.status === 0) {
              brickCnt--;
            }
          }
        }
        $("#skillAlert").text("Attacked Random Column!!");
        setTimeout(hideSkillAlert, 3000);
      } else {
        console.log("teamType not defined - handleSkill() Error");
      }
      skillsLeft--;
      $("#skillsLeft").text(skillsLeft);
      console.log("skill is used");
    } else {
      console.log("Out of skills");
    }
  }

  function skill2_backToNormal() {
    paddleWidth -= 50;
    paddleHeight -= 25;
  }

  function skill3_backToNormal() {
    ballRadius -= 10;
  }

  function hideSkillAlert() {
    $("#skillAlert").text("");
    $("#skillAlertPage").hide();
  }

  // 키보드 이벤트 리스너 추가
  $(document).keydown(keyDownHandler);
  $(document).keyup(keyUpHandler);

  // 키보드 이벤트 처리 함수
  function keyDownHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
      rightPressed = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
      leftPressed = true;
    } else if (event.key === " ") {
      spacePressed = true;
    } else if (event.key === "e") {
      resetPaddleAngle = true; // 'e' 키를 누르면 패들 각도 초기화 플래그를 true로 설정
    }
  }

  function keyUpHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
      rightPressed = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
      leftPressed = false;
    } else if (event.key === " ") {
      spacePressed = false;
    } else if (event.key === "e") {
      resetPaddleAngle = false; // 'e' 키를 뗐을 때 패들 각도 초기화 플래그를 false로 설정
    } else if (event.key === "r") {
      handleSkill();
    } else if (event.key === "Escape") {
      brickCnt = 0;
    } else if (event.key === "m") {
      lifeCount = 1;
    }
  }

  function drawBall() {
    ctx.save();
    ctx.translate(ballX, ballY);
    ctx.rotate((Math.PI / 180) * ballRotationAngle); // 회전 각도 적용
    ctx.filter = `hue-rotate(${hue_value}deg)`;
    ctx.drawImage(
      ballImage,
      -ballRadius,
      -ballRadius,
      ballRadius * 2,
      ballRadius * 2
    );
    ctx.restore();
  }

  function drawPaddle() {
    ctx.save();
    ctx.translate(paddleX, paddleY);
    ctx.rotate((-Math.PI / 180) * paddleAngle); // 각도를 라디안으로 변환하여 회전
    ctx.drawImage(paddleImage, 0, 0, paddleWidth, paddleHeight);
    ctx.restore();
  }

  function drawHitter() {
    ctx.save();
    ctx.translate(hitterX, hitterY);
    ctx.drawImage(hitterImage, 0, 0, hitterWidth, hitterHeight);
    ctx.restore();
  }

  // 공 이미지 회전 함수
  function rotateBallImage() {
    ballRotationAngle += 15; // 회전 속도 조절
    if (ballRotationAngle >= 360) {
      ballRotationAngle = 0;
    }
  }

  function drawBricks() {
    var fillColors = ["#000", "#D5FFD5", "#8FBC8B", "#53682A"];

    for (let r = 0; r < brickRowCount; r++) {
      for (let c = 0; c < brickColumnCount; c++) {
        if (bricks[r][c].status > 0) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[r][c].x = brickX;
          bricks[r][c].y = brickY;

          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = fillColors[bricks[r][c].status];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    for (let i = 0; i < brickRowCount; i++) {
      for (let j = 0; j < brickColumnCount; j++) {
        const b = bricks[i][j];
        if (b.status > 0) {
          const brickX = b.x;
          const brickY = b.y;
          if (
            ballX + ballRadius > brickX &&
            ballX - ballRadius < brickX + brickWidth &&
            ballY + ballRadius > brickY &&
            ballY - ballRadius < brickY + brickHeight
          ) {
            const brickLeft = brickX;
            const brickRight = brickX + brickWidth;
            const brickTop = brickY;
            const brickBottom = brickY + brickHeight;

            if (
              ballX + ballRadius > brickRight ||
              ballX - ballRadius < brickLeft
            ) {
              // Collision is on the side of the brick
              ballDX = -ballDX; // Reverse the ball's horizontal direction
            } else if (
              ballY + ballRadius > brickTop &&
              ballY - ballRadius < brickBottom
            ) {
              // Collision is on the top or bottom of the brick
              ballDY = -ballDY; // Reverse the ball's vertical direction
            }

            b.status--;
            if (b.status === 0) {
              brickCnt--;
            }
            brickBreak.play();
          }
        }
      }
    }
  }

  function removeKeyUpHandler() {
    $(document).off("keyup", keyUpHandler);
  }

  function gameOver() {
    if (lifeCount === 0) {
      console.log("Died While Playing Easy Mode");
      removeKeyUpHandler();
      console.log("Removed KeyUp Handler");
      over.play();
      endStoryMode();
      return true;
    }
    return false;
  }

  // Function to reset the ball and paddle positions
  function resetPositions() {
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight - 45;
    hitterX = paddleX - 70;
    hitterY = paddleY - 65;
    ballX = canvas.width / 2;
    ballY = paddleY - ballRadius;
    // 난이도 따라 수정
    ballDX = 4;
    ballDY = -ballDX;
  }

  // Game over and reset function
  function handleGameOver() {
    resetPositions();
    lifeCount--;
    $("#livesLeft").text(lifeCount);
    console.log("Lives: " + lifeCount);
    if (!gameOver()) {
      setTimeout(function () {
        draw();
      }, 1000);
    }
  }

  // 게임 루프
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawHitter();
    drawBall();
    rotateBallImage();
    drawBricks();
    collisionDetection();

    // 패들 이동
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += paddleSpeed;
      hitterX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= paddleSpeed;
      hitterX -= paddleSpeed;
    }

    // 방망이 휘두르는 모션
    if (spacePressed) {
      paddleAngle = Math.min(paddleAngle + 15, paddleMaxAngle); // 최대 각도까지 회전
    } else if (resetPaddleAngle) {
      paddleAngle = 0; // 'e' 키를 누르는 동안 패들 각도를 0으로 초기화
    } else {
      paddleAngle = -25; // 스페이스바를 뗐을 때 각도 초기화
    }

    // 공 위치 업데이트
    ballX += ballDX;
    ballY += ballDY;

    // 벽과 충돌 감지
    if (ballX + ballRadius > canvas.width - 1 || ballX - ballRadius < 1) {
      ballDX = -ballDX; // x 방향 반대로 변경하여 튕김
    }
    if (ballY - ballRadius < 0) {
      ballDY = -ballDY; // y 방향 반대로 변경하여 튕김
    }

    // ground collision detection
    if (ballY > canvas.height) {
      console.log("Ball touched the ground");
      handleGameOver();
      return;
    }

    // 패들과 충돌 감지
    if (
      (spacePressed || resetPaddleAngle) &&
      ballY + ballRadius > paddleY && // 공이 패들의 y 좌표 범위에 있을 때
      ballX > paddleX &&
      ballX < paddleX + paddleWidth // 공이 패들의 x 좌표 범위에 있을 때
    ) {
      // 패들과 충돌 판정을 위한 충돌 박스 계산
      const paddleCenterX = paddleX + paddleWidth / 2;
      const paddleTopY = paddleY;
      const paddleBox = {
        x: paddleCenterX - paddleWidth / 2,
        y: paddleTopY,
        width: paddleWidth,
        height: paddleHeight,
      };

      // 공과 충돌 판정을 위한 충돌 박스 계산
      const ballBox = {
        x: ballX - ballRadius,
        y: ballY - ballRadius,
        width: ballRadius * 2,
        height: ballRadius * 2,
      };

      // 충돌 판정
      if (checkCollision(paddleBox, ballBox)) {
        if (resetPaddleAngle) {
          // 'e' 키가 눌려 있는 경우

          ballDX = Math.random() * 2 - 1; // 가로 속도를 -1~1중 램덤으로 설정
          bunt.play();
        } else {
          // 충돌 시 패들과의 상대적인 충돌 위치 계산
          const collisionPoint = ballX - (paddleX + paddleWidth / 2);

          // 상대적인 충돌 위치에 따라 공의 속도와 방향을 조절
          const maxBounceAngle = (paddleMaxAngle * Math.PI) / 180;
          const bounceAngle =
            (collisionPoint / (paddleWidth / 2)) * maxBounceAngle;
          ballDX = ballSpeed * Math.sin(bounceAngle);
          hit.play();
        }
        ballDY = -ballSpeedY; // 수직 방향은 항상 위쪽으로 설정
      }
    }

    if (brickCnt > 0) {
      requestAnimationFrame(draw);
    } else if (brickCnt == 0) {
      storyPage = difficulty + 2;
      $("#gameCanvas").hide();
      $("#gameStatus").hide();
      $("#skillStatusPage").hide();
      $("#skillAlertPage").hide();
      $("#story").fadeIn();
      clearInterval(typingInterval);
      typingInterval = setInterval(typing, 100);
    } else {
      console.log("Story Game Error");
    }
  }

  draw(); // loop the game

  function endStoryMode() {
    // died while playing story mode
    removeKeyUpHandler();
    clearCanvas();
    lifeCount=3;
    $("#gameStatus").hide();
    $("#skillStatusPage").hide();
    $("#StroyGameOverPage").fadeIn();
  }

  $("#backToHomeButton_story").click(function () {
    console.log("Back To Home...");
    lifeCount == 3;
    $("#StroyGameOverPage").hide();
    $("#gameCanvas").hide();
    displayHomeScreen();
  });

  $("#restartStorygameButton").on("click", function () {
    console.log("Restarting Story Game...");
    $("#StroyGameOverPage").hide();
    lifeCount = 3;
    brickCnt = brickRowCount * brickColumnCount;
    playEasyMode();
  });

  $("#clearModalCloseButton").click(function () {
    console.log("Back To Home...");
    removeKeyUpHandler();
    $("#StoryClearPage").hide();
    $("#gameCanvas").hide();
    victorySound.pause();
    startBgm.play();
    displayHomeScreen();
  });
}

function playNormalMode() {
  console.log("Play Normal Mode");

  clearCanvas();
  $("#gameCanvas").show();
  $("#gameStatus").show();
  $("#livesLeft").text(lifeCount);
  $("#liveScore").text("");

  var skillsLeft = 5;

  $("#skillImg").attr("src", "src/skill" + teamType + ".png");
  $("#skillStatusPage").show();
  $("#skillsLeft").text(skillsLeft);

  //variables about the paddle
  var paddleWidth = 134;
  var paddleHeight = 18;
  const paddleSpeed = 7;
  const paddleMaxAngle = 105; // 최대 회전 각도 (방망이 휘두르는 각도)
  let paddleX = (canvas.width - paddleWidth) / 2;
  let paddleY = canvas.height - paddleHeight - 45;
  let paddleAngle = -25; // 현재 방망이 회전 각도
  const paddleImage = new Image();
  paddleImage.src = "src/batWithHands.png";

  //타자
  const hitterImage = new Image();
  hitterImage.src = "src/hitter" + teamType + ".png";
  const hitterWidth = 80;
  const hitterHeight = 120;
  let hitterX = paddleX - 70;
  let hitterY = paddleY - 65;

  const ballImage = new Image();
  ballImage.src = "src/ball.png";

  const backgroundImage = new Image();
  backgroundImage.src = "src/ground.jpg";

  let ballRotationAngle = 0;
  var ballRadius = 8;
  let ballX = canvas.width / 2;
  let ballY = paddleY - ballRadius;
  // 난이도 따라 수정
  let ballDX = 4;
  let ballDY = -ballDX;
  const ballSpeed = 4;
  let ballSpeedY = 4;

  // variables about the brick
  const brickRowCount = 4; // number of rows of bricks
  const brickColumnCount = 6; // number of rows of bricks
  let brickCnt = brickRowCount * brickColumnCount;
  const brickWidth = 60;
  const brickHeight = 30;
  const brickPadding = 30; // spacing between bricks
  const brickOffsetTop = 30;
  const brickOffsetLeft = 150;

  var bricks = new Array(brickRowCount);
  for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = new Array(brickColumnCount);
    for (let j = 0; j < brickColumnCount; j++) {
      var randomStatusValue = Math.floor(Math.random() * (difficulty + 1) + 1);
      bricks[i][j] = { x: 0, y: 0, status: randomStatusValue };
    }
  }

  // 키보드 이벤트 처리를 위한 변수 선언
  let rightPressed = false;
  let leftPressed = false;
  let spacePressed = false;
  let resetPaddleAngle = false; // 'e' 키를 누르는 동안 패들 각도를 0으로 초기화하기 위한 변수

  function handleSkill() {
    $("#skillAlertPage").show();
    if (skillsLeft > 0) {
      if (teamType === 1) {
        // remove ramdom row
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");

        var randomRowIndex = Math.floor(Math.random() * brickRowCount + 1);
        for (let j = 0; j < brickColumnCount; j++) {
          const b = bricks[randomRowIndex][j];
          skill4SoundEffect.play();
          if (b.status > 0) {
            b.status--;
            if (b.status === 0) {
              brickCnt--;
            }
          }
        }
        $("#skillAlert").text("Attacked Random Row!!");
        setTimeout(hideSkillAlert, 2000);
      } else if (teamType === 2) {
        // make bat bigger
        $("#skillAlert").text("The Bat Got Bigger!!");
        setTimeout(hideSkillAlert, 2000);
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");
        skill4SoundEffect.play();
        paddleWidth += 50;
        paddleHeight += 25;
        setTimeout(skill2_backToNormal, 8000);
      } else if (teamType === 3) {
        // make ball bigger
        $("#skillAlert").text("The Ball Got Bigger!!");
        setTimeout(hideSkillAlert, 2000);
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");
        skill4SoundEffect.play();
        ballRadius += 10;
        setTimeout(skill3_backToNormal, 6000);
      } else if (teamType === 4) {
        // remove random column
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");

        var randomColumnIndex = Math.floor(
          Math.random() * brickColumnCount + 1
        );
        for (let j = 0; j < brickRowCount; j++) {
          const b = bricks[j][randomColumnIndex];
          skill4SoundEffect.play();
          if (b.status > 0) {
            b.status--;
            if (b.status === 0) {
              brickCnt--;
            }
          }
        }
        $("#skillAlert").text("Attacked Random Column!!");
        setTimeout(hideSkillAlert, 3000);
      } else {
        console.log("teamType not defined - handleSkill() Error");
      }
      skillsLeft--;
      $("#skillsLeft").text(skillsLeft);
      console.log("skill is used");
    } else {
      console.log("Out of skills");
    }
  }

  function skill2_backToNormal() {
    paddleWidth -= 50;
    paddleHeight -= 25;
  }

  function skill3_backToNormal() {
    ballRadius -= 10;
  }

  function hideSkillAlert() {
    $("#skillAlert").text("");
    $("#skillAlertPage").hide();
  }

  // 키보드 이벤트 리스너 추가
  $(document).keydown(keyDownHandler);
  $(document).keyup(keyUpHandler);

  // 키보드 이벤트 처리 함수
  function keyDownHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
      rightPressed = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
      leftPressed = true;
    } else if (event.key === " ") {
      spacePressed = true;
    } else if (event.key === "e") {
      resetPaddleAngle = true; // 'e' 키를 누르면 패들 각도 초기화 플래그를 true로 설정
    }
  }

  function keyUpHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
      rightPressed = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
      leftPressed = false;
    } else if (event.key === " ") {
      spacePressed = false;
    } else if (event.key === "e") {
      resetPaddleAngle = false; // 'e' 키를 뗐을 때 패들 각도 초기화 플래그를 false로 설정
    } else if (event.key === "r") {
      handleSkill();
    } else if (event.key === "Escape") {
      brickCnt = 0;
    } else if (event.key === "m") {
      lifeCount = 1;
    }
  }

  function drawBall() {
    ctx.save();
    ctx.translate(ballX, ballY);
    ctx.rotate((Math.PI / 180) * ballRotationAngle); // 회전 각도 적용
    ctx.filter = `hue-rotate(${hue_value}deg)`;
    ctx.drawImage(
      ballImage,
      -ballRadius,
      -ballRadius,
      ballRadius * 2,
      ballRadius * 2
    );
    ctx.restore();
  }

  function drawPaddle() {
    ctx.save();
    ctx.translate(paddleX, paddleY);
    ctx.rotate((-Math.PI / 180) * paddleAngle); // 각도를 라디안으로 변환하여 회전
    ctx.drawImage(paddleImage, 0, 0, paddleWidth, paddleHeight);
    ctx.restore();
  }

  function drawHitter() {
    ctx.save();
    ctx.translate(hitterX, hitterY);
    ctx.drawImage(hitterImage, 0, 0, hitterWidth, hitterHeight);
    ctx.restore();
  }

  // 공 이미지 회전 함수
  function rotateBallImage() {
    ballRotationAngle += 15; // 회전 속도 조절
    if (ballRotationAngle >= 360) {
      ballRotationAngle = 0;
    }
  }

  function drawBricks() {
    var fillColors = ["#000", "#D5FFD5", "#8FBC8B", "#53682A"];

    for (let r = 0; r < brickRowCount; r++) {
      for (let c = 0; c < brickColumnCount; c++) {
        if (bricks[r][c].status > 0) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[r][c].x = brickX;
          bricks[r][c].y = brickY;

          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = fillColors[bricks[r][c].status];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    for (let i = 0; i < brickRowCount; i++) {
      for (let j = 0; j < brickColumnCount; j++) {
        const b = bricks[i][j];
        if (b.status > 0) {
          const brickX = b.x;
          const brickY = b.y;
          if (
            ballX + ballRadius > brickX &&
            ballX - ballRadius < brickX + brickWidth &&
            ballY + ballRadius > brickY &&
            ballY - ballRadius < brickY + brickHeight
          ) {
            const brickLeft = brickX;
            const brickRight = brickX + brickWidth;
            const brickTop = brickY;
            const brickBottom = brickY + brickHeight;

            if (
              ballX + ballRadius > brickRight ||
              ballX - ballRadius < brickLeft
            ) {
              // Collision is on the side of the brick
              ballDX = -ballDX; // Reverse the ball's horizontal direction
            } else if (
              ballY + ballRadius > brickTop &&
              ballY - ballRadius < brickBottom
            ) {
              // Collision is on the top or bottom of the brick
              ballDY = -ballDY; // Reverse the ball's vertical direction
            }

            b.status--;
            if (b.status === 0) {
              brickCnt--;
            }
            brickBreak.play();
          }
        }
      }
    }
  }

  function removeKeyUpHandler() {
    $(document).off("keyup", keyUpHandler);
  }

  function gameOver() {
    if (lifeCount === 0) {
      console.log("Died While Playing Normal Mode");
      removeKeyUpHandler();
      console.log("Removed KeyUp Handler");
      over.play();
      endStoryMode();
      return true;
    }
    return false;
  }

  // Function to reset the ball and paddle positions
  function resetPositions() {
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight - 45;
    hitterX = paddleX - 70;
    hitterY = paddleY - 65;
    ballX = canvas.width / 2;
    ballY = paddleY - ballRadius;
    // 난이도 따라 수정
    ballDX = 4 + difficulty;
    ballDY = -ballDX;
  }

  // Game over and reset function
  function handleGameOver() {
    resetPositions();
    if (lifeCount > -1) {
      lifeCount--;
      $("#livesLeft").text(lifeCount);
      console.log("Lives: " + lifeCount);
    } else {
      console.log("lifeCount is less than -1");
    }
    if (!gameOver()) {
      setTimeout(function () {
        draw();
      }, 1000);
    }
  }

  // 게임 루프
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawHitter();
    drawBall();
    rotateBallImage();
    drawBricks();
    collisionDetection();

    // 패들 이동
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += paddleSpeed;
      hitterX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= paddleSpeed;
      hitterX -= paddleSpeed;
    }

    // 방망이 휘두르는 모션
    if (spacePressed) {
      paddleAngle = Math.min(paddleAngle + 15, paddleMaxAngle); // 최대 각도까지 회전
    } else if (resetPaddleAngle) {
      paddleAngle = 0; // 'e' 키를 누르는 동안 패들 각도를 0으로 초기화
    } else {
      paddleAngle = -25; // 스페이스바를 뗐을 때 각도 초기화
    }

    // 공 위치 업데이트
    ballX += ballDX;
    ballY += ballDY;

    // 벽과 충돌 감지
    if (ballX + ballRadius > canvas.width - 1 || ballX - ballRadius < 1) {
      ballDX = -ballDX; // x 방향 반대로 변경하여 튕김
    }
    if (ballY - ballRadius < 0) {
      ballDY = -ballDY; // y 방향 반대로 변경하여 튕김
    }

    // ground collision detection
    if (ballY > canvas.height) {
      console.log("Ball touched the ground");
      handleGameOver();
      return;
    }

    // 패들과 충돌 감지
    if (
      (spacePressed || resetPaddleAngle) &&
      ballY + ballRadius > paddleY && // 공이 패들의 y 좌표 범위에 있을 때
      ballX > paddleX &&
      ballX < paddleX + paddleWidth // 공이 패들의 x 좌표 범위에 있을 때
    ) {
      // 패들과 충돌 판정을 위한 충돌 박스 계산
      const paddleCenterX = paddleX + paddleWidth / 2;
      const paddleTopY = paddleY;
      const paddleBox = {
        x: paddleCenterX - paddleWidth / 2,
        y: paddleTopY,
        width: paddleWidth,
        height: paddleHeight,
      };

      // 공과 충돌 판정을 위한 충돌 박스 계산
      const ballBox = {
        x: ballX - ballRadius,
        y: ballY - ballRadius,
        width: ballRadius * 2,
        height: ballRadius * 2,
      };

      // 충돌 판정
      if (checkCollision(paddleBox, ballBox)) {
        if (resetPaddleAngle) {
          // 'e' 키가 눌려 있는 경우

          ballDX = Math.random() * 2 - 1; // 가로 속도를 -1~1중 램덤으로 설정
          bunt.play();
        } else {
          // 충돌 시 패들과의 상대적인 충돌 위치 계산
          const collisionPoint = ballX - (paddleX + paddleWidth / 2);

          // 상대적인 충돌 위치에 따라 공의 속도와 방향을 조절
          const maxBounceAngle = (paddleMaxAngle * Math.PI) / 180;
          const bounceAngle =
            (collisionPoint / (paddleWidth / 2)) * maxBounceAngle;
          ballDX = ballSpeed * Math.sin(bounceAngle);
          hit.play();
        }
        ballDY = -ballSpeedY; // 수직 방향은 항상 위쪽으로 설정
      }
    }

    if (brickCnt > 0) {
      requestAnimationFrame(draw);
    } else if (brickCnt == 0) {
      storyPage = difficulty + 2;
      $("#gameCanvas").hide();
      $("#gameStatus").hide();
      $("#skillStatusPage").hide();
      $("#skillAlertPage").hide();
      $("#story").fadeIn();
      lifeCount++;
      clearInterval(typingInterval);
      typingInterval = setInterval(typing, 100);
    } else {
      console.log("Story Game Error");
    }
  }

  draw(); // loop the game

  function endStoryMode() {
    // died while playing story mode
    removeKeyUpHandler();
    clearCanvas();
    $("#gameStatus").hide();
    $("#skillStatusPage").hide();
    $("#StroyGameOverPage").fadeIn();
  }

  $("#backToHomeButton_story").click(function () {
    lifeCount == 3;
    console.log("Back To Home...");
    $("#StroyGameOverPage").hide();
    $("#gameCanvas").hide();
    displayHomeScreen();
  });

  $("#restartStorygameButton").on("click", function () {
    console.log("Restarting Story Game...");
    $("#StroyGameOverPage").hide();
    lifeCount = 3;
    brickCnt = brickRowCount * brickColumnCount;
    playNormalMode();
  });
}

function playHardMode() {
  console.log("Play Hard Mode");
  console.log("Play Normal Mode");

  clearCanvas();
  $("#gameCanvas").show();
  $("#gameStatus").show();
  $("#livesLeft").text(lifeCount);
  $("#liveScore").text("");

  var skillsLeft = 5;

  $("#skillImg").attr("src", "src/skill" + teamType + ".png");
  $("#skillStatusPage").show();
  $("#skillsLeft").text(skillsLeft);

  //variables about the paddle
  var paddleWidth = 134;
  var paddleHeight = 18;
  const paddleSpeed = 7;
  const paddleMaxAngle = 105; // 최대 회전 각도 (방망이 휘두르는 각도)
  let paddleX = (canvas.width - paddleWidth) / 2;
  let paddleY = canvas.height - paddleHeight - 45;
  let paddleAngle = -25; // 현재 방망이 회전 각도
  const paddleImage = new Image();
  paddleImage.src = "src/batWithHands.png";

  //타자
  const hitterImage = new Image();
  hitterImage.src = "src/hitter" + teamType + ".png";
  const hitterWidth = 80;
  const hitterHeight = 120;
  let hitterX = paddleX - 70;
  let hitterY = paddleY - 65;

  const ballImage = new Image();
  ballImage.src = "src/ball.png";

  const backgroundImage = new Image();
  backgroundImage.src = "src/ground.jpg";

  let ballRotationAngle = 0;
  var ballRadius = 8;
  let ballX = canvas.width / 2;
  let ballY = paddleY - ballRadius;
  // 난이도 따라 수정
  let ballDX = 5;
  let ballDY = -ballDX;
  const ballSpeed = 5;
  let ballSpeedY = 5;

  // variables about the brick
  const brickRowCount = 4; // number of rows of bricks
  const brickColumnCount = 6; // number of rows of bricks
  let brickCnt = brickRowCount * brickColumnCount;
  const brickWidth = 60;
  const brickHeight = 30;
  const brickPadding = 30; // spacing between bricks
  const brickOffsetTop = 30;
  const brickOffsetLeft = 150;

  var bricks = new Array(brickRowCount);
  for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = new Array(brickColumnCount);
    for (let j = 0; j < brickColumnCount; j++) {
      var randomStatusValue = Math.floor(Math.random() * (difficulty + 1) + 1);
      bricks[i][j] = { x: 0, y: 0, status: randomStatusValue };
    }
  }

  // 키보드 이벤트 처리를 위한 변수 선언
  let rightPressed = false;
  let leftPressed = false;
  let spacePressed = false;
  let resetPaddleAngle = false; // 'e' 키를 누르는 동안 패들 각도를 0으로 초기화하기 위한 변수

  function handleSkill() {
    $("#skillAlertPage").show();
    if (skillsLeft > 0) {
      if (teamType === 1) {
        // remove ramdom row
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");

        var randomRowIndex = Math.floor(Math.random() * brickRowCount + 1);
        for (let j = 0; j < brickColumnCount; j++) {
          const b = bricks[randomRowIndex][j];
          skill4SoundEffect.play();
          if (b.status > 0) {
            b.status--;
            if (b.status === 0) {
              brickCnt--;
            }
          }
        }
        $("#skillAlert").text("Attacked Random Row!!");
        setTimeout(hideSkillAlert, 2000);
      } else if (teamType === 2) {
        // make bat bigger
        $("#skillAlert").text("The Bat Got Bigger!!");
        setTimeout(hideSkillAlert, 2000);
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");
        skill4SoundEffect.play();
        paddleWidth += 50;
        paddleHeight += 25;
        setTimeout(skill2_backToNormal, 8000);
      } else if (teamType === 3) {
        // make ball bigger
        $("#skillAlert").text("The Ball Got Bigger!!");
        setTimeout(hideSkillAlert, 2000);
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");
        skill4SoundEffect.play();
        ballRadius += 10;
        setTimeout(skill3_backToNormal, 6000);
      } else if (teamType === 4) {
        // remove random column
        var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");

        var randomColumnIndex = Math.floor(
          Math.random() * brickColumnCount + 1
        );
        for (let j = 0; j < brickRowCount; j++) {
          const b = bricks[j][randomColumnIndex];
          skill4SoundEffect.play();
          if (b.status > 0) {
            b.status--;
            if (b.status === 0) {
              brickCnt--;
            }
          }
        }
        $("#skillAlert").text("Attacked Random Column!!");
        setTimeout(hideSkillAlert, 3000);
      } else {
        console.log("teamType not defined - handleSkill() Error");
      }
      skillsLeft--;
      $("#skillsLeft").text(skillsLeft);
      console.log("skill is used");
    } else {
      console.log("Out of skills");
    }
  }

  function skill2_backToNormal() {
    paddleWidth -= 50;
    paddleHeight -= 25;
  }

  function skill3_backToNormal() {
    ballRadius -= 10;
  }

  function hideSkillAlert() {
    $("#skillAlert").text("");
    $("#skillAlertPage").hide();
  }

  // 키보드 이벤트 리스너 추가
  $(document).keydown(keyDownHandler);
  $(document).keyup(keyUpHandler);

  // 키보드 이벤트 처리 함수
  function keyDownHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
      rightPressed = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
      leftPressed = true;
    } else if (event.key === " ") {
      spacePressed = true;
    } else if (event.key === "e") {
      resetPaddleAngle = true; // 'e' 키를 누르면 패들 각도 초기화 플래그를 true로 설정
    }
  }

  function keyUpHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
      rightPressed = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
      leftPressed = false;
    } else if (event.key === " ") {
      spacePressed = false;
    } else if (event.key === "e") {
      resetPaddleAngle = false; // 'e' 키를 뗐을 때 패들 각도 초기화 플래그를 false로 설정
    } else if (event.key === "r") {
      handleSkill();
    } else if (event.key === "Escape") {
      brickCnt = 0;
    } else if (event.key === "m") {
      lifeCount = 1;
    }
  }

  function drawBall() {
    ctx.save();
    ctx.translate(ballX, ballY);
    ctx.rotate((Math.PI / 180) * ballRotationAngle); // 회전 각도 적용
    ctx.filter = `hue-rotate(${hue_value}deg)`;
    ctx.drawImage(
      ballImage,
      -ballRadius,
      -ballRadius,
      ballRadius * 2,
      ballRadius * 2
    );
    ctx.restore();
  }

  function drawPaddle() {
    ctx.save();
    ctx.translate(paddleX, paddleY);
    ctx.rotate((-Math.PI / 180) * paddleAngle); // 각도를 라디안으로 변환하여 회전
    ctx.drawImage(paddleImage, 0, 0, paddleWidth, paddleHeight);
    ctx.restore();
  }

  function drawHitter() {
    ctx.save();
    ctx.translate(hitterX, hitterY);
    ctx.drawImage(hitterImage, 0, 0, hitterWidth, hitterHeight);
    ctx.restore();
  }

  // 공 이미지 회전 함수
  function rotateBallImage() {
    ballRotationAngle += 15; // 회전 속도 조절
    if (ballRotationAngle >= 360) {
      ballRotationAngle = 0;
    }
  }

  function drawBricks() {
    var fillColors = ["#000", "#D5FFD5", "#8FBC8B", "#53682A"];

    for (let r = 0; r < brickRowCount; r++) {
      for (let c = 0; c < brickColumnCount; c++) {
        if (bricks[r][c].status > 0) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[r][c].x = brickX;
          bricks[r][c].y = brickY;

          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = fillColors[bricks[r][c].status];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    for (let i = 0; i < brickRowCount; i++) {
      for (let j = 0; j < brickColumnCount; j++) {
        const b = bricks[i][j];
        if (b.status > 0) {
          const brickX = b.x;
          const brickY = b.y;
          if (
            ballX + ballRadius > brickX &&
            ballX - ballRadius < brickX + brickWidth &&
            ballY + ballRadius > brickY &&
            ballY - ballRadius < brickY + brickHeight
          ) {
            const brickLeft = brickX;
            const brickRight = brickX + brickWidth;
            const brickTop = brickY;
            const brickBottom = brickY + brickHeight;

            if (
              ballX + ballRadius > brickRight ||
              ballX - ballRadius < brickLeft
            ) {
              // Collision is on the side of the brick
              ballDX = -ballDX; // Reverse the ball's horizontal direction
            } else if (
              ballY + ballRadius > brickTop &&
              ballY - ballRadius < brickBottom
            ) {
              // Collision is on the top or bottom of the brick
              ballDY = -ballDY; // Reverse the ball's vertical direction
            }

            b.status--;
            if (b.status === 0) {
              brickCnt--;
            }
            brickBreak.play();
          }
        }
      }
    }
  }

  function removeKeyUpHandler() {
    $(document).off("keyup", keyUpHandler);
  }

  function gameOver() {
    if (lifeCount === 0) {
      console.log("Died While Playing Hard Mode");
      removeKeyUpHandler();
      console.log("Removed KeyUp Handler");
      over.play();
      endStoryMode();
      return true;
    }
    return false;
  }

  // Function to reset the ball and paddle positions
  function resetPositions() {
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight - 45;
    hitterX = paddleX - 70;
    hitterY = paddleY - 65;
    ballX = canvas.width / 2;
    ballY = paddleY - ballRadius;
    // 난이도 따라 수정
    ballDX = 5;
    ballDY = -5;
  }

  // Game over and reset function
  function handleGameOver() {
    resetPositions();
    if (lifeCount > -1) {
      lifeCount--;
      $("#livesLeft").text(lifeCount);
      console.log("Lives: " + lifeCount);
    } else {
      console.log("lifeCount is less than -1");
    }
    if (!gameOver()) {
      setTimeout(function () {
        draw();
      }, 1000);
    }
  }

  // 게임 루프
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawPaddle();
    drawHitter();
    drawBall();
    rotateBallImage();
    drawBricks();
    collisionDetection();

    // 패들 이동
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += paddleSpeed;
      hitterX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= paddleSpeed;
      hitterX -= paddleSpeed;
    }

    // 방망이 휘두르는 모션
    if (spacePressed) {
      paddleAngle = Math.min(paddleAngle + 15, paddleMaxAngle); // 최대 각도까지 회전
    } else if (resetPaddleAngle) {
      paddleAngle = 0; // 'e' 키를 누르는 동안 패들 각도를 0으로 초기화
    } else {
      paddleAngle = -25; // 스페이스바를 뗐을 때 각도 초기화
    }

    // 공 위치 업데이트
    ballX += ballDX;
    ballY += ballDY;

    // 벽과 충돌 감지
    if (ballX + ballRadius > canvas.width - 1 || ballX - ballRadius < 1) {
      ballDX = -ballDX; // x 방향 반대로 변경하여 튕김
    }
    if (ballY - ballRadius < 0) {
      ballDY = -ballDY; // y 방향 반대로 변경하여 튕김
    }

    // ground collision detection
    if (ballY > canvas.height) {
      console.log("Ball touched the ground");
      handleGameOver();
      return;
    }

    // 패들과 충돌 감지
    if (
      (spacePressed || resetPaddleAngle) &&
      ballY + ballRadius > paddleY && // 공이 패들의 y 좌표 범위에 있을 때
      ballX > paddleX &&
      ballX < paddleX + paddleWidth // 공이 패들의 x 좌표 범위에 있을 때
    ) {
      // 패들과 충돌 판정을 위한 충돌 박스 계산
      const paddleCenterX = paddleX + paddleWidth / 2;
      const paddleTopY = paddleY;
      const paddleBox = {
        x: paddleCenterX - paddleWidth / 2,
        y: paddleTopY,
        width: paddleWidth,
        height: paddleHeight,
      };

      // 공과 충돌 판정을 위한 충돌 박스 계산
      const ballBox = {
        x: ballX - ballRadius,
        y: ballY - ballRadius,
        width: ballRadius * 2,
        height: ballRadius * 2,
      };

      // 충돌 판정
      if (checkCollision(paddleBox, ballBox)) {
        if (resetPaddleAngle) {
          // 'e' 키가 눌려 있는 경우

          ballDX = Math.random() * 2 - 1; // 가로 속도를 -1~1중 램덤으로 설정
          bunt.play();
        } else {
          // 충돌 시 패들과의 상대적인 충돌 위치 계산
          const collisionPoint = ballX - (paddleX + paddleWidth / 2);

          // 상대적인 충돌 위치에 따라 공의 속도와 방향을 조절
          const maxBounceAngle = (paddleMaxAngle * Math.PI) / 180;
          const bounceAngle =
            (collisionPoint / (paddleWidth / 2)) * maxBounceAngle;
          ballDX = ballSpeed * Math.sin(bounceAngle);
          hit.play();
        }
        ballDY = -ballSpeedY; // 수직 방향은 항상 위쪽으로 설정
      }
    }

    if (brickCnt > 0) {
      requestAnimationFrame(draw);
    } else if (brickCnt == 0) {
      console.log("Hard Mode Cleared");
      clearStoryMode();
    } else if (brickCnt == 0 && difficulty < 3) {
      storyPage = difficulty + 2;
      $("#gameCanvas").hide();
      $("#gameStatus").hide();
      $("#skillStatusPage").hide();
      $("#skillAlertPage").hide();
      $("#story").fadeIn();
      clearInterval(typingInterval);
      typingInterval = setInterval(typing, 100);
    } else {
      console.log("Story Game Error");
    }
  }

  draw(); // loop the game

  function endStoryMode() {
    // died while playing story mode
    removeKeyUpHandler();
    clearCanvas();
    $("#gameStatus").hide();
    $("#skillStatusPage").hide();
    $("#StroyGameOverPage").fadeIn();
  }

  function clearStoryMode() {
    $("#gameStatus").hide();
    $("#skillStatusPage").hide();
    ctx.fillStyle = "Yellow";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    $("#StoryClearPage").fadeIn();
    $("#victoryImg").attr("src", `src/victory${teamType}.png`);
    startBgm.pause();
    bgm2.pause();
    clearSound.play();
    victorySound.play();
  }

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
    brickCnt = brickRowCount * brickColumnCount;
    playHardMode();
  });

  $("#clearModalCloseButton").click(function () {
    console.log("Back To Home...");
    removeKeyUpHandler();
    $("#StoryClearPage").hide();
    $("#gameCanvas").hide();
    victorySound.pause();
    startBgm.play();
    displayHomeScreen();
  });
}

$("#selectRankedGameButton").click(function () {
  $("#gameTypeSelectingScreen").hide();
  $("#gameCanvas").show();
  beforePlayingRankedGame();
});

function beforePlayingRankedGame() {
  $("#beforePlayingRankedGamePage").css("display", "flex");
  $("#playRankedGameButton").click(function () {
    $("#beforePlayingRankedGamePage").hide();
    playRankedGame();
  });
}

function playRankedGame() {
  console.log("Starting Ranked game..");
  clearCanvas();
  $("#gameCanvas").show();
  startBgm.pause();
  $("#gameStatus").show();
  var lives = 3;
  rankedGameScore = 0;
  $("#livesLeft").text(lives);
  $("#liveScore").text("SCORE: " + rankedGameScore);

  //variables about the paddle
  const paddleWidth = 134;
  const paddleHeight = 18;
  const paddleSpeed = 7;
  const paddleMaxAngle = 105; // 최대 회전 각도 (방망이 휘두르는 각도)
  let paddleX = (canvas.width - paddleWidth) / 2;
  let paddleY = canvas.height - paddleHeight - 45;
  let paddleAngle = -25; // 현재 방망이 회전 각도
  const paddleImage = new Image();
  paddleImage.src = "src/batWithHands.png";

  //타자
  const hitterImage = new Image();
  hitterImage.src = "src/hitter1.png";
  const hitterWidth = 80;
  const hitterHeight = 120;
  let hitterX = paddleX - 70;
  let hitterY = paddleY - 65;

  // variables about the ball
  const ballImage = new Image();
  ballImage.src = "src/ball.png";

  // 배경 이미지 그리기
  const backgroundImage = new Image();
  backgroundImage.src = "src/ground.jpg";

  let ballRotationAngle = 0;
  const ballRadius = 8;
  let ballX = canvas.width / 2;
  let ballY = paddleY - ballRadius;
  let ballDX = 4;
  let ballDY = -5;
  const ballSpeed = 5;
  let ballSpeedY = 5;

  // variables about the brick
  const brickRowCount = 4; // number of rows of bricks
  const brickColumnCount = 6; // number of rows of bricks
  var maximumBrickRow = 7;
  let brickCnt = brickRowCount * brickColumnCount;
  const brickWidth = 80;
  const brickHeight = 30;
  const brickPadding = 1; // spacing between bricks
  const brickOffsetTop = 30;
  const brickOffsetLeft = 160;

  var bricks = new Array(brickRowCount);
  for (let i = 0; i < brickColumnCount; i++) {
    bricks[i] = new Array(brickColumnCount);
    for (let j = 0; j < brickRowCount; j++) {
      bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
  }

  // 키보드 이벤트 처리를 위한 변수 선언
  let rightPressed = false;
  let leftPressed = false;
  let spacePressed = false;
  let resetPaddleAngle = false; // 'e' 키를 누르는 동안 패들 각도를 0으로 초기화하기 위한 변수

  // 키보드 이벤트 리스너 추가
  $(document).keydown(keyDownHandler);
  $(document).keyup(keyUpHandler);

  // 키보드 이벤트 처리 함수
  function keyDownHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
      rightPressed = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
      leftPressed = true;
    } else if (event.key === " ") {
      spacePressed = true;
    } else if (event.key === "e") {
      resetPaddleAngle = true; // 'e' 키를 누르면 패들 각도 초기화 플래그를 true로 설정
    }
  }

  function keyUpHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
      rightPressed = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
      leftPressed = false;
    } else if (event.key === " ") {
      spacePressed = false;
    } else if (event.key === "e") {
      resetPaddleAngle = false; // 'e' 키를 뗐을 때 패들 각도 초기화 플래그를 false로 설정
    }
  }

  // 공 그리기
  function drawBall() {
    ctx.save();
    ctx.translate(ballX, ballY);
    ctx.rotate((Math.PI / 180) * ballRotationAngle); // 회전 각도 적용
    ctx.filter = `hue-rotate(${hue_value}deg)`;
    ctx.drawImage(
      ballImage,
      -ballRadius,
      -ballRadius,
      ballRadius * 2,
      ballRadius * 2
    );
    ctx.restore();
  }

  // 패들 그리기
  function drawPaddle() {
    ctx.save();
    ctx.translate(paddleX, paddleY);
    ctx.rotate((-Math.PI / 180) * paddleAngle); // 각도를 라디안으로 변환하여 회전
    ctx.drawImage(paddleImage, 0, 0, paddleWidth, paddleHeight);
    ctx.restore();
  }
  //타자 그리기
  function drawHitter() {
    ctx.save();
    ctx.translate(hitterX, hitterY);
    ctx.drawImage(hitterImage, 0, 0, hitterWidth, hitterHeight);
    ctx.restore();
  }

  // 공 이미지 회전 함수
  function rotateBallImage() {
    ballRotationAngle += 15; // 회전 속도 조절
    if (ballRotationAngle >= 360) {
      ballRotationAngle = 0;
    }
  }

  // 벽돌 그리기
  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#53682A";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    for (let i = 0; i < brickColumnCount; i++) {
      for (let j = 0; j < brickRowCount; j++) {
        const b = bricks[i][j];
        if (b.status > 0) {
          if (
            ballX + ballRadius > b.x &&
            ballX - ballRadius < b.x + brickWidth &&
            ballY + ballRadius > b.y &&
            ballY - ballRadius < b.y + brickHeight
          ) {
            const brickLeft = b.x;
            const brickRight = b.x + brickWidth;
            const brickTop = b.y;
            const brickBottom = b.y + brickHeight;

            if (
              ballX + ballRadius > brickRight ||
              ballX - ballRadius < brickLeft
            ) {
              // 충돌이 벽돌의 옆면에 있는 경우
              ballDX = -ballDX; // x축 이동 방향을 반대로 변경
            } else if (
              ballY + ballRadius > brickTop &&
              ballY - ballRadius < brickBottom
            ) {
              // 충돌이 벽돌의 윗면이나 아랫면에 있는 경우
              ballDY = -ballDY; // y축 이동 방향을 반대로 변경
            }

            b.status--; // 벽돌을 제거하기 위해 상태를 0으로 변경
            brickBreak.play();
            rankedGameScore++;
            if (rankedGameScore % 10 === 0) {
              ballDY += 1;
              ballSpeedY += 1;
            }
            $("#liveScore").text("SCORE: " + rankedGameScore);
          }
        }
      }
    }
  }

  function gameOver() {
    if (lives === 0) {
      over.play();
      endRankedGame();
      return true;
    }
    return false;
  }

  // Function to reset the ball and paddle positions
  function resetPositions() {
    paddleX = (canvas.width - paddleWidth) / 2;
    paddleY = canvas.height - paddleHeight - 45;
    hitterX = paddleX - 70;
    hitterY = paddleY - 65;
    ballX = canvas.width / 2;
    ballY = paddleY - ballRadius;
    ballDX = 4;
    ballDY = -5;
  }

  // Game over and reset function
  function handleGameOver() {
    resetPositions();
    lives--;
    $("#livesLeft").text(lives);
    console.log("Lives: " + lives);
    if (!gameOver()) {
      setTimeout(function () {
        draw();
      }, 1000);
    }
  }

  // Function to generate new brick row
  function generateNewBrickRow() {
    const newRow = new Array(1);
    for (let i = 0; i < brickColumnCount; i++) {
      newRow[i] = { x: 0, y: 0, status: 1 };
    }

    // Insert the new row at the beginning of the bricks array
    bricks.unshift(newRow);

    // Update the Y positions of existing rows
    for (let j = 1; j < bricks.length; j++) {
      for (let i = 0; i < brickColumnCount; i++) {
        if (bricks[j][i]) {
          bricks[j][i].y += brickHeight + brickPadding;
        }
      }
    }

    // Remove the last row if the total number of rows exceeds brickRowCount
    if (bricks.length > maximumBrickRow) {
      bricks.pop();
    }
  }
  var rowGeneratingInterval = 4000;
  function startNewBrickRowTimer() {
    setInterval(generateNewBrickRow, rowGeneratingInterval);
  }

  // Call the function to start the timer
  startNewBrickRowTimer();

  // 게임 루프
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    drawPaddle();

    drawHitter();

    drawBall();

    rotateBallImage();

    drawBricks();

    // 충돌 감지 및 벽돌 제거
    collisionDetection();

    // 패들 이동
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += paddleSpeed;
      hitterX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= paddleSpeed;
      hitterX -= paddleSpeed;
    }

    // 방망이 휘두르는 모션
    if (spacePressed) {
      paddleAngle = Math.min(paddleAngle + 15, paddleMaxAngle); // 최대 각도까지 회전
    } else if (resetPaddleAngle) {
      paddleAngle = 0; // 'e' 키를 누르는 동안 패들 각도를 0으로 초기화
    } else {
      paddleAngle = -25; // 스페이스바를 뗐을 때 각도 초기화
    }

    // 공 위치 업데이트
    ballX += ballDX;
    ballY += ballDY;

    // 벽과 충돌 감지
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
      ballDX = -ballDX; // x 방향 반대로 변경하여 튕김
    }
    if (ballY - ballRadius < 0) {
      ballDY = -ballDY; // y 방향 반대로 변경하여 튕김
    }

    // ground collision detection
    if (ballY > canvas.height) {
      handleGameOver();
      return;
    }

    // 패들과 충돌 감지
    if (
      (spacePressed || resetPaddleAngle) &&
      ballY + ballRadius > paddleY && // 공이 패들의 y 좌표 범위에 있을 때
      ballX > paddleX &&
      ballX < paddleX + paddleWidth // 공이 패들의 x 좌표 범위에 있을 때
    ) {
      // 패들과 충돌 판정을 위한 충돌 박스 계산
      const paddleCenterX = paddleX + paddleWidth / 2;
      const paddleTopY = paddleY;
      const paddleBox = {
        x: paddleCenterX - paddleWidth / 2,
        y: paddleTopY,
        width: paddleWidth,
        height: paddleHeight,
      };

      // 공과 충돌 판정을 위한 충돌 박스 계산
      const ballBox = {
        x: ballX - ballRadius,
        y: ballY - ballRadius,
        width: ballRadius * 2,
        height: ballRadius * 2,
      };

      // 충돌 판정
      if (checkCollision(paddleBox, ballBox)) {
        if (resetPaddleAngle) {
          // 'e' 키가 눌려 있는 경우
          ballDX = Math.random() * 2 - 1; // 가로 속도를 -1~1로 설정
          bunt.play();
        } else {
          // 충돌 시 패들과의 상대적인 충돌 위치 계산
          const collisionPoint = ballX - (paddleX + paddleWidth / 2);

          // 상대적인 충돌 위치에 따라 공의 속도와 방향을 조절
          const maxBounceAngle = (paddleMaxAngle * Math.PI) / 180;
          const bounceAngle =
            (collisionPoint / (paddleWidth / 2)) * maxBounceAngle;
          ballDX = ballSpeed * Math.sin(bounceAngle);
          hit.play();
        }
        ballDY = -ballSpeedY; // 수직 방향은 항상 위쪽으로 설정
      }
    }

    requestAnimationFrame(draw);
  }

  // 게임 루프 실행
  draw();
}

function endRankedGame() {
  clearCanvas();
  $("#gameStatus").hide();
  uploadScoreToDB(rankedGameScore);
  $("#rankedGameScore").text("SCORE: " + rankedGameScore);
  ctx.fillStyle = "Yellow";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  $("#rankedGameEndingPage").show();
}

const uploadScoreToDB = (score) => {
  rankingRef
    .doc(playerName)
    .get()
    .then((doc) => {
      if (doc.exists && doc.data().score > score) {
        console.log("Ranking not updated");
      } else {
        rankingRef.doc(playerName).set({
          score: score,
        });
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
};

rankingRef.orderBy("score", "desc").onSnapshot((querySnapshot) => {
  $("#rankingTable").html("<tr><th>등수</th><th>이름</th><th>점수</th></tr>");
  var i = 0;
  querySnapshot.forEach((doc) => {
    if (i >= 10) return;
    $("#rankingTable").html(
      `${$("#rankingTable").html()}<tr><td>${++i}</td><td>${doc.id}</td><td>${
        doc.data().score
      }</td></tr>`
    );
  });
});

$("#rankingBoardButton").on("click", () => {
  console.log("Displaying Ranking Modal");
  $("#rankedGameEndingPage").hide();
  $("#rankingModal").show();
});

$("#rankingModalCloseButton").on("click", () => {
  $("#rankingModal").hide();
  $("#rankedGameEndingPage").show();
});

$("#restartRankedgameButton").on("click", function () {
  console.log("Restarting Ranked Game...");
  $("#rankedGameEndingPage").hide();
  clearCanvas();
  lifeCount=3;
  rankedGameScore = 0;
  playRankedGame();
});

$("#backToHomeButton").click(function () {
  console.log("Back To Home...");
  $("#rankedGameEndingPage").hide();
  $("#gameCanvas").hide();
  startBgm.play();
  displayHomeScreen();
});

// 충돌 판정 함수
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

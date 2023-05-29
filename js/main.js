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
var clickSound1 = new Audio('source/click1.mp3')
var brickBreak = new Audio("src/brickBreak.mp3");
var teamType = -1;
var rankedGameScore = 0;

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

$(document).ready(function () {
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
    $("#gameIntroScreen").fadeOut();
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

    //시작화면
    $("#settingsButton").click(function () {
      $("#settingsScreen").fadeIn();
      const updateBallColor = () => {
        ballColor = `hsl(${hue_value}, 100%, 50%)`;
        $("#setting_color").css("background-color", ballColor);
      };
      updateBallColor();
      $("#hueRange").change(function (e) {
        hue_value = $(this).val();
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
        $("#settingsScreen").fadeOut();
      });

      function updateColor() {
        ballColor =
          "rgb(" + red_value + "," + green_value + "," + blue_value + ")";
        $("#setting_color").css("background-color", ballColor);
      }
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
    // clickSound1.play();
  });

  $("#selectTeam1").click(function () {
    teamType = 1;
    $("#teamSelectingScreen").hide();
    $("#difficultyChoosingScreen").fadeIn();
    // clickSound1.play();
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
    playEasyMode(3);
  });

  $("#selectNormalDifficulty").click(function () {
    console.log("Storygame Difficulty: Normal");
    $("#difficultyChoosingScreen").hide();
    playNormalMode(3);
  });

  $("#selectHardDifficulty").click(function () {
    console.log("Storygame Difficulty: Hard");
    $("#difficultyChoosingScreen").hide();
    playHardMode(3);
  });

  function playEasyMode(storyModeLives) {
    console.log("Starting Easy Story Game");
    clearCanvas();
    $("#gameCanvas").show();
    storyModeLives = 3;
    $("#gameStatus").show();
    $("#livesLeft").text(storyModeLives);
    $("#liveScore").text("");

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
    const brickWidth = 60;
    const brickHeight = 30;
    const brickPadding = 5; // spacing between bricks
    const brickOffsetTop = 30;
    const brickOffsetLeft = 215;

    var bricks = new Array(brickRowCount);
    for (let i = 0; i < brickColumnCount; i++) {
      bricks[i] = new Array(brickColumnCount);
      for (let j = 0; j < brickRowCount; j++) {
        var randomStatusValue = Math.floor(Math.random() * 3 + 1);
        bricks[i][j] = { x: 0, y: 0, status: randomStatusValue };
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

    function drawBall() {
      ctx.save();
      ctx.translate(ballX, ballY);
      ctx.rotate((Math.PI / 180) * ballRotationAngle); // 회전 각도 적용
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
            ctx.fillStyle = "#D5FFD5";
            ctx.fill();
            ctx.closePath();
          } else if (bricks[c][r].status === 2) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#8FBC8B";
            ctx.fill();
            ctx.closePath();
          } else if (bricks[c][r].status === 3) {
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
              ballX > b.x &&
              ballX < b.x + brickWidth &&
              ballY > b.y &&
              ballY < b.y + brickHeight
            ) {
              ballDY = -ballDY;
              b.status--; // 벽돌을 제거하기 위해 상태를 0으로 변경
              brickBreak.play();
            }
          } else {
          }
        }
      }
    }

    function gameOver() {
      if (storyModeLives === 0) {
        console.log("Died Playing Easy Mode");
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
      ballDX = 4;
      ballDY = -5;
    }

    // Game over and reset function
    function handleGameOver() {
      resetPositions();
      storyModeLives--;
      $("#livesLeft").text(storyModeLives);
      console.log("Lives: " + storyModeLives);
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
            ballDX = 0; // 가로 속도를 0으로 설정하여 멈춤
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

    function endStoryMode() {
      clearCanvas();
      $("#gameStatus").hide();
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 벽돌이 다 깨졌는지 확인하고, 다 깨졌으면, playNormalMode(storyModeLives); 실행
  }

  function playNormalMode(storyModeLives) {
    console.log("Starting Normal Story Game");
    console.log("Starting Easy Story Game");
    clearCanvas();
    $("#gameCanvas").show();
    $("#gameStatus").show();
    $("#livesLeft").text(storyModeLives);
    $("#liveScore").text("");

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
    const brickWidth = 60;
    const brickHeight = 30;
    const brickPadding = 5; // spacing between bricks
    const brickOffsetTop = 30;
    const brickOffsetLeft = 215;

    var bricks = new Array(brickRowCount);
    for (let i = 0; i < brickColumnCount; i++) {
      bricks[i] = new Array(brickColumnCount);
      for (let j = 0; j < brickRowCount; j++) {
        var randomStatusValue = Math.floor(Math.random() * 3 + 1);
        bricks[i][j] = { x: 0, y: 0, status: randomStatusValue };
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

    function drawBall() {
      ctx.save();
      ctx.translate(ballX, ballY);
      ctx.rotate((Math.PI / 180) * ballRotationAngle); // 회전 각도 적용
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
            ctx.fillStyle = "#D5FFD5";
            ctx.fill();
            ctx.closePath();
          } else if (bricks[c][r].status === 2) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#8FBC8B";
            ctx.fill();
            ctx.closePath();
          } else if (bricks[c][r].status === 3) {
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
              ballX > b.x &&
              ballX < b.x + brickWidth &&
              ballY > b.y &&
              ballY < b.y + brickHeight
            ) {
              ballDY = -ballDY;
              b.status--; // 벽돌을 제거하기 위해 상태를 0으로 변경
              brickBreak.play();
            }
          } else {
          }
        }
      }
    }

    function gameOver() {
      if (storyModeLives === 0) {
        console.log("Died Playing Easy Mode");
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
      ballDX = 4;
      ballDY = -5;
    }

    // Game over and reset function
    function handleGameOver() {
      resetPositions();
      storyModeLives--;
      $("#livesLeft").text(storyModeLives);
      console.log("Lives: " + storyModeLives);
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
            ballDX = 0; // 가로 속도를 0으로 설정하여 멈춤
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

    function endStoryMode() {
      clearCanvas();
      $("#gameStatus").hide();
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function playHardMode(storyModeLives) {
    console.log("Starting Hard Story Game");
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
    $("#rankedGameEndingPage").hide();
    clearCanvas();
    console.log("starting ranked game..");
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
    var rowGeneratingInterval = 5000;
    let maximumBrickRow = 9;
    const brickWidth = 60;
    const brickHeight = 30;
    const brickPadding = 5; // spacing between bricks
    const brickOffsetTop = 30;
    const brickOffsetLeft = 215;

    var bricks = new Array(brickRowCount);
    for (let i = 0; i < brickColumnCount; i++) {
      bricks[i] = new Array(brickColumnCount);
      for (let j = 0; j < brickRowCount; j++) {
        var randomStatusValue = Math.floor(Math.random() * 3 + 1);
        bricks[i][j] = { x: 0, y: 0, status: randomStatusValue };
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
    // 왜안됨?

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
            ctx.fillStyle = "#D5FFD5";
            ctx.fill();
            ctx.closePath();
          } else if (bricks[c][r].status === 2) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#8FBC8B";
            ctx.fill();
            ctx.closePath();
          } else if (bricks[c][r].status === 3) {
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

    // 충돌 감지 및 벽돌 제거
    function collisionDetection() {
      for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
          const b = bricks[i][j];
          if (b.status > 0) {
            if (
              ballX > b.x &&
              ballX < b.x + brickWidth &&
              ballY > b.y &&
              ballY < b.y + brickHeight
            ) {
              ballDY = -ballDY;
              b.status--; // 벽돌을 제거하기 위해 상태를 0으로 변경
              brickBreak.play();
              rankedGameScore++;
              if (rankedGameScore % 10 === 0) {
                ballDY += 1;
                ballSpeedY += 1;
              }
              $("#liveScore").text("SCORE: " + rankedGameScore);
            }
          } else {
          }
        }
      }
    }

    function gameOver() {
      if (lives === 0) {
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
        var randomStatusValue = Math.floor(Math.random() * 3 + 1);
        newRow[i] = { x: 0, y: 0, status: randomStatusValue };
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
            ballDX = 0; // 가로 속도를 0으로 설정하여 멈춤
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
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    $("#rankedGameEndingPage").show();
  }

  const uploadScoreToDB = (score) => {
    const name = "NAME";

    rankingRef.doc(name).set({
      score: score,
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
    $("#rankingModal").show();
  });

  $("#rankingModalCloseButton").on("click", () => {
    $("#rankingModal").hide();
  });

  $("#restartRankedgameButton").on("click", function () {
    console.log("Restarting Ranked Game...");
    $("#rankedGameEndedPage").hide();
    clearCanvas();
    rankedGameScore = 0;
    playRankedGame();
  });

  $("#backToHomeButton").click(function () {
    console.log("Back To Home...");
    $("#rankedGameEndingPage").hide();
    $("#gameCanvas").hide();
    displayHomeScreen();
  });
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

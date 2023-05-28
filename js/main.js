//인트로
var introDuration1;
var introLabel2;
var introDuration1;
var introDuration2;
var totalDuration;

//시작화면
var red_value = 0;
var green_value = 0;
var blue_value = 0;
var startBgm = new Audio("src/startbgm1.mp3");
var bgm2 = new Audio("src/startbgm2.mp3");

var teamType = -1;
var storyGameDifficulty = -1;
var rankedGameScore = 0;

$(document).ready(function () {
  var canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  //인트로
  introDuration1 = $("#gameIntro1").find($("label"));
  introLabel2 = $("#gameIntro2").find($("label"));
  introDuration1 = animateLabels(introDuration1, 0);
  setTimeout(function () {
    $("#gameIntro1").hide();
  }, introDuration1);
  introDuration2 = animateLabels(introLabel2, introDuration1);
  totalDuration = introDuration1 + introDuration2 - 2000;

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
    setTimeout(function () {
      $("#gameIntroScreen").fadeOut();
      $("#homeScreen").fadeIn();
      startBgm.play();
      startBgm.loop = true;
    }, totalDuration);

    console.log("Displaying Homescreen...");
    //시작화면
    $("#settingsButton").click(function () {
      $("#settingsScreen").fadeIn();
      updateColor();
      $("#Red").change(function (e) {
        red_value = $(this).val();
        updateColor();
      });
      $("#Green").change(function (e) {
        green_value = $(this).val();
        updateColor();
      });
      $("#Blue").change(function (e) {
        blue_value = $(this).val();
        updateColor();
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
      $("#gameSelectingScreen").fadeIn();
    });
  }

  displayHomeScreen();

  // #click_sound 소스 찾아서 html에 넣어야함.
  // function play() {
  //   var audio = $("#click_sound")[0];
  //   if (audio.paused) {
  //     audio.play();
  //   } else {
  //     audio.pause();
  //     audio.currentTime = 0;
  //   }
  // }

  $("#selectStoryGameButton").click(function () {
    $("#gameTypeSelectingScreen").hide();
    $("#teamSelectingScreen").fadeIn();
    // play();
  });

  $("#selectTeam1").click(function () {
    teamType = 1;
    $("#teamSelectingScreen").hide();
    $("#difficultyChoosingScreen").fadeIn();
    // play();
  });

  $("#selectEasyDifficulty").click(function () {
    console.log("Storygame Difficulty: Easy");
    $("#difficultyChoosingScreen").hide();
    storyGameDifficulty = 1;
    playEasyMode();
  });

  $("#selectNormalDifficulty").click(function () {
    console.log("Storygame Difficulty: Normal");
    storyGameDifficulty = 2;
    playNormalMode();
  });

  $("#selectHardDifficulty").click(function () {
    console.log("Storygame Difficulty: Hard");
    storyGameDifficulty = 3;
    playHardMode();
  });

  function playEasyMode(){
    console.log("Starting Easy Story Game");
  }

  function playNormalMode(){
    console.log("Starting Normal Story Game");
  }

  function playHardMode(){
    console.log("Starting Hard Story Game");
  }

  $("#selectRankedGameButton").click(function () {
    $("#gameTypeSelectingScreen").hide();
    $("#gameCanvas").show();
    beforePlayingRankedGame();
  });

  function beforePlayingRankedGame() {
    $("#beforePlayingRankedGamePage").show();
    $("#playRankedGameButton").click(function() {
      $("#beforePlayingRankedGamePage").hide();
      playRankedGame();
    });
  }

  function playRankedGame() {
    $("#rankedGameEndingPage").hide();
    clearCanvas();
    console.log("starting ranked game..");
    startBgm.pause();
    $("#rankedGameStatus").show();
    var lives = 3;
    rankedGameScore = 0;
    $("#livesLeft").text(lives);
    $("#rankedGameLiveScore").text("Score: " + rankedGameScore);

    //variables about the paddle
    const paddleWidth = 134;
    const paddleHeight = 18;
    const paddleSpeed = 7;
    const paddleMaxAngle = 105; // 최대 회전 각도 (방망이 휘두르는 각도)
    let paddleX = (canvas.width - paddleWidth) / 2;
    let paddleY = canvas.height - paddleHeight - 30;
    let paddleAngle = -25; // 현재 방망이 회전 각도
    const paddleImage = new Image();
    paddleImage.src = "src/bat.png";

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

    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // status: 1이면 벽돌이 존재하는 상태
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
            ctx.fillStyle = "#556B2F";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    // 충돌 감지 및 벽돌 제거
    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              ballX > b.x &&
              ballX < b.x + brickWidth &&
              ballY > b.y &&
              ballY < b.y + brickHeight
            ) {
              ballDY = -ballDY;
              b.status = 0; // 벽돌을 제거하기 위해 상태를 0으로 변경
              rankedGameScore++;
              $("#rankedGameLiveScore").text("Score: " + rankedGameScore);
            }
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
      paddleY = canvas.height - paddleHeight - 30;
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
      // Create a new row of bricks
      const newRow = [];
      for (let c = 0; c < brickColumnCount; c++) {
        newRow[c] = { x: 0, y: 0, status: 1 };
      }

      // Insert the new row at the beginning of the bricks array
      bricks.unshift(newRow);

      // Update the Y positions of existing rows
      for (let r = 1; r < bricks.length; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
          if (bricks[r][c]) {
            bricks[r][c].y += brickHeight + brickPadding;
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

      drawBall();

      rotateBallImage();

      drawBricks();

      // 충돌 감지 및 벽돌 제거
      collisionDetection();

      // 패들 이동
      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
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
          } else {
            // 충돌 시 패들과의 상대적인 충돌 위치 계산
            const collisionPoint = ballX - (paddleX + paddleWidth / 2);

            // 상대적인 충돌 위치에 따라 공의 속도와 방향을 조절
            const maxBounceAngle = (paddleMaxAngle * Math.PI) / 180;
            const bounceAngle =
              (collisionPoint / (paddleWidth / 2)) * maxBounceAngle;
            ballDX = ballSpeed * Math.sin(bounceAngle);
          }
          ballDY = -ballSpeed; // 수직 방향은 항상 위쪽으로 설정
        }
      }

      // 충돌 판정 함수
      function checkCollision(rect1, rect2) {
        return (
          rect1.x < rect2.x + rect2.width &&
          rect1.x + rect1.width > rect2.x &&
          rect1.y < rect2.y + rect2.height &&
          rect1.y + rect1.height > rect2.y
        );
      }

      requestAnimationFrame(draw);
    }

    // 게임 루프 실행
    draw();
  }

  function endRankedGame() {
    clearCanvas();
    $("#rankedGameStatus").hide();
    //uploadScoreToDB(rankedGameScore);
    $("#rankedGameScore").text("Score: " + rankedGameScore);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    $("#rankedGameEndingPage").show();
  }

  function uploadScoreToDB() {
    // 율원씨 구현부분
  }

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

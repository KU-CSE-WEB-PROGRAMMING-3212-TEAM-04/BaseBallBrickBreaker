$(document).ready(function () {
  var canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  var userTeamType = 0;
  var rankedGameScore = 0;

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Initialize the game
  function displayHomepage() {
    clearCanvas();
    userTeamType = 0;
    $("#homepage").show();
    $("#settingsPage").hide();
    $("#gameTypeChoosingPage").hide();
    $("#difficultyChoosingPage").hide();
    $("#teamSelectingPage").hide();
    $("#rankedGameStatus").hide();
    $("#rankedGameEndedPage").hide();
  }

  $("#startGameButton").on("click", function () {
    console.log("Start");
    $("#homepage").hide();
    $("#gameTypeChoosingPage").show();
  });

  $("#settingsButton").on("click", function () {
    console.log("Settings");
    $("#homepage").hide();
    $("#settingsPage").show();
  });

  $("#settingsToHomeButton").on("click", function () {
    displayHomepage();
  });

  $("#chooseStoryModeButton").on("click", function () {
    $("#gameTypeChoosingPage").hide();
    $("#difficultyChoosingPage").show();
  });

  $("#chooseRankedModeButton").on("click", function () {
    $("#gameTypeChoosingPage").hide();
    $("#teamSelectingPage").show();
  });

  $("#chooseTeam1").on("click", function () {
    userTeamType = 1;
    $("#teamSelectingPage").hide();
    playRankedGame();
  });

  $("#chooseTeam2").on("click", function () {
    userTeamType = 2;
    $("#teamSelectingPage").hide();
    playRankedGame();
  });

  $("#chooseTeam3").on("click", function () {
    userTeamType = 3;
    $("#teamSelectingPage").hide();
    playRankedGame();
  });

  $("#chooseTeam4").on("click", function () {
    userTeamType = 4;
    $("#teamSelectingPage").hide();
    endRankedGame();
  });

  function playRankedGame() {
    console.log("starting ranked game..");
    $("#rankedGameStatus").show();
    var lives = 3;
    $("#livesLeft").text(lives);
    $("#rankedGameLiveScore").text("Score: "+rankedGameScore);

    //variables about the paddle
    const paddleWidth = 134;
    const paddleHeight = 18;
    const paddleSpeed = 7;
    const paddleMaxAngle = 105; // 최대 회전 각도 (방망이 휘두르는 각도)
    let paddleX = (canvas.width - paddleWidth) / 2;
    let paddleY = canvas.height - paddleHeight - 30;
    let paddleAngle = -25; // 현재 방망이 회전 각도
    const paddleImage = $("#paddleImage")[0];

    // variables about the ball
    const ballImage = $("#ballImage")[0];
    let ballRotationAngle = 0;
    const ballRadius = 8;
    let ballX = canvas.width / 2;
    let ballY = paddleY - ballRadius;
    let ballDX = 4;
    let ballDY = -5;
    const ballSpeed = 5;

    // variables about the brick
    const brickRowCount = 4; // 벽돌 행 개수
    const brickColumnCount = 10; // 벽돌 열 개수
    const brickWidth = 70;
    const brickHeight = 30;
    const brickPadding = 5; // 벽돌 사이 간격
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

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
            ctx.fillStyle = "#0095DD";
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
              $("#rankedGameLiveScore").text("Score: "+rankedGameScore);
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
      console.log("Lives: "+lives);
      if (!gameOver()) {
        setTimeout(function () {
          draw();
        }, 1000);
      }
    }

    // 게임 루프
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    //uploadScoreToDB();
    $("#rankedGameStatus").hide();
    clearCanvas();
    $("#rankedGameScore").text("Score: " + rankedGameScore);
    $("#rankedGameEndedPage").show();
  }

  function uploadScoreToDB() {
    // 율원씨 구현부분
  }

  $("#restartRankedgameButton").on("click", function () {
    $("#rankedGameEndedPage").hide();
    clearCanvas();
    rankedGameScore = 0;
    playRankedGame();
  });

  $("#backToHomeButton").on("click", function () {
    displayHomepage();
  });

  displayHomepage();
});
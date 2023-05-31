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

$("#playRankedGameButton").click(function () {
  $("#beforePlayingRankedGamePage").hide();
  playRankedGame();
});

$("#restartRankedgameButton").on("click", function () {
  console.log("Restarting Ranked Game...");
  $("#rankedGameEndingPage").hide();
  clearCanvas();
  lifeCount = 3;
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

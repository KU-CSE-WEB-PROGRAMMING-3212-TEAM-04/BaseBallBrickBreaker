var skillsLeft = 5;

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

const hitterImage = new Image();
const hitterWidth = 80;
const hitterHeight = 120;
let hitterX;
let hitterY;

const ballImage = new Image();
ballImage.src = "src/ball.png";

var ballRotationAngle;
var ballRadius;
var ballX;
var ballY;
var ballDX;
var ballDY;
var ballSpeed;
var ballSpeedY;

// variables about the brick
const brickRowCount = 4; // number of rows of bricks
const brickColumnCount = 6; // number of rows of bricks
const maximumBrickRow = 7;
const brickHeight = 30;
const brickOffsetTop = 30;
const brickOffsetLeft = 150;
var brickPadding; // spacing between bricks
var brickWidth;
var brickCnt;

// 키보드 이벤트 처리를 위한 변수 선언
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var resetPaddleAngle = false; // 'e' 키를 누르는 동안 패들 각도를 0으로 초기화하기 위한 변수

var bricks;

var skill4SoundEffect = new Audio("src/skill4SoundEffect.mp3");

var shiftInterval = 0;

const play = (difficulty) => {
  console.log(`Playing difficulty ${difficulty}`);

  clearCanvas();
  $("#gameCanvas").show();
  $("#gameStatus").show();
  $("#livesLeft").text(lifeCount);
  $("#liveScore").text(isRanked ? `SCORE: ${rankedGameScore}` : "");
  $("#rankedGameBackground").show();
  $("#rankedGameBackgroundVideo").play();

  if (!isRanked) {
    $("#skillImg").attr("src", `src/skill${teamType}.png`);
    $("#skillStatusPage").show();
    $("#skillsLeft").text(skillsLeft);
  }

  //타자
  hitterImage.src = "src/hitter" + teamType + ".png";
  hitterX = paddleX - 70;
  hitterY = paddleY - 65;

  ballRotationAngle = 0;
  ballRadius = 8;
  ballX = canvas.width / 2;
  ballY = paddleY - ballRadius;
  // 난이도 따라 수정
  ballDX = isRanked ? 5 : 4 + difficulty;
  ballDY = -ballDX;
  ballSpeed = ballDX;
  ballSpeedY = ballDX;

  brickCnt = brickRowCount * brickColumnCount;
  brickPadding = isRanked ? 1 : 30;
  brickWidth = isRanked ? 80 : 60;

  bricks = new Array(brickRowCount);
  for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = new Array(brickColumnCount);
    for (let j = 0; j < brickColumnCount; j++) {
      bricks[i][j] = {
        x: 0,
        y: 0,
        status: isRanked ? 1 : Math.floor(Math.random() * (difficulty + 1) + 1),
      };
    }
  }

  // 키보드 이벤트 리스너 추가
  $(document).keydown(keyDownHandler);
  $(document).keyup(keyUpHandler);

  draw(); // loop the game
  if (isRanked)
    shiftInterval = setInterval(() => {
      for (let i = 0; i < brickRowCount; i++) {
        bricks[i].unshift({ x: 0, y: 0, status: 1 });
        bricks[i].pop();
      }
    }, 4000);
};

function handleSkill() {
  $("#skillAlertPage").show();
  if (skillsLeft > 0) {
    if (teamType === 1) {
      // remove ramdom row
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
    } else if (teamType === 2) {
      // make bat bigger
      $("#skillAlert").text("The Bat Got Bigger!!");
      skill4SoundEffect.play();
      paddleWidth += 50;
      paddleHeight += 25;
      setTimeout(() => {
        paddleWidth -= 50;
        paddleHeight -= 25;
      }, 8000);
    } else if (teamType === 3) {
      // make ball bigger
      $("#skillAlert").text("The Ball Got Bigger!!");
      skill4SoundEffect.play();
      ballRadius += 10;
      setTimeout(() => {
        ballRadius -= 10;
      }, 6000);
    } else if (teamType === 4) {
      // remove random column
      var randomColumnIndex = Math.floor(Math.random() * brickColumnCount + 1);
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
    } else {
      console.log("teamType not defined - handleSkill() Error");
    }
    setTimeout(() => {
      $("#skillAlert").text("");
      $("#skillAlertPage").hide();
    }, 2000);
    skillsLeft--;
    $("#skillsLeft").text(skillsLeft);
    console.log("skill is used");
  } else {
    console.log("Out of skills");
  }
}

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
    if (!isRanked) handleSkill();
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
      const brick = bricks[i][j];
      if (brick.status > 0) {
        if (
          ballX + ballRadius > brick.x &&
          ballX - ballRadius < brick.x + brickWidth &&
          ballY + ballRadius > brick.y &&
          ballY - ballRadius < brick.y + brickHeight
        ) {
          const brickLeft = brick.x;
          const brickRight = brick.x + brickWidth;
          const brickTop = brick.y;
          const brickBottom = brick.y + brickHeight;

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

          brick.status--;
          if (brick.status === 0) {
            brickCnt--;
          }
          brickBreak.play();
          if (isRanked) {
            if (++rankedGameScore % 10 === 0) {
              ballDY += 1;
              ballSpeedY += 1;
            }
            $("#liveScore").text(`SCORE: ${rankedGameScore}`);
          }
        }
      }
    }
  }
}

function removeKeyHandler() {
  $(document).off("keyup", keyUpHandler);
  $(document).off("keydown", keyDownHandler);
  rightPressed = false;
  leftPressed = false;
  spacePressed = false;
  resetPaddleAngle = false;
}

function gameOver() {
  if (lifeCount !== 0) return false;

  console.log("Died While Playing " + difficulty);
  removeKeyHandler();
  console.log("Removed KeyUp Handler");
  over.play();
  isRanked ? endRankedGame() : endStoryMode();
  return true;
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
  ballDX = isRanked ? 5 : 4 + difficulty;
  ballDY = -ballDX;
}

// Game over and reset function
function handleGameOver() {
  resetPositions();
  if (lifeCount > 0) {
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
    if (checkCollision(paddleBox, ballBox) && paddleAngle !== paddleMaxAngle) {
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
  if (isRanked || brickCnt > 0) {
    requestAnimationFrame(draw);
  } else if (brickCnt == 0 && difficulty == 2) {
    console.log("HARD CLEARED");
    clearStoryMode();
  } else if (brickCnt == 0) {
    difficulty++;
    $("#gameCanvas").hide();
    $("#gameStatus").hide();
    $("#rankedGameBackground").hide();
    $("#rankedGameBackgroundVideo").pause();

    $("#skillStatusPage").hide();
    $("#skillAlertPage").hide();
    $("#story").fadeIn();
    clearInterval(typingInterval);
    typingInterval = setInterval(typing, 100);
    return;
  } else {
    console.log("ERR");
  }
}

function endStoryMode() {
  // died while playing story mode
  removeKeyHandler();
  clearCanvas();
  lifeCount = 3;
  $("#gameStatus").hide();
  $("#rankedGameBackground").hide();
  $("#rankedGameBackgroundVideo").pause();

  $("#skillStatusPage").hide();
  $("#StroyGameOverPage").fadeIn();
}

function endRankedGame() {
  if (shiftInterval !== 0) {
    clearInterval(shiftInterval);
    shiftInterval = 0;
  }
  clearCanvas();
  $("#gameStatus").hide();
  $("#rankedGameBackground").hide();
  $("#rankedGameBackgroundVideo").pause();

  uploadScoreToDB(rankedGameScore);
  $("#rankedGameScore").text("SCORE: " + rankedGameScore);
  ctx.fillStyle = "Yellow";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  $("#rankedGameEndingPage").show();
  lifeCount = 3;
  rankedGameScore = 0;
}

function clearStoryMode() {
  $("#gameStatus").hide();
  $("#rankedGameBackground").hide();
  $("#rankedGameBackgroundVideo").pause();

  $("#skillStatusPage").hide();
  $("#story").hide();
  ctx.fillStyle = "Yellow";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  $("#StoryClearPage").fadeIn();
  $("#victoryImg").attr("src", `src/victory${teamType}.png`);
  startBgm.pause();
  bgm2.pause();
  clearSound.play();
  victorySound.play();
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

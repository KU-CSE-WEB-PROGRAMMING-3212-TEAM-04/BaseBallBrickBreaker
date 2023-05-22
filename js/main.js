$(document).ready(function () {
  var canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Initialize the game
  function initializeGame() {
    // removeAllEventListeners();
    clearCanvas();
    displayHomepage();
  }

  // Clear the canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("canvas cleared");
  }

  // Display the game start button
  // Display the game start button
  function displayStartButton() {
    const buttonWidth = 120;
    const buttonHeight = 50;
    const buttonX = 250;
    const buttonY = 350;

    ctx.fillStyle = "blue";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Add text inside the button
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Start Game", buttonX + 10, buttonY + 30);

    // Add event listener to the canvas
    function startGameOnClick(event) {
      // Remove the event listener
      canvas.removeEventListener("click", startGameOnClick);

      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if the click is within the button's boundaries
      if (
        clickX >= buttonX &&
        clickX <= buttonX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
      ) {
        selectGameType();
      }
    }

    canvas.addEventListener("click", startGameOnClick);
  }

  // Display the settings button
  function displaySettingsButton() {
    const buttonWidth = 100;
    const buttonHeight = 50;
    const buttonX = 400;
    const buttonY = 350;

    ctx.fillStyle = "green";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Add text inside the button
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Settings", buttonX + 20, buttonY + 30);

    // Add event listener to the canvas
    canvas.addEventListener("click", function (event) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if the click is within the button's boundaries
      if (
        clickX >= buttonX &&
        clickX <= buttonX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
      ) {
        settings();
      }
    });
  }

  // Handle the settings functionality
  function settings() {
    clearCanvas();
    displayBatImageSelection();
    displayBallColorSelection();
    displayBackButton();
  }

  // Display the back button
  function displayBackButton() {}

  // Select the game type
  function selectGameType() {
    clearCanvas();
    displayStoryGameButton();
    displayRankedGameButton();
  }

  // Display the button for story game
  function displayStoryGameButton() {
    const buttonWidth = 120;
    const buttonHeight = 50;
    const buttonX = 250;
    const buttonY = 250;

    ctx.fillStyle = "green";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Add text inside the button
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Story Game", buttonX + 10, buttonY + 30);

    // Add event listener to the canvas
    canvas.addEventListener("click", function (event) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if the click is within the button's boundaries
      if (
        clickX >= buttonX &&
        clickX <= buttonX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
      ) {
        selectTeam();
      }
    });
  }

  // Select the team for story game
  function selectTeam() {
    clearCanvas;
    const buttonWidth = 120;
    const buttonHeight = 50;
    const buttonX = 250;
    const buttonY = 250;

    ctx.fillStyle = "green";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Add text inside the button
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Story Game", buttonX + 10, buttonY + 30);

    // Add event listener to the canvas
    canvas.addEventListener("click", function (event) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if the click is within the button's boundaries
      if (
        clickX >= buttonX &&
        clickX <= buttonX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
      ) {
        selectTeam();
      }
    });
  }

  // Display the button for ranked game
  function displayRankedGameButton() {
    const buttonWidth = 120;
    const buttonHeight = 50;
    const buttonX = 400;
    const buttonY = 250;

    ctx.fillStyle = "orange";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Add text inside the button
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Ranked Game", buttonX + 10, buttonY + 30);

    // Add event listener to the canvas
    canvas.addEventListener("click", function (event) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if the click is within the button's boundaries
      if (
        clickX >= buttonX &&
        clickX <= buttonX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
      ) {
        startRankedGame();
      }
    });
  }

  function startRankedGame() {
    clearCanvas();

    // Initialize game variables
    const paddleWidth = 134;
    const paddleHeight = 18;
    let paddleX = (canvas.width - paddleWidth) / 2; // Initial paddle position
    let paddleY = canvas.height - paddleHeight - 30;

    const ballRadius = 8;
    let ballX = canvas.width / 2; // Initial ball position
    let ballY = paddleY - ballRadius; // Initial ball position
    let ballDX = 4; // Initial ball velocity
    let ballDY = -5; // Initial ball velocity
    let score = 0;
    let lives = 3;

    // Initialize bricks
    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    const bricks = [];

    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    // Function to draw bricks on the canvas
    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.fillStyle = "orange";
            ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
          }
        }
      }
    }

    // Function to update game state and redraw elements
    function update() {
      // Clear the canvas
      clearCanvas();

      drawBricks();

      // Update ball position
      ballX += ballDX;
      ballY += ballDY;

      // Draw paddle
      ctx.fillStyle = "blue";
      ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();

      // Handle collisions
      if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        // Ball hits the side walls, change horizontal direction
        ballDX = -ballDX;
      }
      if (ballY - ballRadius < 0) {
        // Ball hits the top wall, change vertical direction
        ballDY = -ballDY;
      }
      if (
        ballY + ballRadius > paddleY &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
      ) {
        // Ball hits the paddle, change vertical direction
        ballDY = -ballDY;
      }

      // Check for game over conditions
      if (ballY + ballRadius > canvas.height) {
        // Ball goes below the paddle, lose a life
        lives--;
        if (lives <= 0) {
          // No more lives, game over
          endRankedGame();
          return;
        } else {
          // Reset ball and paddle positions
          ballX = canvas.width / 2;
          ballY = paddleY - ballRadius;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }

      // Request animation frame to continue the game loop
      requestAnimationFrame(update);
    }

    // Function to handle paddle movement based on user input
    function handlePaddleMovement(event) {
      if (event.key === "ArrowLeft") {
        // Move paddle to the left
        paddleX -= 10;
        if (paddleX < 0) {
          paddleX = 0;
        }
      } else if (event.key === "ArrowRight") {
        // Move paddle to the right
        paddleX += 10;
        if (paddleX + paddleWidth > canvas.width) {
          paddleX = canvas.width - paddleWidth;
        }
      }
    }

    // Event listeners for paddle movement
    document.addEventListener("keydown", handlePaddleMovement);
    document.addEventListener("keyup", handlePaddleMovement);

    // Start the game loop
    update();
  }

  // Handle the end of the ranked game
  function endRankedGame() {
    clearCanvas();
    displayRestartButton();
    displayBackToHomeButton();
  }

  function displayRestartButton() {
    const buttonWidth = 100;
    const buttonHeight = 50;
    const buttonX = 50;
    const buttonY = 150;

    // Clear the canvas
    clearCanvas();

    // Draw the button
    ctx.fillStyle = "red";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Add text inside the button
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Restart", buttonX + 10, buttonY + 30);

    // Add event listener to the canvas
    canvas.addEventListener("click", function (event) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if the click is within the button's boundaries
      if (
        clickX >= buttonX &&
        clickX <= buttonX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
      ) {
        startRankedGame();
      }
    });
  }

  function displayBackToHomeButton() {
    const buttonWidth = 180;
    const buttonHeight = 50;
    const buttonX = 200;
    const buttonY = 150;

    ctx.fillStyle = "red";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Add text inside the button
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Back to Home", buttonX + 20, buttonY + 30);

    // Add event listener to the canvas
    canvas.addEventListener("click", function (event) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // Check if the click is within the button's boundaries
      if (
        clickX >= buttonX &&
        clickX <= buttonX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
      ) {
        initializeGame();
      }
    });
  }

  initializeGame();
});

// Global variables
let teamType; // Four team types
let batImage; // Customization: bat image
let ballColor; // Customization: ball color
let rankedGameScore = 0;
let rankedGameLives = 3;
let ballX = 0; // Ball position
let ballY = 0;
let ballDX = 0; // Ball velocity
let ballDY = 0;

// Display bat image selection
function displayBatImageSelection() {
  // Implementation for bat image selection
}

// Display ball color selection
function displayBallColorSelection() {
  // Implementation for ball color selection
}

// Select the difficulty level for the story game
function selectStoryGameDifficulty() {
  // Implementation for selecting the difficulty level in the story game
}

// Handle key up events
function handleKeyUp(e) {
  // Implementation for key up events
}

// Perform a bunt action
function bunt() {
  // Implementation for bunt action
}

// Perform a swing with skill action
function swingWithSkill() {
  // Implementation for swing with skill action
}

// Perform a normal swing action
function swing() {
  // Implementation for normal swing action
}

// Handle the submission of user name and registration in ranked game
function handleUserRegistration() {
  // Implementation for handling user name registration
}

// Display the ranked game rank on the canvas
function displayRank() {
  // Implementation for displaying ranked game rank on the canvas
}

// Restart the ranked game
function restartRankedGame() {
  // Implementation for restarting the ranked game
}

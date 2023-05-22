$(document).ready(function () {
  var canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  var userTeamType = 0;
  var rankedGameScore = 0;

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("canvas cleared");
  }

  // Initialize the game
  function displayHomepage() {
    clearCanvas();
    userTeamType = 0;
    $("#homepage").show();
    $("#gameTypeChoosingPage").hide();
    $("#teamSelectingPage").hide();
    $("#rankedGameEndedPage").hide();
  }

  $("#startGameButton").on("click", function () {
    console.log("Start");
    $("#homepage").hide();
    $("#gameTypeChoosingPage").show();
  });

  $("#chooseRankedModeButton").on("click", function () {
    $("#gameTypeChoosingPage").hide();
    $("#teamSelectingPage").show();
  });

  $("#chooseTeam1").on("click", function() {
    userTeamType = 1;
    $("#teamSelectingPage").hide();
    playRankedGame();
  });

  $("#chooseTeam2").on("click", function() {
    userTeamType = 2;
    $("#teamSelectingPage").hide();
    playRankedGame();
  });

  $("#chooseTeam3").on("click", function() {
    userTeamType = 3;
    $("#teamSelectingPage").hide();
    playRankedGame();
  });

  $("#chooseTeam4").on("click", function() {
    userTeamType = 4;
    $("#teamSelectingPage").hide();
    endRankedGame();
  });

  function playRankedGame() {
    
  }

  function endRankedGame() {
    //uploadScoreToDB();
    $("#rankedGameScore").text(rankedGameScore);
    $("#rankedGameEndedPage").show();
  }

  function uploadScoreToDB() {
    // 율원씨 구현부분
  }

  $("#restartRankedgameButton").on("click", function(){
    rankedGameScore = 0;
    playRankedGame();
  });

  $("#backToHomeButton").on("click", function(){
    displayHomepage();
  });

  displayHomepage();
});

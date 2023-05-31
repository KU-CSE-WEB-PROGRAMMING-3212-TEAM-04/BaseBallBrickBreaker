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

let walletBalance = 500.0; 
let bets = []; // store multiple bets

// DOM Elements
let walletDisplay = document.querySelector(".wallet h2");
let messageBox = document.createElement("div");
document.body.appendChild(messageBox);

let pcolor = document.querySelector(".color");
let pnum = document.querySelector(".number");
let pbigSmall = document.querySelector(".vinay");
let pperiod = document.querySelector(".pperiod");
let timerElement = document.querySelector("#timer");

let period = 202509020;
let seconds = 0;

// 🎯 Popup Modal
let popup = document.createElement("div");
popup.style.position = "fixed";
popup.style.top = "50%";
popup.style.left = "50%";
popup.style.transform = "translate(-50%, -50%)";
popup.style.background = "linear-gradient(135deg, #2fbc08ff, #ff8a65)";
popup.style.padding = "20px";
popup.style.borderRadius = "20px";
popup.style.color = "white";
popup.style.textAlign = "center";
popup.style.fontSize = "18px";
popup.style.display = "none";
popup.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
popup.style.zIndex = "9999";
document.body.appendChild(popup);

// Function to show popup (for win & lose)
function showPopup(isWin, amount = 0) {
  if (isWin) {
    popup.innerHTML = `
      <h2>🎉 Congratulations!</h2>
      <p>Winning amount: ₹${amount}</p>
    `;
  } else {
    popup.innerHTML = `
      <h2>❌ Sorry!</h2>
      <p>Try next time.</p>
    `;
  }
  popup.style.display = "block";

  // Auto close after 3 seconds
  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}

// Create input for custom bet
let betInput = document.createElement("input");
betInput.type = "number";
betInput.placeholder = "Enter bet amount";
betInput.style.margin = "10px";
betInput.style.width ="160px";
betInput.style.height="40px";
betInput.style.border="2px solid black";
betInput.style.boxShadow="2px 3px black";
betInput.style.borderRadius="12px";
document.body.insertBefore(betInput, document.querySelector(".game"));

// Update wallet display
function updateWallet() {
  walletDisplay.textContent = "₹" + walletBalance.toFixed(2);
}

// Betting Buttons
document.querySelector(".redbtn").addEventListener("click", () => placeBet("red"));
document.querySelector(".greenbtn").addEventListener("click", () => placeBet("green"));
document.querySelector(".voiletbtn").addEventListener("click", () => placeBet("voilet"));
document.querySelector(".big").addEventListener("click", () => placeBet("big"));
document.querySelector(".small").addEventListener("click", () => placeBet("small"));

// 🎯 Number Buttons (0–9 betting)
document.querySelectorAll(".numbers button").forEach((btn, index) => {
  btn.addEventListener("click", () => placeBet(index.toString()));
});

// Multiplier Buttons (x1, x5, x10, ...)
document.querySelectorAll(".bet-options button").forEach(btn => {
  btn.addEventListener("click", () => {
    let base = parseInt(betInput.value) || 0;
    let text = btn.textContent.trim();

    if (text.startsWith("x")) {
      let multiplier = parseInt(text.substring(1));
      betInput.value = base * multiplier || multiplier;
    } else if (text === "Random") {
      betInput.value = Math.floor(Math.random() * 500) + 50;
    }
  });
});

function placeBet(choice) {
  let enteredAmount = parseInt(betInput.value);

  if (isNaN(enteredAmount) || enteredAmount <= 0) {
    alert("Please enter a valid bet amount!");
    return;
  }
  if (walletBalance < enteredAmount) {
    alert("Not enough balance!");
    return;
  }

  walletBalance -= enteredAmount;
  updateWallet();

  bets.push({ choice: choice, amount: enteredAmount });
  let betLine = document.createElement("p");
  betLine.textContent = "Bet ₹" + enteredAmount + " on " + choice;
  messageBox.appendChild(betLine);

  betInput.value = "";
}

// Game Timer
function updateTimer() {
  seconds++;

  if (seconds === 300) {
    seconds = 0;
    period++;

    // update period
    pperiod.append(period);
    pperiod.append(document.createElement("br"));

    // random number
    let num = Math.floor(Math.random() * 10);
    let span = document.createElement("span");
    span.textContent = num;
    if(num % 2 === 0){
          span.style.color ="red";
    }else{
        pnum.style.color ="green";
      }
      pnum.append(span);
     pnum.append(document.createElement("br"));
  

    // Big/Small result
    let bigSmall = (num >= 5) ? "big" : "small";
    pbigSmall.append(bigSmall);
    pbigSmall.append(document.createElement("br"));

    // Color result
    let colorResult = "";
    if (num === 0) {
      colorResult = "voilet";
      pcolor.append("🔴🟣");
    } else if (num === 5) {
      colorResult = "voilet";
      pcolor.append("🟢🟣");
    } else if (num % 2 === 0) {
      colorResult = "red";
      pcolor.append("🔴");
    } else {
      colorResult = "green";
      pcolor.append("🟢");
    }
    pcolor.append(document.createElement("br"));

    // 🎯 Check all bets
    if (bets.length > 0) {
      let results = [];
      let winFound = false;
      let totalWin = 0;

      bets.forEach(bet => {
        if (bet.choice === bigSmall || bet.choice === colorResult) {
          let winAmt = bet.amount * 2;
          walletBalance += winAmt;
          totalWin += winAmt;
          winFound = true;
          results.push("✅ WON: ₹" + bet.amount + " on " + bet.choice + " → +" + winAmt);
        } 
        else if (bet.choice === num.toString()) {
          let jackpot = bet.amount * 10;
          walletBalance += jackpot;
          totalWin += jackpot;
          winFound = true;
          results.push("🎉 JACKPOT WIN: ₹" + bet.amount + " on " + bet.choice + " → +" + jackpot);
        }
        else {
          results.push("❌ LOST: ₹" + bet.amount + " on " + bet.choice);
        }
      });
      
      messageBox.innerHTML = "<b>Round Results:</b><br>" + results.join("<br>");
      updateWallet();

      // Show popup
      if (winFound) {
        showPopup(true, totalWin);
      } else {
        showPopup(false);
      }

      bets = []; // clear for next round
    }
  }

  // update seconds display
  timerElement.innerText = "00:" + seconds.toString().padStart(2, "0");
}

setInterval(updateTimer, 1000);
updateWallet();
// 🔥 Number Guessing Game 🔥
// Rules: Guess the number between 1 and 100. The computer will roast you accordingly.

const compGuess = Math.floor(Math.random() * 100) + 1; // ✅ Fixed random number generation
let userGuess;

alert("Welcome to the Ultimate Number Guessing Game! 🎯");
alert("Think you're a mind reader? Let's see if you can guess my secret number! 🤨");

while (true) {
    userGuess = Number(prompt("Enter a number between 1 and 100: "));

    if (isNaN(userGuess)) {
        alert("Bruh, that's not even a number. Try again. 🙄");
        continue; // Restart loop
    }

    if (userGuess < 1 || userGuess > 100) {
        alert("You clearly don't follow instructions... 😤 The number is between 1 and 100!");
        continue; // Restart loop
    }

    if (userGuess < compGuess) {
        alert("Nah!! Your expectations are too low. Aim higher! 📈");
    } else if (userGuess > compGuess) {
        alert("Whoa there, dream big, but not **that** big! 📉 Try a smaller number.");
    } else {
        alert("🎉 OMG!! YOU JUST WON! 🎉");
        alert("I knew you could do it... eventually. 😎");
        break; // 🎯 Exit loop when guessed correctly
    }
}

// Generate Confetti Effect
            function createConfetti() {
                for (let i = 0; i < 100; i++) {
                    let confetti = document.createElement("div");
                    confetti.classList.add("confetti");
                    document.body.appendChild(confetti);
                    confetti.style.left = Math.random() * 100 + "vw";
                    confetti.style.animationDuration = (Math.random() * 3 + 2) + "s";
                    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
                }
            }

            createConfetti(); // Run Confetti

            // Share Feature
            function shareWin() {
                const shareText = "🎉 I just won the Ultimate Number Guessing Game! Try it now !! ";
                const shareURL = window.location.href;

                if (navigator.share) {
                    navigator.share({
                        title: "I WON THE NUMBER GUESSING GAME!",
                        text: shareText,
                        url: shareURL
                    }).then(() => console.log("Shared successfully"))
                        .catch(err => console.log("Sharing failed:", err));
                } else {
                    prompt("Copy this and share:", shareText + "\n" + shareURL);
                }
            }

if(userGuess===compGuess){
    document.getElementById
}

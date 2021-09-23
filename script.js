// TODOS:
// 1. Add highscore option --> add error message to DOM when no initials input, add highscore table when view highscores button clicked
// 2. Add more questions -- done -> still want to add more to complete #4 below
// 3. Change logic to choose random questions, and stop at 5
// 4. Add styles for game-over-container class

// DOM variables
const timer = document.querySelector('.timer');
const startButton = document.querySelector('.start-button');
const mainContainer = document.querySelector('.main-container');
const viewHighscores = document.querySelector('.view-highscores')

// const playButton = (buttonText) => {
//     return document.createElement('button').innerHTML = `<button class="play-button">${buttonText}</button>`
// }

const titleScreen = `<div class="title-screen">
<h1>Coding Quiz Challenge</h1>
<p>Try to answer the following code-related questions within the time limit.  Keep in mind that incorrect answers will penalize your time!</p>
<button class="play-button">Start Game</button>
</div>`;

mainContainer.innerHTML = titleScreen;

const removeAllChildren = (el) => {
    while (el.firstChild) {
    el.removeChild(el.firstChild);
    }
}

const buildQuestion = (questionObject) => {
    // Create question title
    let questionTitleEl = document.createElement('div');
    questionTitleEl.className = 'question-title';
    questionTitleEl.textContent = questionObject.question;

    // Create ul and add an li for each answer
    let answersEl = document.createElement('ul');
    answersEl.className = 'answers';
    questionObject.answers.forEach((answer) => {
        let answerLi = document.createElement('li');
        let answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        if(answer.correct){
            answerDiv.setAttribute('data-correct', 'correct');
        };
        answerDiv.textContent = answer.answer;
        answerLi.appendChild(answerDiv);
        answersEl.appendChild(answerLi);
    });

    // Create question element and append with title and answers
    let questionEl = document.createElement('div');
    questionEl.className = 'question';
    questionEl.appendChild(questionTitleEl);
    questionEl.appendChild(answersEl);

    // Add question element to DOM
    mainContainer.appendChild(questionEl);
}

const gameOverMessage = () => {
    removeAllChildren(mainContainer)
    let gameOverContainer = document.createElement('div');
    // TODO: add styles for class 'game-over-container'
    gameOverContainer.className = 'game-over-container';
    let gameOverContainerHTML = `
        <h1>Game Over</h1>
        <div class="score">Your Score: <span class="score-span">${quiz.stats.score}</span></div>
        <div class="time-left">Time Remaining: <span class="time-span">${quiz.stats.timeLeft}</span></div>
        <form>
            <label>Add Initials:</label>
            <input type="text" id="initials-input"></input>
            <button id="submit-highscore">Submit</button>
        </form>
        <button class="play-button">Play Again</button>
    `;
    gameOverContainer.innerHTML = gameOverContainerHTML;
    mainContainer.appendChild(gameOverContainer);
    timer.textContent = '-';
}

const showHighscores = () => {
    removeAllChildren(mainContainer)
    let highscoresContainer = document.createElement('div');
    highscoresContainer.className = 'highscores-container'
    let highscoresContainerHTML = `${getHighscoresTable()} <button class="back-button">Back</button>`
    highscoresContainer.innerHTML = highscoresContainerHTML
    mainContainer.appendChild(highscoresContainer)
}

const getHighscoresTable = () => {
    // Get highscores array from local storage
    // Sort array into top 10 scores
    // Return HTML table based on top 10 scores 
    return `<div>this will be the highscores table</div>`
}

const logHighscore = (name, score, timeLeft) => {
    let currentHighscores;
    if(localStorage.getItem('highscores') !== null) {
        currentHighscores = JSON.parse(localStorage.getItem('highscores'))
    } else {
        currentHighscores = [] 
    }
    currentHighscores.push({name, score, timeLeft})
    localStorage.setItem('highscores', JSON.stringify(currentHighscores))
}


let startTime = 60;

const quiz = {
    stats: {
        timeLeft: startTime,
        score: 0
    },
    timerId: '',
    penalty: 5,
    currentQuestion: 0,
    questions: [...questions],
    startTimer: function() {
        timer.textContent = this.stats.timeLeft;
        const setTimer = () =>  {
            // If there is time left, remove 1 second, else stop the timer and end the game
            if(this.stats.timeLeft > 1) {
                this.stats.timeLeft--;
                timer.textContent = this.stats.timeLeft;
            } else {
                // this.stats.timeLeft --
                // timer.textContent = this.stats.timeLeft
                this.endGame();
            };
        };
        this.timerId = setInterval(setTimer, 1000);
    },
    stopTimer: function(id) {
        clearInterval(id);
    },
    startGame: function () {
        this.resetGame()
        viewHighscores.style.opacity = 0;
        this.startTimer();
        buildQuestion(this.questions[0]);
        this.currentQuestion ++;
    },
    endGame: function() {
        this.stopTimer(this.timerId);
        gameOverMessage();
        viewHighscores.style.opacity = 1;
    },
    resetGame: function() {
        this.stats.timeLeft = startTime;
        this.stats.score = 0;
        this.currentQuestion = 0;
    }
};


// Event Listeners

// Start button
mainContainer.addEventListener('click', (e) => {
    if(e.target.className === 'play-button') {
        removeAllChildren(mainContainer);
        quiz.startGame();
    }
})

// Back button
mainContainer.addEventListener('click', (e) => {
    if(e.target.className === 'back-button') {
        removeAllChildren(mainContainer)
        mainContainer.innerHTML = titleScreen;
    }
})

// Play button
// mainContainer.addEventListener('click', (e) => {
//     if(e.target.className === 'play-button') {
//         e.target.parentNode.remove();
//         quiz.resetGame();
//         quiz.startGame();
//     }
// })

mainContainer.addEventListener('click', (e) => {
    if(e.target.className === 'answer') {
        let answer = e.target

        // Evaluate answer
        if(answer.getAttribute('data-correct')) {
            quiz.stats.score ++;
            // Display 'correct' message on screen
            console.log('correct');
        } else {
            // Subtract penalty from timeLeft
            if(quiz.stats.timeLeft - quiz.penalty > 0) {
                quiz.stats.timeLeft -= quiz.penalty;
                timer.textContent = quiz.stats.timeLeft;
            } else {
                quiz.stats.timeLeft = 0;
                timer.textContent = quiz.stats.timeLeft;
            }
            // Display 'wrong -5 seconds' message on screen
            console.log('wrong');
        }

        // Remove question from DOM
        removeAllChildren(mainContainer)

        // If there are more questions, build one, else end game
        if(quiz.currentQuestion <= quiz.questions.length - 1) {
            buildQuestion(quiz.questions[quiz.currentQuestion]);
            quiz.currentQuestion ++;
        } else {
            quiz.endGame();
        }
    };
});

mainContainer.addEventListener('click', (e) => {
    if(e.target.id === 'submit-highscore') {
        e.preventDefault();
        let initials = document.querySelector('#initials-input').value
        if(initials == '') {
            // Add this to the DOM
            console.log('please enter initials to submit your score')
        } else {
            logHighscore(initials, quiz.stats.score, quiz.stats.timeLeft)
            showHighscores()
        }
    }
})

viewHighscores.addEventListener('click', showHighscores)
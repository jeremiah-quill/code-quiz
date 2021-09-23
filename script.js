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
const playAgainButton = document.createElement('button').innerHTML = `<button class="play-again-button">Play</button>`

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
    let gameOverContainer = document.createElement('div');
    // TODO: add styles for class 'game-over-container'
    gameOverContainer.className = 'game-over-container';
    let gameOverContainerHTML = `
        <h1>Game Over</h1>
        <div class="score">Your Score: <span class="score-span">${quiz.stats.score}</span></div>
        <div class="time-left">Time Remaining: <span class="time-span">${quiz.stats.timeLeft}</span></div>
        ${playAgainButton}
        <form>
            <label>Add Initials:</label>
            <input type="text" id="initials-input"></input>
            <button id="submit-highscore">Submit</button>
        </form>
    `;
    gameOverContainer.innerHTML = gameOverContainerHTML;
    mainContainer.appendChild(gameOverContainer);
    timer.textContent = '-';
}

const showHighscores = () => {
    // remove all children from mainContainer
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
    // Add Highscores container, table, and play again button to screen
    let highscoresContainer = document.createElement('div');
    highscoresContainer.className = 'highscores-container'
    let highscoresContainerHTML = `${getHighscoresTable()} ${playAgainButton}`
    highscoresContainer.innerHTML = highscoresContainerHTML
    mainContainer.appendChild(highscoresContainer)
}

const getHighscoresTable = () => {
    // Get highscores array from local storage


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



let time = 60;

const quiz = {
    stats: {
        timeLeft: time,
        score: 0
    },
    timerId: '',
    penalty: 5,
    currentQuestion: 0,
    questions: [...questions],
    isTimeLeft: function() {
        return this.stats.timeLeft >= 1;
    },
    isQuestionsLeft: function() {
        return this.currentQuestion <= this.questions.length - 1;
    },
    startTimer: function() {
        timer.textContent = this.stats.timeLeft;
        const setTimer = () =>  {
            // If there is time left, remove 1 second, else stop the timer and end the game
            if(this.isTimeLeft()) {
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
    subtractTime: function(seconds) {
        if(this.stats.timeLeft - seconds < 0) {
            this.stats.timeLeft = 0;
            timer.textContent = this.stats.timeLeft;
        } else {
            this.stats.timeLeft -= seconds;
            timer.textContent = this.stats.timeLeft;
        };
    },
    isAnswerCorrect: function(answer) {
        if(answer.getAttribute('data-correct')) {
            this.stats.score ++;
            // Display 'correct' message on screen
            console.log('correct');
        } else {
            this.subtractTime(this.penalty);
            // Display 'wrong -5 seconds' message on screen
            console.log('wrong');
        }
    },
    nextQuestion: function() {
        // If there are more questions, build one, else stop timer and game
        if(this.isQuestionsLeft()) {
            buildQuestion(this.questions[this.currentQuestion]);
            this.currentQuestion ++;
        } else {
            this.endGame();
        }
    },
    startGame: function () {
        viewHighscores.style.opacity = 0;
        this.startTimer();
        buildQuestion(this.questions[0]);
        this.currentQuestion ++;
    },
    endGame: function() {
        this.stopTimer(this.timerId);
        // If there is a question remaining on the screen (time ran out), remove it --> should I put this here?
        if(mainContainer.childNodes.length) {
            mainContainer.childNodes[0].remove();
        };
        gameOverMessage();
        viewHighscores.style.opacity = 1;
    },
    resetGame: function() {
        this.stats.timeLeft = time;
        this.stats.score = 0;
        this.currentQuestion = 0;
    }
};


// Event Listeners

// start game
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    quiz.startGame();
});

// play again
mainContainer.addEventListener('click', (e) => {
    if(e.target.className === 'play-again-button') {
        // gameOverContainer.style.display = 'none';
        e.target.parentNode.remove();
        quiz.resetGame();
        quiz.startGame();
    }
})

// answer question
mainContainer.addEventListener('click', (e) => {
    if(e.target.className === 'answer') {
        // Evaluate answer
        quiz.isAnswerCorrect(e.target);
        // Remove question from DOM
        e.target.parentNode.parentNode.parentNode.remove();
        // Show the next question
        quiz.nextQuestion();
    };
});

// submit highscore
mainContainer.addEventListener('click', (e) => {
    if(e.target.id === 'submit-highscore') {
        e.preventDefault();
        let initials = document.querySelector('#initials-input').value
        if(initials == '') {
            // Add this to the DOM
            console.log('please enter initials to submit your score')
        } else {
            logHighscore(initials, quiz.stats.score, quiz.stats.timeLeft)
        }
        showHighscores()
    }
})



viewHighscores.addEventListener('click', showHighscores)


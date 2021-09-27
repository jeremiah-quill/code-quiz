// DOM variables
const timer = document.querySelector('.timer');
const startButton = document.querySelector('.start-button');
const mainContainer = document.querySelector('.main-container');
const viewHighscores = document.querySelector('.view-highscores')
const messageContainer = document.querySelector('.message-container')

const titleScreen = `<div class="title-screen">
<h1>Coding Quiz Challenge</h1>
<p>Try to answer the following code-related questions within the time limit.  Keep in mind that incorrect answers will penalize your time!</p>
<button class="play-button">Start Game</button>
</div>`;


// Functions
const emptyContainer = (el) => {
    while (el.firstChild) {
    el.removeChild(el.firstChild);
    }
}

const renderQuestion = (questionObject) => {
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

const renderGameOver = () => {
    emptyContainer(mainContainer)
    let gameOverContainer = document.createElement('div');
    gameOverContainer.className = 'game-over-container';
    gameOverContainer.innerHTML = `
    <h1>Game Over</h1>
    <div class="score">Your Score: <span class="score-span">${quiz.stats.score}</span></div>
    <div class="time-left">Time Remaining: <span class="time-span">${quiz.stats.timeLeft}</span></div>
    <form>
        <label>Add Initials:</label>
        <input type="text" id="initials-input" maxlength="3"></input>
        <button id="submit-highscore">Submit</button>
    </form>
    <button class="back-button">Play Again</button>`
    mainContainer.appendChild(gameOverContainer);
    timer.textContent = '-';
}

const renderHighscores = () => {
    emptyContainer(mainContainer)
    // Create highscores container
    let highscoresContainer = document.createElement('div');
    highscoresContainer.className = 'highscores-container'

    // Get highscores table, and create back button
    let highscores = getHighscoresTable();
    let backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = 'Back'

    // Add highscores table and button to highscores container, and add to main container
    highscoresContainer.appendChild(highscores);
    highscoresContainer.appendChild(backButton)
    mainContainer.appendChild(highscoresContainer)
}

const getHighscoresTable = () => {
    if(localStorage.getItem('highscores') !== null) {
        currentHighscores = JSON.parse(localStorage.getItem('highscores'))
        // Create a table with header row
        let table = document.createElement('table');
        table.innerHTML = `
        <tr>
        <th>Player</th>
        <th>Score</th>
        <th>Time Remaining</th>
        </tr>`

        // Sort highscores by score and then by time left.  Only take the top 5
        let sortedScores = currentHighscores.sort((a, b) => (a.score < b.score) ? 1 : (a.score === b.score) ? ((a.timeLeft < b.timeLeft) ? 1 : -1) : -1 )
        let topFive = sortedScores.slice(0, 5)

        // Add a row for each player score and append it to the table
        topFive.forEach((score) => {
            let row = table.insertRow()
            row.innerHTML = `
            <td>${score.name}</td>
            <td>${score.score}</td>
            <td>${score.timeLeft}</td>
            `;
            table.appendChild(row)
        })
    return table

    } else {
        let div = document.createElement('div');
        div.textContent = 'No Current Highscores'
        return div
    }
}

const logHighscore = (name, score, timeLeft) => {
    if(localStorage.getItem('highscores') !== null) {
        currentHighscores = JSON.parse(localStorage.getItem('highscores'));
    } else {
        currentHighscores = [];
    };
    currentHighscores.push({name, score, timeLeft});
    localStorage.setItem('highscores', JSON.stringify(currentHighscores));
};

const displayMessage = (className, text) => {
    let message = document.createElement('div');
    message.className = className
    message.textContent = text
    messageContainer.appendChild(message)
    setTimeout(() => {
        messageContainer.removeChild(message);
    }, 500)
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
            if(this.stats.timeLeft >= 1) {
                this.stats.timeLeft--;
                timer.textContent = this.stats.timeLeft;
            } else {
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
        viewHighscores.style.visibility = 'hidden'
        this.startTimer();
        renderQuestion(this.questions[0]);
        this.currentQuestion ++;
    },
    endGame: function() {
        this.stopTimer(this.timerId);
        renderGameOver();
    },
    resetGame: function() {
        this.stats.timeLeft = startTime;
        this.stats.score = 0;
        this.currentQuestion = 0;
    }
};


// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    mainContainer.innerHTML = titleScreen
});

// Start button
mainContainer.addEventListener('click', (e) => {
    if(e.target.className === 'play-button') {
        emptyContainer(mainContainer);
        quiz.startGame();
    }
})

// Back button
mainContainer.addEventListener('click', (e) => {
    if(e.target.className === 'back-button') {
        emptyContainer(mainContainer)
        viewHighscores.style.visibility = 'visible';
        mainContainer.innerHTML = titleScreen;
    }
})

// Answer question
mainContainer.addEventListener('click', (e) => {
    if(e.target.className === 'answer') {
        let answer = e.target

        // Evaluate answer
        if(answer.getAttribute('data-correct')) {
            quiz.stats.score ++;
            displayMessage('correct', `Correct!`)
        } else {
            displayMessage('wrong', `Wrong! -${quiz.penalty} Seconds`)

            // Subtract penalty from timeLeft
            if(quiz.stats.timeLeft - quiz.penalty > 0) {
                quiz.stats.timeLeft -= quiz.penalty;
                timer.textContent = quiz.stats.timeLeft;
            } else {
                quiz.stats.timeLeft = 0;
                timer.textContent = quiz.stats.timeLeft;
            }
        }

        // Remove question from DOM
        emptyContainer(mainContainer)

        // If there are more questions, build one, else end game
        if(quiz.currentQuestion <= quiz.questions.length - 1) {
            renderQuestion(quiz.questions[quiz.currentQuestion]);
            quiz.currentQuestion ++;
        } else {
            quiz.endGame();
        }
    };
});




// Submit highscore
mainContainer.addEventListener('click', (e) => {
    if(e.target.id === 'submit-highscore') {
        e.preventDefault();
        let initials = document.querySelector('#initials-input').value
        if(initials == '') {
            let input = document.querySelector('input');
            input.style.border = '2px solid red'
            setTimeout(() => {
                input.style.border = '1px solid black'
            }, 1000)
        } else {
            logHighscore(initials, quiz.stats.score, quiz.stats.timeLeft)
            renderHighscores()
        }
    }
})

viewHighscores.addEventListener('click', () => {
    viewHighscores.style.visibility = 'hidden';
    renderHighscores()
})
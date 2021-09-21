// Todos:
// 1. Add highscore option
// 2. Add replay button somewhere -- done -> is it in the right spot
// 3. Add more questions -- done -> still want to add more to complete #4 below
// 4. Change logic to choose random questions, and stop at 5
// 5. Question within endGame

// DOM variables
const timer = document.querySelector('.timer')
const startButton = document.querySelector('.start-button')
const questionContainer = document.querySelector('.question-container')
const gameOverContainer = document.querySelector('.game-over-container')
const playAgainButton = document.querySelector('.play-again-button')


const questions = [
    {
        question: 'Which built-in method calls a function for each element in the array?',
        answers: [
            {answer: 'while()',
            correct: false},
            {answer: 'loop()',
            correct: false},
            {answer: 'forEach()',
            correct: true},
            {answer: 'none of the above',
            correct: false},]
    },
    {
        question: 'How does a FOR loop start?',
        answers: [
            {answer: 'for(i=0; i<=5)',
            correct: false},
            {answer: 'for(i<=5; i++)',
            correct: false},
            {answer: 'for(i = 1 to 5)',
            correct: false},
            {answer: 'for(i=0; i<=5; i++)',
            correct: true},]
    },
    {
        question: 'Commonly used data types DO NOT include:',
        answers: [
            {answer: 'strings',
            correct: false},
            {answer: 'booleans',
            correct: false},
            {answer: 'alerts',
            correct: true},
            {answer: 'numbers',
            correct: false},]
    }, 
    {
        question: 'The condition in an if/else statement is enclosed in _____',
        answers: [
            {answer: 'parentheses',
            correct: true},
            {answer: 'quotes',
            correct: false},
            {answer: 'curly braces',
            correct: false},
            {answer: 'square brackets',
            correct: false},]
    }, 
    {
        question: 'Arrays in javascript can be used to store:',
        answers: [
            {answer: 'numbers and strings',
            correct: false},
            {answer: 'other arrays',
            correct: false},
            {answer: 'booleans',
            correct: false},
            {answer: 'all of the above',
            correct: true},]
    }, 
]

const buildQuestion = (questionObject) => {
    // Create question title
    let questionTitleEl = document.createElement('div')
    questionTitleEl.className = 'question-title'
    questionTitleEl.textContent = questionObject.question

    // Create ul and add an li for each answer
    let answersEl = document.createElement('ul')
    answersEl.className = 'answers'
    questionObject.answers.forEach((answer) => {
        let answerLi = document.createElement('li')
        let answerDiv = document.createElement('div')
        answerDiv.className = 'answer'
        if(answer.correct){
            answerDiv.setAttribute('data-correct', 'correct')
        }
        answerDiv.textContent = answer.answer
        answerLi.appendChild(answerDiv)
        // answerEl.textContent = answer.answer
        answersEl.appendChild(answerLi)
    })

    // Create question element and append with title and answers
    let questionEl = document.createElement('div')
    questionEl.className = 'question'
    questionEl.appendChild(questionTitleEl)
    questionEl.appendChild(answersEl)

    // Add question element to DOM
    questionContainer.appendChild(questionEl);
}

const gameOverMessage = () => {
    gameOverContainer.style.display = 'block';
    document.querySelector('.score-span').textContent = quiz.stats.score
    document.querySelector('.time-span').textContent = quiz.stats.timeLeft
}


const quiz = {
    playerInitials: '',
    stats: {
        timeLeft: 30,
        score: 0
    },
    timerId: '',
    penalty: 5,
    currentQuestion: 0,
    questions: [...questions],
    isTimeLeft: function() {
        return this.stats.timeLeft >= 1
    },
    isQuestionsLeft: function() {
        return this.currentQuestion <= this.questions.length - 1
    },
    startTimer: function() {
        timer.textContent = this.stats.timeLeft
        const setTimer = () =>  {
            // If there is time left, remove 1 second, else stop the timer and end the game
            if(this.isTimeLeft()) {
                this.stats.timeLeft--
                timer.textContent = this.stats.timeLeft
            } else {
                // this.stats.timeLeft --
                // timer.textContent = this.stats.timeLeft
                this.endGame()
            }
        }
        this.timerId = setInterval(setTimer, 1000)
    },
    stopTimer: function(id) {
        clearInterval(id)
    },
    subtractTime: function(seconds) {
        if(this.stats.timeLeft - seconds < 0) {
            this.stats.timeLeft = 0;
            timer.textContent = this.stats.timeLeft
        } else {
            this.stats.timeLeft -= seconds
            timer.textContent = this.stats.timeLeft
        }
    },
    isAnswerCorrect: function(answer) {
        if(answer.getAttribute('data-correct')) {
            this.stats.score ++
            // Display 'correct' message on screen
            console.log('correct')
        } else {
            this.subtractTime(this.penalty)
            // Display 'wrong -5 seconds' message on screen
            console.log('wrong')
        }
    },
    nextQuestion: function() {
        // If there are more questions, build one, else stop timer and game
        if(this.isQuestionsLeft()) {
            buildQuestion(this.questions[this.currentQuestion])
            this.currentQuestion ++
        } else {
            this.endGame()
        }
    },
    startGame: function () {
        this.startTimer()
        buildQuestion(this.questions[0])
        this.currentQuestion ++
    },
    endGame: function() {
        this.stopTimer(this.timerId)
        // If there is a question remaining on the screen (time ran out), remove it --> should I put this here?
        if(questionContainer.childNodes.length) {
            questionContainer.childNodes[0].remove()
        }
        gameOverMessage()
    },
    resetGame: function() {
        this.stats.timeLeft = 30;
        this.stats.score = 0
        this.currentQuestion = 0;
    }
}


// Event Listeners
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    quiz.startGame()
})

playAgainButton.addEventListener('click', () => {
    gameOverContainer.style.display = 'none'
    quiz.resetGame()
    quiz.startGame()
})

questionContainer.addEventListener('click', (e) => {
    if(e.target.className === 'answer') {
        // Evaluate answer
        quiz.isAnswerCorrect(e.target);
        // Remove question from DOM
        e.target.parentNode.parentNode.parentNode.remove()
        // Show the next question
        quiz.nextQuestion()
    }
})









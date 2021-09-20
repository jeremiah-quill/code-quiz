// DOM variables
const timer = document.querySelector('.timer')
const startButton = document.querySelector('.start-button')
const questionContainer = document.querySelector('.question-container')

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
            {answer: 'None of the above',
            correct: false},]
    },
    {
        question: 'Question 2',
        answers: [
            {answer: 'answer 1',
            correct: true},
            {answer: 'answer 2',
            correct: false},
            {answer: 'answer 3',
            correct: false},
            {answer: 'answer 4',
            correct: false},]
    },
    {
        question: 'Question 3',
        answers: [
            {answer: 'answer 1',
            correct: false},
            {answer: 'answer 2',
            correct: false},
            {answer: 'answer 3',
            correct: false},
            {answer: 'answer 4',
            correct: true},]
    }, 
    {
        question: 'Question 4',
        answers: [
            {answer: 'answer 1',
            correct: false},
            {answer: 'answer 2',
            correct: false},
            {answer: 'answer 3',
            correct: false},
            {answer: 'answer 4',
            correct: true},]
    }, 
    {
        question: 'Question 5',
        answers: [
            {answer: 'answer 1',
            correct: false},
            {answer: 'answer 2',
            correct: false},
            {answer: 'answer 3',
            correct: false},
            {answer: 'answer 4',
            correct: true},]
    }, 
]

const buildQuestion = (questionObject) => {
    // Create question title
    let questionTitleEl = document.createElement('div')
    questionTitleEl.className = 'question-title'
    questionTitleEl.textContent = questionObject.question

    // Create answers ul and add an li for each answer
    let answersEl = document.createElement('ul')
    answersEl.className = 'answers'
    questionObject.answers.forEach((answer) => {
        let answerEl = document.createElement('li')
        answerEl.className = 'answer'
        if(answer.correct){
            answerEl.setAttribute('data-correct', 'correct')
        }
        answerEl.textContent = answer.answer
        answersEl.appendChild(answerEl)
    })

    // Create question element and append with title and answers
    let questionEl = document.createElement('div')
    questionEl.classname = 'question'
    questionEl.appendChild(questionTitleEl)
    questionEl.appendChild(answersEl)

    // Add question element to DOM
    questionContainer.appendChild(questionEl);
}


const quiz = {
    player: '',
    stats: {
        timeLeft: 30,
        score: 0
    },
    timerId: '',
    penalty: 5,
    isGameRunning: false,
    currentQuestion: 0,
    questions: [...questions],
    isTimeLeft: function() {
        return this.stats.timeLeft > 0
    },
    isQuestionsLeft: function() {
        return this.questions.length
    },
    startTimer: function() {
        timer.textContent = this.stats.timeLeft
        const setTimer = () =>  {
            // If there is time left, remove 1 second, else stop the timer and end the game
            if(this.isTimeLeft()) {
                this.stats.timeLeft --
                timer.textContent = this.stats.timeLeft
            } else {
                this.stopTimer(this.timerId)
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
    startGame: function () {
        startButton.style.display = 'none';
        this.isGameRunning = true;
        this.startTimer()
        buildQuestion(this.questions[this.currentQuestion])
        this.currentquestion ++
    },
    endGame: function() {
        console.log(`Your score is ${this.stats.score} and you finished with ${this.stats.timeLeft} seconds left`)
    }
}




// Event Listeners
startButton.addEventListener('click', () => {
    quiz.startGame()
})

questionContainer.addEventListener('click', (e) => {
    // Evaluate answer.  If correct, add 1 to score, if incorrect subtract penalty time
    if(e.target.className === 'answer') {
        if(e.target.getAttribute('data-correct')) {
            quiz.stats.score ++
            console.log('correct answer')
        } else {
            quiz.subtractTime(quiz.penalty)
            console.log('wrong answer')
        }

        // Remove question from DOM and also from questions array
        e.target.parentNode.parentNode.remove()
        quiz.questions.shift()
        
        // If there are more questions, build another question, else game over
        if(quiz.isQuestionsLeft()) {
            buildQuestion(quiz.questions[quiz.currentQuestion])
        } else {
            quiz.stopTimer(quiz.timerId)
            quiz.endGame()
        }
    }
})









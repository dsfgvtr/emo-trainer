// ===== CONSTANTS (SCREAM_CASE) =====
const QUESTIONS_DATA = [
    {
        id: 1,
        image: 'images/greens.png',
        alt: 'Зелень',
        correctAnswer: 'ЗЕЛЕНЬ',
        hint: 'Напишите: Зелень'
    },
    {
        id: 2,
        image: 'images/auchan.png',
        alt: 'Ашан',
        correctAnswer: 'АШАН',
        hint: 'Напишите: Ашан'
    },
    {
        id: 3,
        image: 'images/building.png',
        alt: 'Здание',
        correctAnswer: 'ТЮМЕНЬ',
        hint: 'Напишите: Тюмень'
    },
    {
        id: 4,
        image: 'images/roller.png',
        alt: 'Дорожный каток',
        correctAnswer: 'КАТОК',
        hint: 'Напишите: Каток'
    },
    {
        id: 5,
        image: 'images/ice-rink.png',
        alt: 'Ледовый каток',
        correctAnswer: 'КАТОК',
        hint: 'Напишите: Каток'
    }
];

const STORAGE_KEY = 'emo_trainer_answers';
const MAX_QUESTIONS = 5;

// ===== CLASS: TrainerApp (PascalCase) =====
class TrainerApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.elements = {};

        this.initializeElements();
        this.initializeTrainer();
        this.attachEventListeners();
    }

    // ===== Initialize DOM Elements =====
    initializeElements() {
        this.elements = {
            questionCard: document.querySelector('.question-card'),
            questionImage: document.getElementById('questionImage'),
            inputLabel: document.getElementById('questionHint'),
            answerInput: document.getElementById('answerInput'),
            checkButton: document.getElementById('checkButton'),
            closeButton: document.getElementById('closeButton'),
            numberBadges: document.querySelectorAll('.number-badge')
        };
    }

    // ===== Initialize Trainer =====
    initializeTrainer() {
        this.shuffleQuestions();
        this.userAnswers = new Array(QUESTIONS_DATA.length).fill(null);
        this.currentQuestionIndex = 0;
        this.renderQuestion();
        this.updateProgressIndicator();
    }

    // ===== Shuffle Questions (Fisher-Yates Algorithm) =====
    shuffleQuestions() {
        this.questions = [...QUESTIONS_DATA];

        for (let currentIndex = this.questions.length - 1; currentIndex > 0; currentIndex--) {
            const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
            [this.questions[currentIndex], this.questions[randomIndex]] =
            [this.questions[randomIndex], this.questions[currentIndex]];
        }
    }

    // ===== Render Current Question =====
    renderQuestion() {
        const currentQuestion = this.questions[this.currentQuestionIndex];

        if (!currentQuestion || !this.elements.questionCard) {
            this.showAnswersTable();
            return;
        }

        this.elements.questionImage.src = currentQuestion.image;
        this.elements.questionImage.alt = currentQuestion.alt;
        this.elements.inputLabel.textContent = currentQuestion.hint;
        this.elements.answerInput.value = '';
        this.elements.answerInput.disabled = false;
        this.elements.answerInput.focus();

        this.updateProgressIndicator();
        this.saveProgress();
    }

    // ===== Update Progress Indicator =====
    updateProgressIndicator() {
        if (!this.elements.numberBadges.length) {
            return;
        }

        this.elements.numberBadges.forEach((badge, index) => {
            badge.classList.remove('completed', 'current');

            if (index < this.currentQuestionIndex) {
                badge.classList.add('completed');
            } else if (index === this.currentQuestionIndex) {
                badge.classList.add('current');
            }
        });
    }

    // ===== Check Answer =====
    checkAnswer() {
        const userInput = this.elements.answerInput.value.trim().toUpperCase();
        const currentQuestion = this.questions[this.currentQuestionIndex];

        if (!userInput) {
            this.showNotification('Введите ответ!', 'warning');
            return;
        }

        const isCorrect = userInput === currentQuestion.correctAnswer;

        this.userAnswers[this.currentQuestionIndex] = {
            question: currentQuestion,
            userAnswer: userInput,
            isCorrect: isCorrect
        };

        this.elements.answerInput.disabled = true;

        this.showNotification(
            isCorrect ? 'Правильно! ✓' : `Неправильно. Правильный ответ: ${currentQuestion.correctAnswer}`,
            isCorrect ? 'success' : 'error'
        );

        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }

    // ===== Next Question =====
    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= MAX_QUESTIONS) {
            this.showAnswersTable();
        } else {
            this.renderQuestion();
        }
    }

    // ===== Show Answers Table =====
    showAnswersTable() {
        window.location.href = 'answers.html';
    }

    // ===== Restart Trainer =====
    restartTrainer() {
        localStorage.removeItem(STORAGE_KEY);
        this.initializeTrainer();
        this.showNotification('Тренажёр перезапущен!', 'info');
    }

    // ===== Save Progress to localStorage =====
    saveProgress() {
        const progressData = {
            questions: this.questions,
            currentQuestionIndex: this.currentQuestionIndex,
            userAnswers: this.userAnswers
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    }

    // ===== Load Progress from localStorage =====
    loadProgress() {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                this.questions = parsedData.questions || QUESTIONS_DATA;
                this.currentQuestionIndex = parsedData.currentQuestionIndex || 0;
                this.userAnswers = parsedData.userAnswers || [];
                return true;
            } catch (error) {
                console.error('Failed to load progress:', error);
                return false;
            }
        }
        return false;
    }

    // ===== Show Notification =====
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('notification-hide');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // ===== Attach Event Listeners =====
    attachEventListeners() {
        if (this.elements.checkButton) {
            this.elements.checkButton.addEventListener('click', () => this.checkAnswer());
        }

        if (this.elements.answerInput) {
            this.elements.answerInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.checkAnswer();
                }
            });
        }

        if (this.elements.closeButton) {
            this.elements.closeButton.addEventListener('click', () => this.restartTrainer());
        }

        window.addEventListener('beforeunload', () => this.saveProgress());
    }
}

// ===== CLASS: AnswersTable (PascalCase) =====
class AnswersTable {
    constructor() {
        this.tableBody = document.getElementById('answersTableBody');
        this.userAnswers = this.loadAnswers();
        this.render();
        this.attachEventListeners();
    }

    // ===== Load Answers from localStorage =====
    loadAnswers() {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                return parsedData.userAnswers || [];
            } catch (error) {
                console.error('Failed to load answers:', error);
                return [];
            }
        }
        return [];
    }

    // ===== Render Table =====
    render() {
        if (!this.tableBody || !this.userAnswers.length) {
            return;
        }

        this.tableBody.innerHTML = '';

        this.userAnswers.forEach((answerData, index) => {
            if (!answerData || !answerData.question) {
                return;
            }

            const row = this.createTableRow(index + 1, answerData);
            this.tableBody.appendChild(row);
        });
    }

    // ===== Create Table Row =====
    createTableRow(number, answerData) {
        const row = document.createElement('tr');
        row.className = 'table-row';

        const { question, userAnswer, isCorrect } = answerData;

        row.innerHTML = `
            <td class="table-cell">${number}</td>
            <td class="table-cell">
                <img src="${question.image}" alt="${question.alt}" class="table-image">
            </td>
            <td class="table-cell">${question.correctAnswer}</td>
            <td class="table-cell">${userAnswer || '—'}</td>
            <td class="table-cell">
                <span class="result-badge ${isCorrect ? 'result-correct' : 'result-incorrect'}" 
                      aria-label="${isCorrect ? 'Правильно' : 'Неправильно'}">
                    <svg class="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        ${isCorrect
                            ? '<path d="M5 13l4 4L19 7"/>'
                            : '<path d="M18 6L6 18M6 6l12 12"/>'}
                    </svg>
                </span>
            </td>
        `;

        return row;
    }

    // ===== Attach Event Listeners =====
    attachEventListeners() {
        const restartButton = document.getElementById('restartButton');

        if (restartButton) {
            restartButton.addEventListener('click', () => {
                localStorage.removeItem(STORAGE_KEY);
                window.location.href = 'index.html';
            });
        }
    }
}

// ===== Initialize Application =====
function initializeApplication() {
    const isAnswersPage = window.location.pathname.includes('answers.html');

    if (isAnswersPage) {
        new AnswersTable();
    } else {
        new TrainerApp();
    }
}

// ===== Run on DOM Ready =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}
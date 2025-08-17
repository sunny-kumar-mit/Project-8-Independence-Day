document.addEventListener('DOMContentLoaded', function() {
    const quizData = [
        {
            question: "Who was known as the 'Father of the Indian Constitution'?",
            options: ["Mahatma Gandhi", "Jawaharlal Nehru", "B.R. Ambedkar", "Subhash Chandra Bose"],
            answer: 2
        },
        {
            question: "Which year did India gain independence?",
            options: ["1942", "1947", "1950", "1935"],
            answer: 1
        },
        {
            question: "What is the national anthem of India?",
            options: ["Vande Mataram", "Jana Gana Mana", "Saare Jahan Se Achha", "Sare Jahan Se Achha"],
            answer: 1
        },
        {
            question: "Who was the first Prime Minister of India?",
            options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "Rajendra Prasad"],
            answer: 1
        },
        {
            question: "Which movement is associated with the slogan 'Do or Die'?",
            options: ["Non-Cooperation Movement", "Quit India Movement", "Civil Disobedience Movement", "Swadeshi Movement"],
            answer: 1
        }
    ];

    const quizContainer = document.getElementById('quiz');
    const quizResult = document.getElementById('quizResult');
    let currentQuestion = 0;
    let score = 0;

    function loadQuestion() {
        const question = quizData[currentQuestion];
        quizContainer.innerHTML = `
            <div class="quiz-question">
                <h3>${currentQuestion + 1}. ${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <div class="quiz-option" data-index="${index}">${option}</div>
                    `).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', function() {
                const selectedIndex = parseInt(this.getAttribute('data-index'));
                if (selectedIndex === question.answer) {
                    score++;
                    this.style.backgroundColor = 'var(--green)';
                } else {
                    this.style.backgroundColor = 'var(--saffron)';
                }

                setTimeout(() => {
                    currentQuestion++;
                    if (currentQuestion < quizData.length) {
                        loadQuestion();
                    } else {
                        showResult();
                    }
                }, 1000);
            });
        });
    }

    function showResult() {
        const percentage = Math.round((score / quizData.length) * 100);
        let message = '';
        
        if (percentage >= 80) {
            message = `Excellent! You scored ${score}/${quizData.length} (${percentage}%). You know India very well!`;
        } else if (percentage >= 60) {
            message = `Good job! You scored ${score}/${quizData.length} (${percentage}%). You know quite a bit about India.`;
        } else if (percentage >= 40) {
            message = `Not bad! You scored ${score}/${quizData.length} (${percentage}%). You know some facts about India.`;
        } else {
            message = `You scored ${score}/${quizData.length} (${percentage}%). Time to learn more about India's history!`;
        }

        quizResult.innerHTML = `
            <h3>Quiz Complete!</h3>
            <p>${message}</p>
            <button id="retryQuiz">Try Again</button>
        `;

        document.getElementById('retryQuiz').addEventListener('click', function() {
            currentQuestion = 0;
            score = 0;
            quizResult.innerHTML = '';
            loadQuestion();
        });
    }

    loadQuestion();
});
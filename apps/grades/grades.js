function testGradingAndAnalysis() {
    const gameTitleElement = document.getElementById('game-title');
    // Extract title from function name: remove 'function', remove '()', convert camelCase to Title Case
    const functionName = testGradingAndAnalysis.name;
    const formattedTitle = functionName
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    gameTitleElement.textContent = formattedTitle;

    const gameArea = document.getElementById('game-area');
    const newTestBtn = document.getElementById('new-test-btn');

    // --- Constants and Configuration ---
    const NUM_SCORES = 30;
    const SCORE_RANGE = { min: 0, max: 100 };
    const DIFFICULTY_LEVELS = [
        { name: 'Impossible', emoji: '💀', scoreRange: { min: 0, max: 10 }, weight: 1 },
        { name: 'Very Hard', emoji: '🥲', scoreRange: { min: 11, max: 30 }, weight: 2 },
        { name: 'Hard', emoji: '🔥', scoreRange: { min: 31, max: 50 }, weight: 4 },
        { name: 'Average', emoji: '👍', scoreRange: { min: 51, max: 70 }, weight: 4 },
        { name: 'Easy', emoji: '✅', scoreRange: { min: 71, max: 90 }, weight: 2 },
        { name: 'Very Easy', emoji: '🌟', scoreRange: { min: 91, max: 100 }, weight: 1 }
    ];

    // --- Helper Functions ---

    /**
     * Generates a random number between min and max (inclusive).
     */
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Determines the letter grade for a given score.
     */
    function getLetterGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    /**
     * Determines the difficulty of a test based on the average score.
     * This correctly maps the average score to the appropriate difficulty level.
     */
    function determineTestDifficulty(scores) {
        const classAverage = calculateClassAverage(scores);

        // Find the difficulty level that corresponds to the average score
        for (const level of DIFFICULTY_LEVELS) {
            if (classAverage >= level.scoreRange.min && classAverage <= level.scoreRange.max) {
                return level;
            }
        }

        // Fallback (shouldn't happen with proper ranges)
        return DIFFICULTY_LEVELS[3]; // Default to Average
    }

    /**
     * Calculates the class average.
     */
    function calculateClassAverage(scores) {
        if (scores.length === 0) return 0;
        const sum = scores.reduce((acc, score) => acc + score, 0);
        return sum / scores.length; // Return as number for comparison
    }

    /**
     * Renders the test scores, grades, difficulty, and average.
     */
    function renderTestResults(scores) {
        gameArea.innerHTML = ''; // Clear previous results

        scores.forEach(score => {
            const scoreEntry = document.createElement('div');
            scoreEntry.classList.add('score-entry');

            const scoreValue = document.createElement('div');
            scoreValue.classList.add('score-value');
            scoreValue.textContent = score.toFixed(1); // Display with one decimal place

            const gradeValue = document.createElement('div');
            gradeValue.classList.add('grade-value');
            gradeValue.textContent = getLetterGrade(score);

            scoreEntry.appendChild(scoreValue);
            scoreEntry.appendChild(gradeValue);
            gameArea.appendChild(scoreEntry);
        });

        // Add results section at the bottom
        const testDifficulty = determineTestDifficulty(scores);
        const classAverage = calculateClassAverage(scores);

        const resultsDiv = document.createElement('div');
        resultsDiv.classList.add('test-results');

        const difficultyElement = document.createElement('div');
        difficultyElement.classList.add('difficulty');
        difficultyElement.innerHTML = `Test Difficulty (6 total): <span>${testDifficulty.name}</span> <span class="emoji">${testDifficulty.emoji}</span>`;

        const averageElement = document.createElement('div');
        averageElement.classList.add('class-average');
        averageElement.innerHTML = `Class Average: <span>${classAverage.toFixed(2)}</span>`;

        resultsDiv.appendChild(difficultyElement);
        resultsDiv.appendChild(averageElement);
        gameArea.appendChild(resultsDiv);
    }

    /**
     * Generates a new set of random test scores with rarity-based difficulty distribution.
     */
    function generateNewTest() {
        const newScores = [];

        // Select difficulty level for the entire test based on weights
        const difficultyLevel = selectDifficultyByWeight();

        // Generate all scores within that difficulty's range
        for (let i = 0; i < NUM_SCORES; i++) {
            const randomScore = getRandomInt(difficultyLevel.scoreRange.min, difficultyLevel.scoreRange.max);
            newScores.push(randomScore);
        }

        renderTestResults(newScores);
    }

    /**
     * Selects a difficulty level based on weighted probability.
     */
    function selectDifficultyByWeight() {
        // Calculate total weight
        const totalWeight = DIFFICULTY_LEVELS.reduce((sum, level) => sum + level.weight, 0);

        // Generate a random number between 1 and totalWeight
        let randomValue = Math.floor(Math.random() * totalWeight) + 1;

        // Find which difficulty level corresponds to this random value
        for (const level of DIFFICULTY_LEVELS) {
            randomValue -= level.weight;
            if (randomValue <= 0) {
                return level;
            }
        }

        // Fallback (shouldn't happen)
        return DIFFICULTY_LEVELS[0];
    }

    // --- Event Listeners ---
    newTestBtn.addEventListener('click', generateNewTest);

    // --- Initial Load ---
    generateNewTest(); // Generate the first test when the page loads
}

// Call the main game function to set it all in motion
testGradingAndAnalysis();
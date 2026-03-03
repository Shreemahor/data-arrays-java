// Function name will determine the game title
function arrayMathOperationsGame() {
    const gameTitleElement = document.getElementById('game-title');
    const arrayTableBody = document.querySelector('#array-table tbody');
    const operationButtons = document.querySelectorAll('.operation-btn');
    const resultsDisplay = document.getElementById('results-display');
    const allOperationsBtn = document.getElementById('all-operations-btn');
    const summaryDisplay = document.getElementById('summary-display');

    const ARRAY_SIZE = 10;
    let currentArray = Array(ARRAY_SIZE).fill(0);

    // --- Title Logic ---
    const functionName = arrayMathOperationsGame.name;
    const title = functionName
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim()
        .replace(/Game$/, ''); // Remove "Game" from the end
    gameTitleElement.textContent = title;

    // --- Array Table Generation ---
    function renderArrayTable() {
        arrayTableBody.innerHTML = ''; // Clear existing rows
        for (let i = 0; i < ARRAY_SIZE; i++) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.value = currentArray[i];
            input.dataset.index = i;
            input.addEventListener('input', handleArrayInput);
            cell.appendChild(input);
            row.appendChild(cell);
            arrayTableBody.appendChild(row);
        }
    }

    function handleArrayInput(event) {
        const index = parseInt(event.target.dataset.index, 10);
        const value = parseInt(event.target.value, 10);

        if (!isNaN(value)) {
            currentArray[index] = value;
            // Clear previous results when array is edited
            resultsDisplay.innerHTML = '';
            summaryDisplay.innerHTML = '';
        } else {
            // Handle cases where input is not a valid number, perhaps reset to 0 or keep old value
            // For simplicity, let's just ensure it's a number for now
             if (event.target.value === '') {
                currentArray[index] = 0; // Allow clearing to 0
             } else {
                 event.target.value = currentArray[index]; // Revert if not a valid number
             }
        }
    }

    // --- Operations Logic ---

    function getMean(arr) {
        if (arr.length === 0) return 0;
        const sum = arr.reduce((acc, val) => acc + val, 0);
        return sum / arr.length;
    }

    function getMedian(arr) {
        if (arr.length === 0) return 0;
        const sortedArr = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sortedArr.length / 2);
        return sortedArr.length % 2 !== 0 ? sortedArr[mid] : (sortedArr[mid - 1] + sortedArr[mid]) / 2;
    }

    function getMode(arr) {
        if (arr.length === 0) return 'N/A';
        const frequency = {};
        let maxFreq = 0;
        let modes = [];

        for (const num of arr) {
            frequency[num] = (frequency[num] || 0) + 1;
            if (frequency[num] > maxFreq) {
                maxFreq = frequency[num];
            }
        }

        // Handle cases where all numbers appear with the same frequency
        const allSameFreq = Object.values(frequency).every(freq => freq === maxFreq);
        if (allSameFreq && maxFreq === 1 && arr.length > 1) {
            return 'No unique mode';
        }

        for (const num in frequency) {
            if (frequency[num] === maxFreq) {
                modes.push(parseInt(num, 10));
            }
        }

        if (modes.length === arr.length) {
            return 'No unique mode';
        }

        return modes.length === 1 ? modes[0] : modes.join(', '); // Return comma-separated if multiple modes
    }

    function getStandardDeviation(arr) {
        if (arr.length === 0) return 0;
        const mean = getMean(arr);
        const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
    }

    function getMax(arr) {
        if (arr.length === 0) return 'N/A';
        return Math.max(...arr);
    }

    function getMin(arr) {
        if (arr.length === 0) return 'N/A';
        return Math.min(...arr);
    }

    function getUniqueCount(arr) {
        if (arr.length === 0) return 0;
        const uniqueElements = new Set(arr);
        return uniqueElements.size;
    }

    // --- Display Logic ---
    function displayResult(operationName, result) {
        const resultElement = document.createElement('div');
        resultElement.classList.add('result-item');
        resultElement.innerHTML = `<strong>${operationName}:</strong> ${result}`;
        resultsDisplay.appendChild(resultElement);
    }

    function performOperation(operationKey) {
        let result;
        let operationName;

        switch (operationKey) {
            case 'mean':
                result = getMean(currentArray);
                operationName = 'Mean';
                break;
            case 'median':
                result = getMedian(currentArray);
                operationName = 'Median';
                break;
            case 'mode':
                result = getMode(currentArray);
                operationName = 'Mode';
                break;
            case 'stdDev':
                result = getStandardDeviation(currentArray).toFixed(2); // Format to 2 decimal places
                operationName = 'Standard Deviation';
                break;
            case 'max':
                result = getMax(currentArray);
                operationName = 'Max';
                break;
            case 'min':
                result = getMin(currentArray);
                operationName = 'Min';
                break;
            case 'uniqueCount':
                result = getUniqueCount(currentArray);
                operationName = 'Unique Elements';
                break;
            default:
                return;
        }
        displayResult(operationName, result);
    }

    function performAllOperations() {
        summaryDisplay.innerHTML = ''; // Clear previous summary
        resultsDisplay.innerHTML = ''; // Clear individual results as well

        const operations = [
            { key: 'mean', name: 'Mean' },
            { key: 'median', name: 'Median' },
            { key: 'mode', name: 'Mode' },
            { key: 'stdDev', name: 'Standard Deviation' },
            { key: 'max', name: 'Max' },
            { key: 'min', name: 'Min' },
            { key: 'uniqueCount', name: 'Unique Elements' }
        ];

        operations.forEach(op => {
            let result;
            switch (op.key) {
                case 'mean': result = getMean(currentArray); break;
                case 'median': result = getMedian(currentArray); break;
                case 'mode': result = getMode(currentArray); break;
                case 'stdDev': result = getStandardDeviation(currentArray).toFixed(2); break;
                case 'max': result = getMax(currentArray); break;
                case 'min': result = getMin(currentArray); break;
                case 'uniqueCount': result = getUniqueCount(currentArray); break;
            }
            displayResult(op.name, result);
        });

        // Grand Summary
        const summaryTitle = document.createElement('h3');
        summaryTitle.textContent = 'Grand Summary';
        summaryDisplay.appendChild(summaryTitle);

        const summaryList = document.createElement('ul');
        operations.forEach(op => {
            let result;
            switch (op.key) {
                case 'mean': result = getMean(currentArray); break;
                case 'median': result = getMedian(currentArray); break;
                case 'mode': result = getMode(currentArray); break;
                case 'stdDev': result = getStandardDeviation(currentArray).toFixed(2); break;
                case 'max': result = getMax(currentArray); break;
                case 'min': result = getMin(currentArray); break;
                case 'uniqueCount': result = getUniqueCount(currentArray); break;
            }
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${op.name}:</strong> ${result}`;
            summaryList.appendChild(listItem);
        });
        summaryDisplay.appendChild(summaryList);
    }


    // --- Event Listeners ---
    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            resultsDisplay.innerHTML = ''; // Clear previous results
            performOperation(button.dataset.operation);
        });
    });

    allOperationsBtn.addEventListener('click', performAllOperations);

    // --- Initialization ---
    renderArrayTable();
}

// Execute the game function
arrayMathOperationsGame();
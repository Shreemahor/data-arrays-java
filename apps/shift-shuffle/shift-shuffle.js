// Function name will be used to extract the game title.
function shiftingArrayGame() {
    const gameTitleElement = document.getElementById('game-title');
    // Extract title from function name (e.g., "shiftingArrayGame" -> "Shifting Array Game")
    const title = gameTitleElement.id === 'game-title' ? 'Shifting Array Game' :
                  gameTitleElement.textContent || 'Game'; // Fallback
    gameTitleElement.textContent = title.replace(/([A-Z])/g, ' $1').trim().replace(/^[a-z]/, (char) => char.toUpperCase());


    let currentArray = [1, 2, 3, 4, 5]; // Initial array, mimicking Java's initial state
    const arrayInput = document.getElementById('array-input');
    const arrayDisplay = document.getElementById('array-display');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const shiftLeftBtn = document.getElementById('shift-left-btn');
    const shiftRightBtn = document.getElementById('shift-right-btn');

    // --- Helper Functions (Mimicking Java Structure) ---

    // Converts JavaScript array to HTML elements for display
    function displayArray() {
        arrayDisplay.innerHTML = ''; // Clear previous elements
        currentArray.forEach(element => {
            const elementDiv = document.createElement('div');
            elementDiv.classList.add('array-element');
            elementDiv.textContent = element;
            arrayDisplay.appendChild(elementDiv);
        });
    }

    // Parses the input string into an array of numbers
    function parseInputArray() {
        const inputText = arrayInput.value.trim();
        if (!inputText) {
            return []; // Return empty if input is blank
        }
        const numbers = inputText.split(',')
                               .map(numStr => parseInt(numStr.trim()))
                               .filter(num => !isNaN(num)); // Filter out non-numeric entries
        return numbers;
    }

    // Mimics Java's shift_left, returns a new array
    function shift_left(arr) {
        if (arr.length === 0) return [];
        const result = [...arr]; // Create a shallow copy
        const temp = result.shift(); // Remove first element and store it
        result.push(temp);         // Add it to the end
        return result;
    }

    // Mimics Java's shift_left_2, modifies the original array in place
    function shift_left_2(arr) {
        if (arr.length === 0) return;
        const temp = arr.shift();
        arr.push(temp);
    }

    // Mimics Java's shift_right, returns a new array
    function shift_right(arr) {
        if (arr.length === 0) return [];
        const result = [...arr]; // Create a shallow copy
        const temp = result.pop(); // Remove last element and store it
        result.unshift(temp);      // Add it to the beginning
        return result;
    }

    // Mimics Java's shift_right_2, modifies the original array in place
    function shift_right_2(arr) {
        if (arr.length === 0) return;
        const temp = arr.pop();
        arr.unshift(temp);
    }

    // Mimics Java's reverse_array, returns a new array
    function reverse_array(arr) {
        // Simple way to reverse in JS, creates a new array
        return [...arr].reverse();
    }

    // Mimics Java's print_array, but for the console (optional)
    function print_array_console(arr) {
        console.log(arr.join(" "));
    }

    // --- Event Listeners ---

    // Load initial array from input if it exists, otherwise use default
    arrayInput.addEventListener('input', () => {
        const parsed = parseInputArray();
        if (parsed.length > 0) {
            currentArray = parsed;
        } else {
            currentArray = []; // Reset if input is cleared/invalid
        }
        displayArray();
    });

    shuffleBtn.addEventListener('click', () => {
        // Fisher-Yates (aka Knuth) Shuffle algorithm
        for (let i = currentArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentArray[i], currentArray[j]] = [currentArray[j], currentArray[i]]; // Swap
        }
        displayArray();
    });

    shiftLeftBtn.addEventListener('click', () => {
        shift_left_2(currentArray); // Modifies currentArray in place
        displayArray();
    });

    shiftRightBtn.addEventListener('click', () => {
        shift_right_2(currentArray); // Modifies currentArray in place
        displayArray();
    });

    // --- Initial Setup ---
    // Populate input field with initial array values and display it
    arrayInput.value = currentArray.join(', ');
    displayArray();
}

// Call the main game function to set everything up
shiftingArrayGame();
// --- Configuration ---
const TEAL = '#0D9488';
const CORAL = '#FF6B6B';
const SOFT_CREAM = '#FDFBF7';
const BORDER_COLOR = '#E8E5E0';

// --- DOM Elements ---
const gameTitleElement = document.getElementById('game-title');
const arrayListContainer = document.getElementById('arrayListContainer');
const simulationOutput = document.getElementById('simulationOutput');
const valueToAddInput = document.getElementById('valueToAdd');
const indexToAddAtInput = document.getElementById('indexToAddAt');
const addButton = document.getElementById('addButton');
const indexToRemoveInput = document.getElementById('indexToRemove');
const removeButton = document.getElementById('removeButton');
const indexToGetInput = document.getElementById('indexToGet');
const getButton = document.getElementById('getButton');
const valueToSetInput = document.getElementById('valueToSet');
const indexToSetInput = document.getElementById('indexToSet');
const setButton = document.getElementById('setButton');

// --- State ---
let currentArrayList = []; // Our "backend" for the simulation

// --- Helper Functions ---

// Extracts the title from the JS function name (if it were a function)
// For now, we'll manually set it if needed, or rely on the HTML H1.
function getFunctionNameFromComment() {
    // This is a placeholder. In a real scenario, you might inspect call stacks
    // or have a convention. For this page, we've hardcoded it in HTML.
    // If you had a main function like `function dijkstraAlgorithm() { ... }`
    // you could try something like:
    // return dijkstraAlgorithm.name.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase());
    return "Array List Education"; // Default if no function name is detected
}

function renderArrayList() {
    arrayListContainer.innerHTML = ''; // Clear previous cells
    currentArrayList.forEach((item, index) => {
        const cell = document.createElement('div');
        cell.classList.add('sim-cell');
        cell.textContent = item;
        // Add index label below the cell if space allows or needed
        // For simplicity, we're just showing the value for now.
        arrayListContainer.appendChild(cell);
    });

    // If list is empty, display a placeholder
    if (currentArrayList.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.style.width = '100%';
        placeholder.style.textAlign = 'center';
        placeholder.style.color = BORDER_COLOR;
        placeholder.textContent = "ArrayList is empty";
        arrayListContainer.appendChild(placeholder);
    }
}

function displayOutput(message, type = 'info') {
    simulationOutput.textContent = message;
    if (type === 'error') {
        simulationOutput.style.color = CORAL;
    } else if (type === 'success') {
        simulationOutput.style.color = TEAL;
    } else {
        simulationOutput.style.color = TEAL; // Default to teal for info
    }
}

// --- Event Listeners ---

// Add Button
addButton.addEventListener('click', () => {
    const value = valueToAddInput.value.trim();
    const index = indexToAddAtInput.value.trim();

    if (!value) {
        displayOutput("Please enter a value to add.", 'error');
        return;
    }

    if (index === '') {
        // Add to the end if no index is provided
        currentArrayList.push(value);
        displayOutput(`Added "${value}" to the end.`, 'success');
    } else {
        const indexNum = parseInt(index, 10);
        if (isNaN(indexNum) || indexNum < 0 || indexNum > currentArrayList.length) {
            displayOutput(`Invalid index. Must be between 0 and ${currentArrayList.length}.`, 'error');
            return;
        }
        currentArrayList.splice(indexNum, 0, value); // Insert at index
        displayOutput(`Added "${value}" at index ${indexNum}.`, 'success');
    }

    valueToAddInput.value = '';
    indexToAddAtInput.value = '';
    renderArrayList();
});

// Remove Button
removeButton.addEventListener('click', () => {
    const index = indexToRemoveInput.value.trim();

    if (index === '') {
        displayOutput("Please enter an index to remove.", 'error');
        return;
    }

    const indexNum = parseInt(index, 10);
    if (isNaN(indexNum) || indexNum < 0 || indexNum >= currentArrayList.length) {
        displayOutput(`Invalid index. Must be between 0 and ${currentArrayList.length - 1}.`, 'error');
        return;
    }

    const removedValue = currentArrayList.splice(indexNum, 1)[0]; // Remove element at index
    displayOutput(`Removed "${removedValue}" from index ${indexNum}.`, 'success');

    indexToRemoveInput.value = '';
    renderArrayList();
});

// Get Button
getButton.addEventListener('click', () => {
    const index = indexToGetInput.value.trim();

    if (index === '') {
        displayOutput("Please enter an index to get.", 'error');
        return;
    }

    const indexNum = parseInt(index, 10);
    if (isNaN(indexNum) || indexNum < 0 || indexNum >= currentArrayList.length) {
        displayOutput(`Invalid index. Must be between 0 and ${currentArrayList.length - 1}.`, 'error');
        return;
    }

    const value = currentArrayList[indexNum];
    displayOutput(`Value at index ${indexNum}: "${value}".`, 'info');

    indexToGetInput.value = '';
});

// Set Button
setButton.addEventListener('click', () => {
    const value = valueToSetInput.value.trim();
    const index = indexToSetInput.value.trim();

    if (!value || index === '') {
        displayOutput("Please enter both a new value and an index to set.", 'error');
        return;
    }

    const indexNum = parseInt(index, 10);
    if (isNaN(indexNum) || indexNum < 0 || indexNum >= currentArrayList.length) {
        displayOutput(`Invalid index. Must be between 0 and ${currentArrayList.length - 1}.`, 'error');
        return;
    }

    const oldValue = currentArrayList[indexNum];
    currentArrayList[indexNum] = value;
    displayOutput(`Set index ${indexNum} from "${oldValue}" to "${value}".`, 'success');

    valueToSetInput.value = '';
    indexToSetInput.value = '';
    renderArrayList();
});

// --- Initial Setup ---
function initializePage() {
    // Set the title dynamically (optional, as we hardcoded in HTML)
    // gameTitleElement.textContent = getFunctionNameFromComment();

    // Initial render of the (empty) ArrayList
    renderArrayList();
    displayOutput("Welcome! Start manipulating the ArrayList.", 'info');
}

// Call the initialization function when the DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);
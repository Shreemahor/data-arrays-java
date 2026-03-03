// Merge.js

document.addEventListener('DOMContentLoaded', () => {
    const array1SizeInput = document.getElementById('array1-size');
    const array2SizeInput = document.getElementById('array2-size');
    const createArraysBtn = document.getElementById('create-arrays-btn');
    const arraysDisplayDiv = document.getElementById('arrays-display');
    const mergeBtn = document.getElementById('merge-btn');
    const outputContainer = document.getElementById('output-container');

    let array1Data = [];
    let array2Data = [];

    // Function to extract title from JS function name (e.g., from your Java class name)
    // In a real scenario, you might have a convention or pass this info.
    // For this example, we'll just use "Merge Game" as set in HTML.
    // If you had a main JS function like 'function mergeArrays()', you could parse that.
    function extractTitle(jsFileName) {
        const baseName = jsFileName.replace('.js', '');
        // Simple title casing
        return baseName.replace(/([A-Z])/g, ' $1').trim().toLowerCase().split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    // const gameTitleElement = document.querySelector('.game-title');
    // gameTitleElement.textContent = extractTitle('Merge'); // Assuming your JS file is Merge.js

    createArraysBtn.addEventListener('click', createInteractiveArrays);
    mergeBtn.addEventListener('click', performMerge);

    // Initialize with default sizes
    createInteractiveArrays();

    function createInteractiveArrays() {
        const size1 = parseInt(array1SizeInput.value, 10) || 5;
        const size2 = parseInt(array2SizeInput.value, 10) || 8;

        array1SizeInput.value = size1;
        array2SizeInput.value = size2;

        arraysDisplayDiv.innerHTML = ''; // Clear previous tables

        // Create Array 1 Table
        arraysDisplayDiv.appendChild(createArrayTable('Array 1', size1));
        // Create Array 2 Table
        arraysDisplayDiv.appendChild(createArrayTable('Array 2', size2));

        // Populate with default values (or previous if available)
        populateTableDefaults('Array 1', size1);
        populateTableDefaults('Array 2', size2);
    }

    function createArrayTable(tableName, size) {
        const table = document.createElement('table');
        const caption = document.createElement('caption');
        caption.textContent = tableName;
        table.appendChild(caption);

        // Header Row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const indexHeader = document.createElement('th');
        indexHeader.textContent = 'Index';
        headerRow.appendChild(indexHeader);
        const valueHeader = document.createElement('th');
        valueHeader.textContent = 'Value';
        headerRow.appendChild(valueHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Data Rows
        const tbody = document.createElement('tbody');
        for (let i = 0; i < size; i++) {
            const row = document.createElement('tr');

            const indexCell = document.createElement('td');
            indexCell.textContent = i;
            row.appendChild(indexCell);

            const valueCell = document.createElement('td');
            const valueInput = document.createElement('input');
            valueInput.type = 'number';
            valueInput.id = `${tableName.replace(' ', '-').toLowerCase()}-val-${i}`;
            valueInput.min = "-1000"; // Or appropriate min/max
            valueInput.max = "1000";
            valueInput.value = 0; // Default value
            valueCell.appendChild(valueInput);
            row.appendChild(valueCell);

            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        return table;
    }

    function populateTableDefaults(tableName, size) {
        const storedData = tableName === 'Array 1' ? array1Data : array2Data;
        for (let i = 0; i < size; i++) {
            const inputId = `${tableName.replace(' ', '-').toLowerCase()}-val-${i}`;
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                // Prioritize stored data if it exists and matches size, otherwise use defaults
                if (storedData.length === size) {
                    inputElement.value = storedData[i];
                } else {
                    // Example default values based on your Java example
                    if (tableName === 'Array 1') {
                        const javaDefaults = [1, 2, 3, 4, 5];
                        inputElement.value = i < javaDefaults.length ? javaDefaults[i] : 0;
                    } else if (tableName === 'Array 2') {
                        const javaDefaults = [3, 4, 5, 6, 7, 8, 9, 10];
                        inputElement.value = i < javaDefaults.length ? javaDefaults[i] : 0;
                    }
                }
            }
        }
        // Update storedData to reflect current table size and potentially values
        if (tableName === 'Array 1') array1Data = Array.from({ length: size }, (_, i) => parseInt(document.getElementById(`${tableName.replace(' ', '-').toLowerCase()}-val-${i}`).value) || 0);
        if (tableName === 'Array 2') array2Data = Array.from({ length: size }, (_, i) => parseInt(document.getElementById(`${tableName.replace(' ', '-').toLowerCase()}-val-${i}`).value) || 0);
    }


    function performMerge() {
        const arr1 = [];
        const arr2 = [];

        // Read values from Array 1 inputs
        const arr1Inputs = arraysDisplayDiv.querySelectorAll('#arrays-display table:nth-of-type(1) input[type="number"]');
        arr1Inputs.forEach(input => {
            arr1.push(parseInt(input.value, 10) || 0);
        });
        array1Data = [...arr1]; // Save current values

        // Read values from Array 2 inputs
        const arr2Inputs = arraysDisplayDiv.querySelectorAll('#arrays-display table:nth-of-type(2) input[type="number"]');
        arr2Inputs.forEach(input => {
            arr2.push(parseInt(input.value, 10) || 0);
        });
        array2Data = [...arr2]; // Save current values

        // Perform the merge logic (similar to your Java merge method)
        const mergedArray = mergeArrays(arr1, arr2);

        // Display the result
        displayResult(mergedArray);
    }

    // JavaScript implementation of the merge logic (similar to Java)
    function mergeArrays(a1, a2) {
        let result = [];
        let i1 = 0;
        let i2 = 0;

        while (i1 < a1.length && i2 < a2.length) {
            if (a1[i1] < a2[i2]) {
                result.push(a1[i1]);
                i1++;
            } else if (a2[i2] < a1[i1]) {
                result.push(a2[i2]);
                i2++;
            } else { // Handle equal elements (push one and advance both)
                result.push(a1[i1]);
                i1++;
                i2++;
            }
        }

        // Append remaining elements from a1
        while (i1 < a1.length) {
            result.push(a1[i1]);
            i1++;
        }

        // Append remaining elements from a2
        while (i2 < a2.length) {
            result.push(a2[i2]);
            i2++;
        }

        return result;
    }

    function displayResult(mergedArray) {
        outputContainer.innerHTML = '<h3>Merged Output</h3>';
        if (mergedArray.length > 0) {
            outputContainer.innerHTML += `<p>${mergedArray.join(', ')}</p>`;
        } else {
            outputContainer.innerHTML += '<p>Arrays were empty or could not be merged.</p>';
        }
    }
});
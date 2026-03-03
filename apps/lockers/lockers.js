        let lockers = [];
        let students = [];
        let hallway = document.getElementById('hallway');
        let speed = 25; // Increased default speed
        let studentCount = 100;
        let currentStudent = 0;
        let studentElements = [];

        // Initialize the simulation
        function initSimulation() {
            // Clear hallway
            hallway.innerHTML = '';
            lockers = new Array(studentCount).fill(false);

            // Create lockers
            for (let i = 0; i < studentCount; i++) {
                const locker = document.createElement('div');
                locker.className = 'locker closed';
                locker.dataset.index = i;

                const handle = document.createElement('div');
                handle.className = 'locker-handle';
                locker.appendChild(handle);

                const number = document.createElement('div');
                number.className = 'locker-number';
                number.textContent = i + 1;
                locker.appendChild(number);

                hallway.appendChild(locker);
            }

            // Reset stats
            updateStats();
            document.getElementById('studentNumber').textContent = '-';
        }

        // Update statistics display
        function updateStats() {
            const openCount = lockers.filter(locker => locker).length;
            const closedCount = lockers.length - openCount;

            document.getElementById('openCount').textContent = openCount;
            document.getElementById('closedCount').textContent = closedCount;
            document.getElementById('currentStudent').textContent = currentStudent;
        }

        // Toggle locker state
        function toggleLocker(index) {
            const locker = document.querySelector(`.locker[data-index="${index}"]`);
            lockers[index] = !lockers[index];

            if (lockers[index]) {
                locker.classList.remove('closed');
                locker.classList.add('open');
            } else {
                locker.classList.remove('open');
                locker.classList.add('closed');
            }

            updateStats();
        }

        // Move student to locker with animation
        function moveStudentToLocker(studentIndex, lockerIndex) {
            return new Promise((resolve) => {
                const student = studentElements[studentIndex];
                const locker = document.querySelector(`.locker[data-index="${lockerIndex}"]`);

                // Get positions
                const lockerRect = locker.getBoundingClientRect();
                const hallwayRect = hallway.getBoundingClientRect();

                const targetX = lockerRect.left - hallwayRect.left + lockerRect.width/2 - student.offsetWidth/2;
                const targetY = lockerRect.top - hallwayRect.top + lockerRect.height/2 - student.offsetHeight/2;

                // Reset any existing transform to avoid conflicts
                student.style.transform = '';

                // Animate to locker (shortened duration and added ease for smoother animation)
                gsap.to(student, {
                    x: targetX,
                    y: targetY,
                    duration: 0.1 / speed, // Reduced for faster animation
                    ease: "power1.out", // Added ease for smoother motion
                    onComplete: () => {
                        // Tap animation
                        student.classList.add('tap-animation');
                        setTimeout(() => {
                            student.classList.remove('tap-animation');
                            resolve();
                        }, 100); // Reduced tap duration
                    }
                });
            });
        }

        // Create student element
        function createStudent(index) {
            const student = document.createElement('div');
            student.className = 'student';
            student.id = `student-${index}`;
            student.style.zIndex = 20;
            hallway.appendChild(student);
            studentElements.push(student);
            return student;
        }

        // Run the simulation
        async function runSimulation() {
            // Reset current student
            currentStudent = 0;
            document.getElementById('studentNumber').textContent = '-';

            // Reset all lockers
            for (let i = 0; i < studentCount; i++) {
                lockers[i] = false;
                const locker = document.querySelector(`.locker[data-index="${i}"]`);
                locker.classList.remove('open');
                locker.classList.add('closed');
            }

            updateStats();

            // Create students
            studentElements = [];
            for (let i = 0; i < studentCount; i++) {
                createStudent(i);
            }

            // Move students to starting position (top-left of hallway)
            for (let i = 0; i < studentCount; i++) {
                const student = studentElements[i];
                student.style.position = 'absolute';
                student.style.left = '0px'; // Set to 0px as requested
                student.style.top = '0px';  // Set to 0px as requested
                student.style.transform = ''; // Ensure no conflicting transform
            }

            // Simulate students
            for (let studentNumber = 1; studentNumber <= studentCount; studentNumber++) {
                currentStudent = studentNumber;
                document.getElementById('studentNumber').textContent = studentNumber;

                // Walk to each locker that student toggles
                for (let lockerIndex = studentNumber - 1; lockerIndex < studentCount; lockerIndex += studentNumber) {
                    // Move student to locker
                    await moveStudentToLocker(studentNumber - 1, lockerIndex);

                    // Toggle locker
                    toggleLocker(lockerIndex);

                    // Small delay between actions (reduced for speed)
                    await new Promise(resolve => setTimeout(resolve, 50 / speed)); // Reduced delay
                }

                // Wait for next student (reduced for speed)
                await new Promise(resolve => setTimeout(resolve, 100 / speed)); // Reduced wait
            }
        }

        // Event Listeners
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            speed = parseInt(e.target.value);
        });

        document.getElementById('studentCount').addEventListener('input', (e) => {
            studentCount = parseInt(e.target.value);
            initSimulation();
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            runSimulation();
        });

        // Initialize on load
        window.addEventListener('DOMContentLoaded', () => {
            initSimulation();
        });
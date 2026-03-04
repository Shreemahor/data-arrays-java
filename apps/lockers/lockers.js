let lockers = [];
let hallway = document.getElementById('hallway');
let speed = 25;
let studentCount = 100;
let currentStudent = 0;
let studentElements = [];
let isRunning = false; // PATCH 1: lock flag

const startBtn = document.getElementById('startBtn');

function initSimulation() {
    hallway.innerHTML = '';
    lockers = new Array(studentCount).fill(false);

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

    updateStats();
    document.getElementById('studentNumber').textContent = '-';
}

function updateStats() {
    const openCount = lockers.filter(l => l).length;
    document.getElementById('openCount').textContent = openCount;
    document.getElementById('closedCount').textContent = lockers.length - openCount;
    document.getElementById('currentStudent').textContent = currentStudent;
}

function toggleLocker(index) {
    const locker = document.querySelector(`.locker[data-index="${index}"]`);
    lockers[index] = !lockers[index];
    locker.classList.toggle('open', lockers[index]);
    locker.classList.toggle('closed', !lockers[index]);
    updateStats();
}

// PATCH 2: Speed-aware animation.
// At speed=50 (max), moveDuration ~0ms and delays are 0 — nearly instant.
// At speed=1 (min), moveDuration ~300ms, delays are reasonable.
function moveStudentToLocker(studentIndex, lockerIndex) {
    return new Promise((resolve) => {
        const student = studentElements[studentIndex];
        const locker = document.querySelector(`.locker[data-index="${lockerIndex}"]`);

        const lockerRect = locker.getBoundingClientRect();
        const hallwayRect = hallway.getBoundingClientRect();

        const targetX = lockerRect.left - hallwayRect.left + lockerRect.width / 2 - student.offsetWidth / 2;
        const targetY = lockerRect.top - hallwayRect.top + lockerRect.height / 2 - student.offsetHeight / 2;

        student.style.transform = '';

        // RUTHLESS speed scaling:
        // speed=1  → moveDuration ≈ 0.30s
        // speed=25 → moveDuration ≈ 0.004s
        // speed=50 → moveDuration ≈ 0.001s (effectively instant)
        const moveDuration = 0.3 / (speed * speed * 0.04 + 1);

        // At max speed, skip GSAP entirely and just teleport
        if (speed >= 40) {
            gsap.set(student, { x: targetX, y: targetY });
            resolve();
            return;
        }

        gsap.to(student, {
            x: targetX,
            y: targetY,
            duration: moveDuration,
            ease: "power1.out",
            onComplete: () => {
                student.classList.add('tap-animation');
                setTimeout(() => {
                    student.classList.remove('tap-animation');
                    resolve();
                }, Math.max(0, 80 - speed * 1.5));
            }
        });
    });
}

function createStudent(index) {
    const student = document.createElement('div');
    student.className = 'student';
    student.id = `student-${index}`;
    student.style.zIndex = 20;
    hallway.appendChild(student);
    studentElements.push(student);
    return student;
}

async function runSimulation() {
    // PATCH 1: prevent double-run
    // PATCH 1: spam clicking the button does not do anything
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    startBtn.textContent = '🚫 Simulation Running...';

    currentStudent = 0;
    document.getElementById('studentNumber').textContent = '-';

    for (let i = 0; i < studentCount; i++) {
        lockers[i] = false;
        const locker = document.querySelector(`.locker[data-index="${i}"]`);
        locker.classList.remove('open');
        locker.classList.add('closed');
    }

    updateStats();

    studentElements = [];
    for (let i = 0; i < studentCount; i++) {
        createStudent(i);
    }

    for (let i = 0; i < studentCount; i++) {
        const student = studentElements[i];
        student.style.position = 'absolute';
        student.style.left = '0px';
        student.style.top = '0px';
        student.style.transform = '';
    }

    for (let studentNumber = 1; studentNumber <= studentCount; studentNumber++) {
        currentStudent = studentNumber;
        document.getElementById('studentNumber').textContent = studentNumber;

        for (let lockerIndex = studentNumber - 1; lockerIndex < studentCount; lockerIndex += studentNumber) {
            await moveStudentToLocker(studentNumber - 1, lockerIndex);
            toggleLocker(lockerIndex);

            // PATCH 2: Now at speed * speed sacling - super fast
            // PATCH 2: delay between steps — zero at high speed
            const stepDelay = speed >= 40 ? 0 : Math.max(0, 40 / speed - 1);
            if (stepDelay > 0) {
                await new Promise(r => setTimeout(r, stepDelay));
            }
        }
        // RUTHLESSS speed - if at max animations are skipped entirely

        // Yield to browser between students so UI stays responsive, but don't sleep
        const studentDelay = speed >= 40 ? 0 : Math.max(0, 80 / speed - 2);
        if (studentDelay > 0) {
            await new Promise(r => setTimeout(r, studentDelay));
        } else {
            // Still yield to browser paint thread even at max speed
            await new Promise(r => setTimeout(r, 0));
        }
    }

    // PATCH 1: re-enable button when done
    isRunning = false;
    startBtn.disabled = false;
    startBtn.textContent = '🔁 Run Again';
}

document.getElementById('speedSlider').addEventListener('input', (e) => {
    speed = parseInt(e.target.value);
});

document.getElementById('studentCount').addEventListener('input', (e) => {
    studentCount = parseInt(e.target.value);
    initSimulation();
});

startBtn.addEventListener('click', () => {
    runSimulation();
});

window.addEventListener('DOMContentLoaded', () => {
    initSimulation();
});

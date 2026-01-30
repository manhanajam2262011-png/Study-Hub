// Quote of the Day Logic
const quotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
    "The secret of getting ahead is getting started. – Mark Twain",
    "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
    "The future depends on what you do today. – Mahatma Gandhi",
    "Believe you can and you’re halfway there. – Theodore Roosevelt",
    "You don’t have to be great to start, but you have to start to be great. – Zig Ziglar",
    "It always seems impossible until it’s done. – Nelson Mandela",
    "Push yourself, because no one else is going to do it for you."
];
function getQuoteOfDay() {
    // Use the number of days since a fixed date to pick a quote
    const start = new Date(2024, 0, 1); // Jan 1, 2024
    const now = new Date();
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return quotes[days % quotes.length];
}
const quoteDiv = document.getElementById('quote-of-day');
if (quoteDiv) quoteDiv.textContent = getQuoteOfDay();
// Onboarding Modal Logic & Default Dark Mode
window.onload = function () {
    document.body.classList.add('dark-mode'); // Default dark mode
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('finish-setup').onclick = function () {
            const name = document.getElementById('setup-name').value.trim();
            const theme = document.getElementById('setup-theme').value;
            if (name) {
                document.getElementById('user-name').textContent = name;
                if (theme === 'dark') document.body.classList.add('dark-mode');
                else if (theme === 'light') document.body.classList.remove('dark-mode');
                else document.body.classList.add('dark-mode');
                modal.style.display = 'none';
            }
        };
    }
};
// File Upload for Each Subject (force embedded viewer only)
['math', 'physics', 'chemistry', 'ict'].forEach(subject => {
    const upload = document.getElementById(subject + '-upload');
    const resDiv = document.querySelector(`#${subject} .resources`);
    const viewer = document.getElementById(subject + '-viewer');
    // Restore saved files (names and data URLs)
    function restoreFiles() {
        resDiv.innerHTML = '';
        viewer.innerHTML = '';
        const saved = JSON.parse(localStorage.getItem(subject + '-files') || '[]');
        saved.forEach(fileObj => {
            const btn = document.createElement('button');
            btn.className = 'resource-item';
            btn.textContent = fileObj.name;
            btn.onclick = function (ev) {
                ev.preventDefault();
                let embed = '';
                if (fileObj.type === 'application/pdf') {
                    embed = `<iframe src="${fileObj.data}" width="100%" height="500px" style="background:#222;"></iframe>`;
                } else if (fileObj.type.startsWith('image/')) {
                    embed = `<img src="${fileObj.data}" style="max-width:100%;max-height:500px;background:#222;" />`;
                } else if (fileObj.type.startsWith('text/')) {
                    embed = `<pre style='max-height:500px;overflow:auto;background:#222;color:#f5f6fa;'>${fileObj.text || ''}</pre>`;
                } else {
                    embed = `<p style='color:#f5f6fa;'>Preview not supported for this file type.</p>`;
                }
                viewer.innerHTML = embed;
            };
            resDiv.appendChild(btn);
            resDiv.appendChild(document.createElement('br'));
        });
    }
    restoreFiles();
    if (upload && resDiv && viewer) {
        upload.addEventListener('change', function (e) {
            let saved = JSON.parse(localStorage.getItem(subject + '-files') || '[]');
            for (const file of e.target.files) {
                const btn = document.createElement('button');
                btn.className = 'resource-item';
                btn.textContent = file.name;
                btn.onclick = function (ev) {
                    ev.preventDefault();
                    const url = URL.createObjectURL(file);
                    let embed = '';
                    if (file.type === 'application/pdf') {
                        embed = `<iframe src="${url}" width="100%" height="500px" style="background:#222;"></iframe>`;
                    } else if (file.type.startsWith('image/')) {
                        embed = `<img src="${url}" style="max-width:100%;max-height:500px;background:#222;" />`;
                    } else if (file.type.startsWith('text/')) {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            viewer.innerHTML = `<pre style='max-height:500px;overflow:auto;background:#222;color:#f5f6fa;'>${e.target.result}</pre>`;
                        };
                        reader.readAsText(file);
                        return;
                    } else {
                        embed = `<p style='color:#f5f6fa;'>Preview not supported for this file type.</p>`;
                    }
                    viewer.innerHTML = embed;
                };
                resDiv.appendChild(btn);
                resDiv.appendChild(document.createElement('br'));
                // Save file to localStorage
                const reader = new FileReader();
                reader.onload = function (e) {
                    let fileObj = { name: file.name, type: file.type, data: e.target.result };
                    if (file.type.startsWith('text/')) {
                        fileObj.text = e.target.result;
                    }
                    saved.push(fileObj);
                    localStorage.setItem(subject + '-files', JSON.stringify(saved));
                };
                if (file.type.startsWith('text/')) {
                    reader.readAsText(file);
                } else {
                    reader.readAsDataURL(file);
                }
            }
        });
    }
});
// Editing Section Logic
// Editing Section Logic with localStorage
let currentEditSection = null;
document.querySelectorAll('.edit-notes').forEach(btn => {
    btn.onclick = function () {
        currentEditSection = btn.getAttribute('data-section');
        const area = document.getElementById('edit-area');
        // Load saved notes for this section
        area.value = localStorage.getItem(currentEditSection + '-notes') || '';
        document.getElementById('editing-section').scrollIntoView({ behavior: 'smooth' });
    };
});
document.getElementById('save-edit').onclick = function () {
    if (!currentEditSection) return;
    const area = document.getElementById('edit-area');
    // Save notes to localStorage
    localStorage.setItem(currentEditSection + '-notes', area.value);
    document.getElementById('edit-status').textContent = 'Notes saved!';
    setTimeout(() => document.getElementById('edit-status').textContent = '', 2000);
};
// script.js - Study Hub

document.getElementById('welcome-btn').onclick = function () {
    alert('Welcome to your Study Hub!');
};

document.getElementById('theme-toggle').onclick = function () {
    document.body.classList.toggle('dark-mode');
};


// Flashcards (9th grade level)
const flashcards = [
    { q: 'What is the Pythagorean theorem?', a: 'a² + b² = c²' },
    { q: 'What is Newton\'s Second Law?', a: 'F = m × a' },
    { q: 'What is the atomic number of Oxygen?', a: '8' },
    { q: 'What does CPU stand for?', a: 'Central Processing Unit' }
];
let flashIndex = 0;
function showFlashcard() {
    const fcDiv = document.getElementById('flashcards');
    fcDiv.innerHTML = '';
    if (flashcards.length === 0) return;
    const card = document.createElement('div');
    card.className = 'flashcard';
    card.textContent = flashcards[flashIndex].q;
    card.onclick = function () {
        card.textContent = flashcards[flashIndex].a;
    };
    fcDiv.appendChild(card);
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.onclick = function () {
        flashIndex = (flashIndex + 1) % flashcards.length;
        showFlashcard();
    };
    fcDiv.appendChild(nextBtn);
}
showFlashcard();

// MCQ (9th grade level)
const mcqs = [
    {
        q: 'Which is a quadratic equation?',
        options: ['x^2 + 2x + 1 = 0', '2x + 3 = 0', 'x/2 = 4'],
        answer: 0
    },
    {
        q: 'Which organelle is known as the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome'],
        answer: 1
    },
    {
        q: 'What does HTML stand for?',
        options: ['Hyper Trainer Marking Language', 'Hyper Text Markup Language', 'Home Tool Markup Language'],
        answer: 1
    }
];
let mcqIndex = 0;
function showMCQ() {
    const mcqDiv = document.getElementById('mcq');
    const mcq = mcqs[mcqIndex];
    mcqDiv.innerHTML = `<strong>${mcq.q}</strong><br>`;
    mcq.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = function () {
            if (i === mcq.answer) alert('Correct!');
            else alert('Try again!');
        };
        mcqDiv.appendChild(btn);
    });
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.onclick = function () {
        mcqIndex = (mcqIndex + 1) % mcqs.length;
        showMCQ();
    };
    mcqDiv.appendChild(document.createElement('br'));
    mcqDiv.appendChild(nextBtn);
}
showMCQ();

// To-Do List
const todoDiv = document.getElementById('todo-list');
todoDiv.innerHTML = '<input id="todo-input" placeholder="Add a task..."> <button id="add-todo">Add</button><ul id="todos"></ul>';
document.getElementById('add-todo').onclick = function () {
    const val = document.getElementById('todo-input').value.trim();
    if (val) {
        const li = document.createElement('li');
        li.textContent = val;
        li.onclick = function () { li.remove(); };
        document.getElementById('todos').appendChild(li);
        document.getElementById('todo-input').value = '';
    }
};

// Timer with ring and stop button
const timerDiv = document.getElementById('timer');
timerDiv.innerHTML = '<input id="minutes" type="number" min="1" placeholder="Minutes"> <button id="start-timer">Start Timer</button> <button id="stop-timer">Stop Timer</button> <span id="time-left"></span>';
let timerAudio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5c7.mp3');
document.getElementById('start-timer').onclick = function () {
    let mins = parseInt(document.getElementById('minutes').value);
    if (isNaN(mins) || mins < 1) return;
    let secs = mins * 60;
    const timeLeft = document.getElementById('time-left');
    clearInterval(window.timerInt);
    window.timerInt = setInterval(function () {
        if (secs <= 0) {
            clearInterval(window.timerInt);
            timeLeft.textContent = 'Time\'s up!';
            timerAudio.play();
        } else {
            let m = Math.floor(secs / 60);
            let s = secs % 60;
            timeLeft.textContent = m + ':' + (s < 10 ? '0' : '') + s;
            secs--;
        }
    }, 1000);
};
document.getElementById('stop-timer').onclick = function () {
    clearInterval(window.timerInt);
    document.getElementById('time-left').textContent = '';
    timerAudio.pause();
    timerAudio.currentTime = 0;
};

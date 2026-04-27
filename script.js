// =====================
// GLOBAL STATE (START FROM 0)
// =====================
let currentPage = 'dashboard';

let waterGlasses = 0;
let waterGoal = 8;

let foods = [];
let workouts = [];
let goals = [];
let weightHistory = []; // ✅ IMPORTANT: starts empty

const predefinedFoods = [
    { name: 'Chicken Breast (100g)', calories: 165 },
    { name: 'Brown Rice (1 cup)', calories: 216 },
    { name: 'Broccoli (1 cup)', calories: 55 },
    { name: 'Banana', calories: 105 },
    { name: 'Greek Yogurt (1 cup)', calories: 130 },
    { name: 'Almonds (1 oz)', calories: 164 }
];

const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Don't stop when you're tired. Stop when you're done."
];

const waterHistory = [];


// =====================
// INIT
// =====================
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        login();
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function () {
            navigateTo(this.getAttribute('data-page'));
        });
    });

    setMotivationQuote();

    renderFoodLog();
    renderWorkoutList();
    renderGoalsList();
    renderWaterGlasses();
    renderWaterHistory();
    populateFoodList();

    initializeCharts();
});


// =====================
// LOGIN / NAV
// =====================
function login() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
}

function logout() {
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
}

function navigateTo(page) {
    currentPage = page;

    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');

    initializeCharts(); // refresh charts when page opens
}


// =====================
// MOTIVATION
// =====================
function setMotivationQuote() {
    document.getElementById('motivationQuote').textContent =
        motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}


// =====================
// WATER
// =====================
function addWaterGlass() {
    waterGlasses++;
    renderWaterGlasses();
}

function addWater() {
    if (waterGlasses < waterGoal) waterGlasses++;
    updateWaterTrackerPage();
}

function removeWater() {
    if (waterGlasses > 0) waterGlasses--;
    updateWaterTrackerPage();
}

function updateWaterTrackerPage() {
    document.getElementById('waterCount').textContent = `${waterGlasses} / ${waterGoal}`;
    document.getElementById('waterProgress').style.width =
        (waterGlasses / waterGoal) * 100 + '%';

    renderWaterGlasses();
}

function updateWaterGoal() {
    waterGoal = parseInt(document.getElementById('waterGoal').value);
    document.getElementById('waterGoalValue').textContent = waterGoal;
    renderWaterGlasses();
}

function renderWaterGlasses() {
    const container = document.getElementById('waterGlasses');
    container.innerHTML = '';

    for (let i = 0; i < waterGoal; i++) {
        const div = document.createElement('div');
        div.className = i < waterGlasses ? 'water-glass filled' : 'water-glass';
        div.textContent = '💧';
        container.appendChild(div);
    }
}

function renderWaterHistory() {
    const container = document.getElementById('waterHistory');
    container.innerHTML = '';
}


// =====================
// WEIGHT INPUT (IMPORTANT)
// =====================
function addWeightFromInput() {
    const weight = parseFloat(document.getElementById('newWeight').value);

    if (!weight) return;

    weightHistory.push(weight);

    if (weightHistory.length > 15) {
        weightHistory.shift();
    }

    document.getElementById('newWeight').value = '';

    updateWeightCharts();
}


// =====================
// CHARTS
// =====================
function initializeCharts() {
    drawWeightCharts();
}

function updateWeightCharts() {
    drawWeightCharts();
}

function drawWeightCharts() {
    const dash = document.getElementById('weightChart');
    const prog = document.getElementById('progressWeightChart');

    if (dash) drawLine(dash, weightHistory);
    if (prog) drawLine(prog, weightHistory);
}


// =====================
// SIMPLE LINE CHART (SAFE)
// =====================
function drawLine(canvas, data) {
    const ctx = canvas.getContext('2d');

    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = 200;

    ctx.clearRect(0, 0, w, h);

    if (data.length === 0) {
        ctx.fillStyle = "#999";
        ctx.font = "14px Arial";
        ctx.fillText("No data yet", 20, 100);
        return;
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const step = w / (data.length - 1 || 1);

    ctx.beginPath();
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 3;

    data.forEach((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * 160 - 20;

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.stroke();

    data.forEach((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * 160 - 20;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#a855f7";
        ctx.fill();
    });
}


// =====================
// PLACEHOLDER (OTHERS OK LANG)
// =====================
function renderFoodLog() {}
function renderWorkoutList() {}
function renderGoalsList() {}
function populateFoodList() {}

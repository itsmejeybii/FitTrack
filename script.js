// Global State
let currentPage = 'dashboard';
let waterGlasses = 4;
let waterGoal = 8;
let foods = [
    { id: 1, name: 'Oatmeal with banana', calories: 255, meal: 'Breakfast' },
    { id: 2, name: 'Greek yogurt', calories: 130, meal: 'Breakfast' },
    { id: 3, name: 'Grilled chicken salad', calories: 450, meal: 'Lunch' },
    { id: 4, name: 'Apple', calories: 95, meal: 'Snack' }
];

let workouts = [
    { id: 1, name: 'Running', duration: 30, calories: 300, date: '2026-04-27' },
    { id: 2, name: 'Weight Training', duration: 45, calories: 250, date: '2026-04-27' },
    { id: 3, name: 'Yoga', duration: 60, calories: 180, date: '2026-04-26' }
];

let goals = [
    { id: 1, title: 'Lose 5kg', target: '5', current: '2.2', deadline: '2026-06-01', completed: false },
    { id: 2, title: 'Run 5km in under 30 minutes', target: '30', current: '35', deadline: '2026-05-15', completed: false },
    { id: 3, title: 'Workout 5 days a week', target: '5', current: '4', deadline: '2026-04-30', completed: false }
];

const predefinedFoods = [
    { name: 'Chicken Breast (100g)', calories: 165 },
    { name: 'Brown Rice (1 cup)', calories: 216 },
    { name: 'Broccoli (1 cup)', calories: 55 },
    { name: 'Banana', calories: 105 },
    { name: 'Greek Yogurt (1 cup)', calories: 130 },
    { name: 'Almonds (1 oz)', calories: 164 },
    { name: 'Salmon (100g)', calories: 208 },
    { name: 'Eggs (2 large)', calories: 140 },
    { name: 'Avocado', calories: 240 },
    { name: 'Oatmeal (1 cup)', calories: 150 }
];

const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Don't stop when you're tired. Stop when you're done.",
    "The pain you feel today will be the strength you feel tomorrow."
];

const waterHistory = [
    { date: '2026-04-27', glasses: 4 },
    { date: '2026-04-26', glasses: 8 },
    { date: '2026-04-25', glasses: 7 },
    { date: '2026-04-24', glasses: 6 },
    { date: '2026-04-23', glasses: 8 }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Login Form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Set random motivation quote
    setMotivationQuote();

    // Initialize pages
    renderFoodLog();
    renderWorkoutList();
    renderGoalsList();
    renderWaterGlasses();
    renderWaterHistory();
    populateFoodList();

    // Initialize charts (placeholder - you'd need Chart.js or similar library for real charts)
    initializeCharts();
});

// Login Function
function login() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
}

// Logout Function
function logout() {
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
}

// Navigation
function navigateTo(page) {
    currentPage = page;
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });
    
    // Show active page
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(page).classList.add('active');
}

// Set Motivation Quote
function setMotivationQuote() {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('motivationQuote').textContent = quote;
}

// Water Tracker Functions
function addWaterGlass() {
    if (waterGlasses < 8) {
        waterGlasses++;
        updateWaterDisplay();
    }
}

function addWater() {
    if (waterGlasses < waterGoal) {
        waterGlasses++;
        updateWaterTrackerPage();
    }
}

function removeWater() {
    if (waterGlasses > 0) {
        waterGlasses--;
        updateWaterTrackerPage();
    }
}

function updateWaterGoal() {
    waterGoal = parseInt(document.getElementById('waterGoal').value);
    document.getElementById('waterGoalValue').textContent = waterGoal;
    renderWaterGlasses();
}

function updateWaterDisplay() {
    const glasses = document.querySelectorAll('#dashboard .water-glass');
    glasses.forEach((glass, index) => {
        if (index < waterGlasses) {
            glass.classList.add('filled');
        } else {
            glass.classList.remove('filled');
        }
    });
}

function updateWaterTrackerPage() {
    document.getElementById('waterCount').textContent = `${waterGlasses} / ${waterGoal}`;
    const percentage = (waterGlasses / waterGoal) * 100;
    document.getElementById('waterProgress').style.width = percentage + '%';
    renderWaterGlasses();
}

function renderWaterGlasses() {
    const container = document.getElementById('waterGlasses');
    container.innerHTML = '';
    
    for (let i = 0; i < waterGoal; i++) {
        const glass = document.createElement('div');
        glass.className = 'water-glass-item ' + (i < waterGlasses ? 'filled' : 'empty');
        glass.textContent = '💧';
        container.appendChild(glass);
    }
}

function renderWaterHistory() {
    const container = document.getElementById('waterHistory');
    container.innerHTML = '';
    
    waterHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'water-history-item';
        item.innerHTML = `
            <span>${new Date(entry.date).toLocaleDateString()}</span>
            <div class="water-history-progress">
                <div class="water-mini-bar">
                    <div class="water-mini-fill" style="width: ${(entry.glasses / 8) * 100}%"></div>
                </div>
                <span class="blue">${entry.glasses} / 8</span>
            </div>
        `;
        container.appendChild(item);
    });
}

// Calorie Tracker Functions
function showManualInput() {
    const form = document.getElementById('manualInputForm');
    const foodList = document.getElementById('foodListContainer');
    
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        foodList.classList.add('hidden');
    } else {
        form.classList.add('hidden');
    }
}

function showFoodList() {
    const form = document.getElementById('manualInputForm');
    const foodList = document.getElementById('foodListContainer');
    
    if (foodList.classList.contains('hidden')) {
        foodList.classList.remove('hidden');
        form.classList.add('hidden');
    } else {
        foodList.classList.add('hidden');
    }
}

function populateFoodList() {
    const container = document.getElementById('foodList');
    container.innerHTML = '';
    
    predefinedFoods.forEach(food => {
        const item = document.createElement('div');
        item.className = 'food-item';
        item.innerHTML = `
            <span>${food.name}</span>
            <span>${food.calories} cal</span>
        `;
        item.onclick = () => addPredefinedFood(food);
        container.appendChild(item);
    });
}

function filterFoods() {
    const search = document.getElementById('foodSearch').value.toLowerCase();
    const container = document.getElementById('foodList');
    container.innerHTML = '';
    
    predefinedFoods
        .filter(food => food.name.toLowerCase().includes(search))
        .forEach(food => {
            const item = document.createElement('div');
            item.className = 'food-item';
            item.innerHTML = `
                <span>${food.name}</span>
                <span>${food.calories} cal</span>
            `;
            item.onclick = () => addPredefinedFood(food);
            container.appendChild(item);
        });
}

function addFood() {
    const name = document.getElementById('foodName').value;
    const calories = parseInt(document.getElementById('foodCalories').value);
    const meal = document.getElementById('mealSelect').value;
    
    if (name && calories) {
        foods.push({
            id: Date.now(),
            name: name,
            calories: calories,
            meal: meal
        });
        
        document.getElementById('foodName').value = '';
        document.getElementById('foodCalories').value = '';
        document.getElementById('manualInputForm').classList.add('hidden');
        
        renderFoodLog();
    }
}

function addPredefinedFood(food) {
    const meal = document.getElementById('mealSelect').value;
    
    foods.push({
        id: Date.now(),
        name: food.name,
        calories: food.calories,
        meal: meal
    });
    
    document.getElementById('foodListContainer').classList.add('hidden');
    renderFoodLog();
}

function deleteFood(id) {
    foods = foods.filter(f => f.id !== id);
    renderFoodLog();
}

function renderFoodLog() {
    const container = document.getElementById('foodLogContainer');
    container.innerHTML = '';
    
    const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    
    meals.forEach(meal => {
        const mealFoods = foods.filter(f => f.meal === meal);
        
        if (mealFoods.length > 0) {
            const mealGroup = document.createElement('div');
            mealGroup.className = 'meal-group';
            mealGroup.innerHTML = `<h3>${meal}</h3>`;
            
            mealFoods.forEach(food => {
                const foodItem = document.createElement('div');
                foodItem.className = 'food-log-item';
                foodItem.innerHTML = `
                    <div class="food-log-info">
                        <h4>${food.name}</h4>
                        <p class="text-sm">${food.calories} calories</p>
                    </div>
                    <button class="delete-btn" onclick="deleteFood(${food.id})">🗑️</button>
                `;
                mealGroup.appendChild(foodItem);
            });
            
            container.appendChild(mealGroup);
        }
    });
}

// Workout Functions
function toggleWorkoutForm() {
    const form = document.getElementById('workoutForm');
    form.classList.toggle('hidden');
}

function addWorkout() {
    const name = document.getElementById('workoutName').value;
    const duration = parseInt(document.getElementById('workoutDuration').value);
    const calories = parseInt(document.getElementById('workoutCalories').value);
    
    if (name && duration && calories) {
        workouts.unshift({
            id: Date.now(),
            name: name,
            duration: duration,
            calories: calories,
            date: new Date().toISOString().split('T')[0]
        });
        
        document.getElementById('workoutName').value = '';
        document.getElementById('workoutDuration').value = '';
        document.getElementById('workoutCalories').value = '';
        document.getElementById('workoutForm').classList.add('hidden');
        
        renderWorkoutList();
        updateWorkoutStats();
    }
}

function deleteWorkout(id) {
    workouts = workouts.filter(w => w.id !== id);
    renderWorkoutList();
    updateWorkoutStats();
}

function renderWorkoutList() {
    const container = document.getElementById('workoutList');
    container.innerHTML = '';
    
    workouts.forEach(workout => {
        const item = document.createElement('div');
        item.className = 'workout-item';
        item.innerHTML = `
            <div class="workout-info">
                <h3>${workout.name}</h3>
                <div class="workout-details">
                    <span>${workout.duration} minutes</span>
                    <span>${workout.calories} calories burned</span>
                    <span>${new Date(workout.date).toLocaleDateString()}</span>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteWorkout(${workout.id})">🗑️</button>
        `;
        container.appendChild(item);
    });
}

function updateWorkoutStats() {
    const total = workouts.length;
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    
    document.getElementById('totalWorkouts').textContent = total;
    document.getElementById('totalDuration').textContent = totalDuration + ' min';
    document.getElementById('caloriesBurned').textContent = totalCalories;
}

// BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const height = parseFloat(document.getElementById('bmiHeight').value) / 100; // Convert to meters
    
    if (weight > 0 && height > 0) {
        const bmi = (weight / (height * height)).toFixed(1);
        let category = '';
        let color = '';
        let position = 50;
        
        if (bmi < 18.5) {
            category = 'Underweight';
            color = 'blue';
            position = (bmi / 18.5) * 20;
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal Weight';
            color = 'green';
            position = 20 + ((bmi - 18.5) / 6.5) * 30;
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            color = 'yellow';
            position = 50 + ((bmi - 25) / 5) * 25;
        } else {
            category = 'Obese';
            color = 'red';
            position = Math.min(75 + ((bmi - 30) / 10) * 25, 100);
        }
        
        document.getElementById('bmiValue').textContent = bmi;
        document.getElementById('bmiCategory').textContent = category;
        document.getElementById('bmiCategory').className = 'bmi-category ' + color;
        document.getElementById('bmiPointer').style.left = position + '%';
        document.querySelector('.bmi-pointer-value').textContent = bmi;
    }
}

// Goals Functions
function toggleGoalForm() {
    const form = document.getElementById('goalForm');
    form.classList.toggle('hidden');
}

function addGoal() {
    const title = document.getElementById('goalTitle').value;
    const target = document.getElementById('goalTarget').value;
    const current = document.getElementById('goalCurrent').value;
    const deadline = document.getElementById('goalDeadline').value;
    
    if (title && target && current && deadline) {
        goals.push({
            id: Date.now(),
            title: title,
            target: target,
            current: current,
            deadline: deadline,
            completed: false
        });
        
        document.getElementById('goalTitle').value = '';
        document.getElementById('goalTarget').value = '';
        document.getElementById('goalCurrent').value = '';
        document.getElementById('goalDeadline').value = '';
        document.getElementById('goalForm').classList.add('hidden');
        
        renderGoalsList();
        updateGoalsStats();
    }
}

function toggleGoal(id) {
    const goal = goals.find(g => g.id === id);
    if (goal) {
        goal.completed = !goal.completed;
        renderGoalsList();
        updateGoalsStats();
    }
}

function deleteGoal(id) {
    goals = goals.filter(g => g.id !== id);
    renderGoalsList();
    updateGoalsStats();
}

function renderGoalsList() {
    const container = document.getElementById('goalsList');
    container.innerHTML = '';
    
    goals.forEach(goal => {
        const progress = Math.min((parseFloat(goal.current) / parseFloat(goal.target)) * 100, 100);
        
        const item = document.createElement('div');
        item.className = 'goal-item' + (goal.completed ? ' completed' : '');
        item.innerHTML = `
            <div class="goal-header">
                <div class="goal-checkbox ${goal.completed ? 'checked' : ''}" onclick="toggleGoal(${goal.id})"></div>
                <div class="goal-content">
                    <h3 class="goal-title ${goal.completed ? 'completed' : ''}">${goal.title}</h3>
                    <div class="goal-meta">
                        <span>Target: ${goal.target}</span>
                        <span>Current: ${goal.current}</span>
                        <span>Deadline: ${new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${goal.completed ? 'green' : 'blue'}" style="width: ${progress}%"></div>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteGoal(${goal.id})">🗑️</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function updateGoalsStats() {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const inProgress = total - completed;
    
    document.getElementById('totalGoals').textContent = total;
    document.getElementById('completedGoals').textContent = completed;
    document.getElementById('inProgressGoals').textContent = inProgress;
}

// Settings Functions
function resetData() {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        foods = [];
        workouts = [];
        goals = [];
        waterGlasses = 0;
        
        renderFoodLog();
        renderWorkoutList();
        renderGoalsList();
        updateWaterDisplay();
        updateWaterTrackerPage();
        
        alert('All data has been reset!');
    }
}

// Simple chart placeholders (you'd need Chart.js library for actual charts)
function initializeCharts() {
    // Placeholder for weight chart
    const weightCanvas = document.getElementById('weightChart');
    if (weightCanvas) {
        drawSimpleLineChart(weightCanvas, [85, 84, 83.5, 82.8]);
    }
    
    const progressWeightCanvas = document.getElementById('progressWeightChart');
    if (progressWeightCanvas) {
        drawSimpleLineChart(progressWeightCanvas, [85, 84, 83.5, 82.8]);
    }
    
    const weeklyWorkoutsCanvas = document.getElementById('weeklyWorkoutsChart');
    if (weeklyWorkoutsCanvas) {
        drawSimpleBarChart(weeklyWorkoutsCanvas, [1, 2, 1, 0, 2, 1, 0]);
    }
    
    const calorieIntakeCanvas = document.getElementById('calorieIntakeChart');
    if (calorieIntakeCanvas) {
        drawSimpleLineChart(calorieIntakeCanvas, [2100, 2300, 2000, 2150, 2250, 2400, 1850]);
    }
}

function drawSimpleLineChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 200;
    
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const step = width / (data.length - 1);
    
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = index * step;
        const y = height - ((value - min) / range) * (height - 40) - 20;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#a855f7';
    data.forEach((value, index) => {
        const x = index * step;
        const y = height - ((value - min) / range) * (height - 40) - 20;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawSimpleBarChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 200;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#3b82f6';
    
    const max = Math.max(...data);
    const barWidth = (width / data.length) - 10;
    
    data.forEach((value, index) => {
        const barHeight = (value / max) * (height - 40);
        const x = index * (width / data.length) + 5;
        const y = height - barHeight - 20;
        
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]);
        ctx.fill();
    });
}

// Polyfill for roundRect (older browsers)
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radii) {
        this.moveTo(x + radii[0], y);
        this.lineTo(x + width - radii[1], y);
        this.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
        this.lineTo(x + width, y + height);
        this.lineTo(x, y + height);
        this.lineTo(x, y + radii[0]);
        this.quadraticCurveTo(x, y, x + radii[0], y);
    };
}

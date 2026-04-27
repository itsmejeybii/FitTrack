const AppData = {
    init() {
        const saved = localStorage.getItem('fitnessData');
        if (saved) {
            return JSON.parse(saved);
        }
        return this.getDefaultData();
    },
    
    getDefaultData() {
        return {
            dailyCalories: 0,
            workouts: 0,
            currentBMI: 0,
            weight: 0,
            height: 0,
            recentFoods: [],
            recentWorkouts: [],
            weightHistory: [
                { id: 'w1', date: 'Week 1', weight: 0 },
                { id: 'w2', date: 'Week 2', weight: 0 },
                { id: 'w3', date: 'Week 3', weight: 0 },
                { id: 'w4', date: 'Week 4', weight: 0 },
            ],
            goals: [],
            waterGlasses: 0,
            waterGoal: 8,
            profile: {
                name: '',
                email: '',
                age: '',
                gender: '',
            },
        };
    },
    
    save(data) {
        localStorage.setItem('fitnessData', JSON.stringify(data));
    },
    
    reset() {
        const defaultData = this.getDefaultData();
        this.save(defaultData);
        return defaultData;
    }
};

let isLoggedIn = false;
let currentPage = 'dashboard';
let userData = AppData.init();
let charts = {};

const commonFoods = [
    { name: 'Apple', calories: 95 },
    { name: 'Banana', calories: 105 },
    { name: 'Chicken Breast (100g)', calories: 165 },
    { name: 'Rice (1 cup)', calories: 206 },
    { name: 'Bread (1 slice)', calories: 79 },
    { name: 'Egg', calories: 78 },
    { name: 'Milk (1 cup)', calories: 149 },
    { name: 'Salmon (100g)', calories: 208 },
    { name: 'Broccoli (1 cup)', calories: 55 },
    { name: 'Pasta (1 cup)', calories: 221 },
];

const commonWorkouts = [
    { name: 'Running (30 min)', calories: 300 },
    { name: 'Cycling (30 min)', calories: 250 },
    { name: 'Swimming (30 min)', calories: 350 },
    { name: 'Weight Training (30 min)', calories: 180 },
    { name: 'Yoga (30 min)', calories: 120 },
    { name: 'Walking (30 min)', calories: 150 },
    { name: 'Jump Rope (30 min)', calories: 400 },
    { name: 'Pilates (30 min)', calories: 140 },
    { name: 'HIIT (30 min)', calories: 450 },
    { name: 'Dancing (30 min)', calories: 220 },
];

const motivationalQuotes = [
    "Your only limit is you.",
    "Push yourself, because no one else is going to do it for you.",
    "The body achieves what the mind believes.",
    "Success starts with self-discipline.",
    "Make yourself proud.",
    "Don't wish for it, work for it.",
    "Sweat is magic. Cover yourself in it daily.",
    "The only bad workout is the one that didn't happen."
];

const tips = [
    "Drink at least 8 glasses of water daily",
    "Get 7-9 hours of sleep each night",
    "Take the stairs instead of the elevator",
    "Do a 5-minute stretch every morning",
    "Add more vegetables to your meals"
];

function navigateTo(page) {
    currentPage = page;
    render();
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (username && password) {
        isLoggedIn = true;
        render();
    }
}

function handleLogout() {
    isLoggedIn = false;
    currentPage = 'dashboard';
    render();
}

function updateData(newData) {
    userData = newData;
    AppData.save(userData);
    render();
}

function resetData() {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        userData = AppData.reset();
        render();
    }
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'Underweight', color: '#60a5fa', description: 'You may need to gain weight' };
    if (bmi < 25) return { category: 'Normal', color: '#34d399', description: 'You have a healthy weight' };
    if (bmi < 30) return { category: 'Overweight', color: '#fbbf24', description: 'You may need to lose weight' };
    return { category: 'Obese', color: '#f87171', description: 'Consult a healthcare provider' };
}

function createChart(canvasId, type, data, options) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    charts[canvasId] = new Chart(ctx, {
        type: type,
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: options.showLegend || false,
                    labels: { color: '#9ca3af' }
                }
            },
            scales: options.scales || {}
        }
    });
}

function renderLogin() {
    return `
        <div class="login-container">
            <div class="login-content">
                <div class="login-header">
                    <div class="login-icon">💪</div>
                    <h1 class="login-title">Fitness Tracker</h1>
                    <p class="login-subtitle">Track your fitness journey</p>
                </div>
                <div class="login-box">
                    <form onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label for="login-username" class="form-label">Username</label>
                            <input
                                id="login-username"
                                type="text"
                                class="form-input"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label for="login-password" class="form-label">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                class="form-input"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button type="submit" class="btn-primary">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function renderSidebar() {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'calorie-tracker', label: 'Calorie Tracker', icon: '🍎' },
        { id: 'workout-planner', label: 'Workout Planner', icon: '💪' },
        { id: 'bmi-calculator', label: 'BMI Calculator', icon: '🧮' },
        { id: 'progress-tracker', label: 'Progress Tracker', icon: '📈' },
        { id: 'goals', label: 'Goals', icon: '🎯' },
        { id: 'water-tracker', label: 'Water Tracker', icon: '💧' },
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];
    
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    
    return `
        <div class="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <div class="sidebar-icon">💪</div>
                    <div>
                        <div class="sidebar-title">Fitness Tracker</div>
                        <div class="sidebar-subtitle">Stay healthy</div>
                    </div>
                </div>
            </div>
            <nav class="sidebar-nav">
                ${menuItems.map(item => `
                    <button
                        class="nav-item ${currentPage === item.id ? 'active' : ''}"
                        onclick="navigateTo('${item.id}')"
                    >
                        <span class="nav-icon">${item.icon}</span>
                        <span>${item.label}</span>
                    </button>
                `).join('')}
            </nav>
            <div class="sidebar-footer">
                <div class="motivation-box">
                    <div class="motivation-header">
                        <span>✨</span>
                        <div>
                            <div class="motivation-title">Daily Motivation</div>
                            <p class="motivation-text">${randomQuote}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderDashboard() {
    const bmiCategory = getBMICategory(userData.currentBMI);
    
    return `
        <div class="main-content">
            <div class="max-w-7xl">
                <div class="content-header">
                    <h1 class="content-title">Dashboard</h1>
                    <p class="content-subtitle">Track your fitness journey</p>
                </div>

                <div class="grid grid-4">
                    <div class="card">
                        <div class="card-header-left">
                            <div class="card-icon icon-orange">🔥</div>
                            <h3 class="card-title">Daily Calories</h3>
                        </div>
                        <p class="card-value">${userData.dailyCalories} kcal</p>
                        <p class="card-label">of 2000 kcal goal</p>
                        <div class="progress-bar">
                            <div class="progress-fill progress-orange" style="width: ${Math.min((userData.dailyCalories / 2000) * 100, 100)}%"></div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header-left">
                            <div class="card-icon icon-blue">💪</div>
                            <h3 class="card-title">Workouts</h3>
                        </div>
                        <p class="card-value">${userData.workouts}</p>
                        <p class="card-label">sessions this week</p>
                    </div>

                    <div class="card">
                        <div class="card-header-left">
                            <div class="card-icon icon-green">🧮</div>
                            <h3 class="card-title">Current BMI</h3>
                        </div>
                        <p class="card-value">${userData.currentBMI.toFixed(1)}</p>
                        <p class="card-label">${bmiCategory.category}</p>
                    </div>

                    <div class="card">
                        <div class="card-header-left">
                            <div class="card-icon icon-purple">⚖️</div>
                            <h3 class="card-title">Weight</h3>
                        </div>
                        <p class="card-value">${userData.weight} kg</p>
                        <p class="card-label">Current weight</p>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-header-left">
                                <span style="font-size: 1.5rem;">🍎</span>
                                <h3 class="card-title">Calorie Tracker</h3>
                            </div>
                            <button onclick="navigateTo('calorie-tracker')" class="btn btn-white">View All</button>
                        </div>
                        ${userData.recentFoods.length > 0 ? `
                            ${userData.recentFoods.slice(0, 3).map(food => `
                                <div class="list-item">
                                    <span class="list-item-title">${food.name}</span>
                                    <span style="color: #fff;">${food.calories} kcal</span>
                                </div>
                            `).join('')}
                        ` : `
                            <div class="empty-state">
                                <div class="empty-icon">🔍</div>
                                <p class="empty-state-title">No food entries yet</p>
                            </div>
                        `}
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <div class="card-header-left">
                                <span style="font-size: 1.5rem;">💪</span>
                                <h3 class="card-title">Workout Planner</h3>
                            </div>
                            <button onclick="navigateTo('workout-planner')" class="btn btn-white">View All</button>
                        </div>
                        ${userData.recentWorkouts.length > 0 ? `
                            ${userData.recentWorkouts.slice(0, 3).map(workout => `
                                <div class="list-item">
                                    <span class="list-item-title">${workout.name}</span>
                                    <span style="color: #fff;">${workout.calories} kcal</span>
                                </div>
                            `).join('')}
                        ` : `
                            <div class="empty-state">
                                <div class="empty-icon">💪</div>
                                <p class="empty-state-title">No workout entries yet</p>
                            </div>
                        `}
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="card">
                        <div class="card-header-left">
                            <span style="font-size: 1.5rem;">⚖️</span>
                            <h3 class="card-title">BMI Calculator</h3>
                        </div>
                        <div class="stats-grid" style="margin: 1rem 0;">
                            <div>
                                <p class="card-label">Weight</p>
                                <p style="color: #fff; font-size: 1.125rem;">${userData.weight} kg</p>
                            </div>
                            <div>
                                <p class="card-label">Height</p>
                                <p style="color: #fff; font-size: 1.125rem;">${userData.height} cm</p>
                            </div>
                        </div>
                        <div class="bmi-result">
                            <p class="card-label">Your BMI</p>
                            <p class="bmi-value">${userData.currentBMI.toFixed(1)}</p>
                            <p style="color: ${bmiCategory.color}; font-size: 0.875rem;">${bmiCategory.category}</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header-left">
                            <span style="font-size: 1.5rem;">📈</span>
                            <h3 class="card-title">Weight Progress</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="dashboard-weight-chart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="card">
                        <div class="card-header-left">
                            <span style="font-size: 1.5rem;">💡</span>
                            <h3 class="card-title">Quick Tips</h3>
                        </div>
                        <div class="tips-list">
                            ${tips.map(tip => `
                                <div class="tip-item">
                                    <div class="tip-bullet">
                                        <div class="tip-bullet-dot"></div>
                                    </div>
                                    <p class="tip-text">${tip}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header-left">
                            <span style="font-size: 1.5rem;">💧</span>
                            <h3 class="card-title">Water Tracker</h3>
                        </div>
                        <div class="text-center mb-2">
                            <span class="water-count">${userData.waterGlasses}</span>
                            <span class="water-goal"> / ${userData.waterGoal}</span>
                            <p class="card-label">glasses today</p>
                        </div>
                        <div class="water-glasses">
                            ${Array.from({ length: userData.waterGoal }).map((_, i) => `
                                <div class="water-glass ${i < userData.waterGlasses ? 'filled' : 'empty'}"></div>
                            `).join('')}
                        </div>
                        <div style="display: flex; gap: 0.75rem;">
                            <button onclick="addWaterGlass()" class="btn btn-blue flex-1">➕ Add Glass</button>
                            <button onclick="resetWater()" class="btn btn-dark">Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCalorieTracker() {
    const totalCalories = userData.recentFoods.reduce((sum, food) => sum + food.calories, 0);
    
    return `
        <div class="main-content">
            <div class="max-w-4xl">
                <div class="content-header">
                    <h1 class="content-title">Calorie Tracker</h1>
                    <p class="content-subtitle">Track your daily food intake</p>
                </div>

                <div class="card mb-4">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p class="card-label">Total Calories Today</p>
                            <p class="card-value" style="font-size: 2.25rem;">${totalCalories} kcal</p>
                        </div>
                        <div style="text-align: right;">
                            <p class="card-label">Goal</p>
                            <p class="card-value" style="font-size: 2.25rem;">2000 kcal</p>
                        </div>
                    </div>
                    <div class="progress-bar" style="height: 1rem;">
                        <div class="progress-fill progress-orange" style="width: ${Math.min((totalCalories / 2000) * 100, 100)}%"></div>
                    </div>
                </div>

                <div class="grid grid-2 mb-4">
                    <div class="card">
                        <h3 class="card-title mb-2">Manual Entry</h3>
                        <div class="form-group">
                            <label class="form-label">Food Name</label>
                            <input id="manual-food" type="text" class="form-input" placeholder="Enter food name" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Calories</label>
                            <input id="manual-calories" type="number" class="form-input" placeholder="Enter calories" />
                        </div>
                        <button onclick="addManualFood()" class="btn btn-white btn-full">➕ Add Food</button>
                    </div>

                    <div class="card">
                        <h3 class="card-title mb-2">Quick Add</h3>
                        <div class="form-group">
                            <label class="form-label">Choose Food</label>
                            <select id="quick-food">
                                <option value="">Select a food</option>
                                ${commonFoods.map(food => `
                                    <option value="${food.name}|${food.calories}">${food.name} - ${food.calories} kcal</option>
                                `).join('')}
                            </select>
                        </div>
                        <button onclick="addQuickFood()" class="btn btn-white btn-full">➕ Add Selected Food</button>
                    </div>
                </div>

                <div class="card">
                    <h3 class="card-title mb-2">Food History</h3>
                    ${userData.recentFoods.length > 0 ? `
                        ${userData.recentFoods.map((food, index) => `
                            <div class="list-item">
                                <div>
                                    <p class="list-item-title">${food.name}</p>
                                    <p class="list-item-subtitle">${new Date(food.date).toLocaleDateString()}</p>
                                </div>
                                <div class="list-item-actions">
                                    <span style="color: #fff;">${food.calories} kcal</span>
                                    <button onclick="deleteFood(${index})" class="icon-btn icon-btn-red">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    ` : `
                        <div class="empty-state">
                            <div class="empty-icon">🔍</div>
                            <p class="empty-state-title">No food entries yet</p>
                            <p class="empty-state-subtitle">Start tracking your calories above</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

function renderWorkoutPlanner() {
    const totalCaloriesBurned = userData.recentWorkouts.reduce((sum, workout) => sum + workout.calories, 0);
    
    return `
        <div class="main-content">
            <div class="max-w-4xl">
                <div class="content-header">
                    <h1 class="content-title">Workout Planner</h1>
                    <p class="content-subtitle">Track your workouts and calories burned</p>
                </div>

                <div class="card mb-4">
                    <div class="stats-grid">
                        <div>
                            <p class="card-label">Total Workouts</p>
                            <p class="card-value" style="font-size: 2.25rem;">${userData.workouts}</p>
                        </div>
                        <div>
                            <p class="card-label">Calories Burned</p>
                            <p class="card-value" style="font-size: 2.25rem;">${totalCaloriesBurned}</p>
                        </div>
                        <div>
                            <p class="card-label">This Week</p>
                            <p class="card-value" style="font-size: 2.25rem;">${userData.workouts}</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-2 mb-4">
                    <div class="card">
                        <h3 class="card-title mb-2">Manual Entry</h3>
                        <div class="form-group">
                            <label class="form-label">Workout Name</label>
                            <input id="manual-workout" type="text" class="form-input" placeholder="Enter workout name" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Calories Burned</label>
                            <input id="manual-workout-calories" type="number" class="form-input" placeholder="Enter calories burned" />
                        </div>
                        <button onclick="addManualWorkout()" class="btn btn-white btn-full">➕ Add Workout</button>
                    </div>

                    <div class="card">
                        <h3 class="card-title mb-2">Quick Add</h3>
                        <div class="form-group">
                            <label class="form-label">Choose Workout</label>
                            <select id="quick-workout">
                                <option value="">Select a workout</option>
                                ${commonWorkouts.map(workout => `
                                    <option value="${workout.name}|${workout.calories}">${workout.name} - ${workout.calories} kcal</option>
                                `).join('')}
                            </select>
                        </div>
                        <button onclick="addQuickWorkout()" class="btn btn-white btn-full">➕ Add Selected Workout</button>
                    </div>
                </div>

                <div class="card">
                    <h3 class="card-title mb-2">Workout History</h3>
                    ${userData.recentWorkouts.length > 0 ? `
                        ${userData.recentWorkouts.map((workout, index) => `
                            <div class="list-item">
                                <div class="list-item-content">
                                    <div class="card-icon icon-blue" style="padding: 0.5rem; font-size: 1.25rem;">💪</div>
                                    <div>
                                        <p class="list-item-title">${workout.name}</p>
                                        <p class="list-item-subtitle">${new Date(workout.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div class="list-item-actions">
                                    <span style="color: #fff;">${workout.calories} kcal burned</span>
                                    <button onclick="deleteWorkout(${index})" class="icon-btn icon-btn-red">🗑️</button>
                                </div>
                            </div>
                        `).join('')}
                    ` : `
                        <div class="empty-state">
                            <div class="empty-icon">💪</div>
                            <p class="empty-state-title">No workouts yet</p>
                            <p class="empty-state-subtitle">Start tracking your workouts above</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

function renderBMICalculator() {
    const bmiInfo = getBMICategory(userData.currentBMI);
    const bmiRanges = [
        { category: 'Underweight', range: '< 18.5', color: '#60a5fa', min: 0, max: 18.5 },
        { category: 'Normal', range: '18.5 - 24.9', color: '#34d399', min: 18.5, max: 24.9 },
        { category: 'Overweight', range: '25 - 29.9', color: '#fbbf24', min: 25, max: 29.9 },
        { category: 'Obese', range: '≥ 30', color: '#f87171', min: 30, max: 50 },
    ];
    
    return `
        <div class="main-content">
            <div class="max-w-4xl">
                <div class="content-header">
                    <h1 class="content-title">BMI Calculator</h1>
                    <p class="content-subtitle">Calculate your Body Mass Index</p>
                </div>

                <div class="grid grid-2">
                    <div class="card">
                        <div class="card-header-left mb-2">
                            <span style="font-size: 1.5rem;">🧮</span>
                            <h3 class="card-title">Calculate BMI</h3>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Weight (kg)</label>
                            <input id="bmi-weight" type="number" class="form-input" value="${userData.weight}" placeholder="Enter your weight" />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Height (cm)</label>
                            <input id="bmi-height" type="number" class="form-input" value="${userData.height}" placeholder="Enter your height" />
                        </div>
                        
                        <button onclick="calculateBMI()" class="btn btn-white btn-full">Calculate</button>
                        
                        <div class="bmi-result">
                            <p class="card-label">Your BMI</p>
                            <p style="font-size: 3.75rem; color: #fff; margin: 0.5rem 0;">${userData.currentBMI.toFixed(1)}</p>
                            <p style="font-size: 1.25rem; color: ${bmiInfo.color}; margin-bottom: 0.5rem;">${bmiInfo.category}</p>
                            <p class="card-label">${bmiInfo.description}</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title mb-4">BMI Categories</h3>
                        <div class="bmi-categories">
                            ${bmiRanges.map(range => {
                                const isActive = bmiInfo.category === range.category;
                                return `
                                    <div class="bmi-category">
                                        <div class="bmi-category-header">
                                            <span style="color: #fff;">${range.category}</span>
                                            <span style="color: #9ca3af;">${range.range}</span>
                                        </div>
                                        <div class="bmi-bar">
                                            <div class="bmi-bar-fill" style="width: 100%; background-color: ${range.color}; opacity: ${isActive ? 1 : 0.3};"></div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        
                        <div class="card" style="margin-top: 2rem; background-color: #27272a;">
                            <h4 class="card-title mb-2">About BMI</h4>
                            <p style="color: #9ca3af; font-size: 0.875rem; line-height: 1.6;">
                                Body Mass Index (BMI) is a measure of body fat based on height and weight.
                                While it's a useful screening tool, it doesn't directly measure body fat
                                percentage and may not be accurate for athletes or people with high muscle mass.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderProgressTracker() {
    const calorieData = [
        { id: 'mon', date: 'Mon', consumed: 1800, burned: 400 },
        { id: 'tue', date: 'Tue', consumed: 2100, burned: 350 },
        { id: 'wed', date: 'Wed', consumed: 1950, burned: 450 },
        { id: 'thu', date: 'Thu', consumed: 2050, burned: 380 },
        { id: 'fri', date: 'Fri', consumed: 1900, burned: 420 },
        { id: 'sat', date: 'Sat', consumed: 2200, burned: 500 },
        { id: 'sun', date: 'Sun', consumed: 2000, burned: 300 },
    ];
    
    return `
        <div class="main-content">
            <div class="max-w-7xl">
                <div class="content-header">
                    <h1 class="content-title">Progress Tracker</h1>
                    <p class="content-subtitle">Monitor your fitness journey</p>
                </div>

                <div class="grid grid-3 mb-4">
                    <div class="card">
                        <p class="card-label">Current Weight</p>
                        <p class="card-value" style="font-size: 2.25rem;">${userData.weight} kg</p>
                        <p style="color: #22c55e; font-size: 0.875rem;">Target: 70 kg</p>
                    </div>
                    <div class="card">
                        <p class="card-label">Total Workouts</p>
                        <p class="card-value" style="font-size: 2.25rem;">${userData.workouts}</p>
                        <p style="color: #3b82f6; font-size: 0.875rem;">This week</p>
                    </div>
                    <div class="card">
                        <p class="card-label">BMI</p>
                        <p class="card-value" style="font-size: 2.25rem;">${userData.currentBMI.toFixed(1)}</p>
                        <p class="card-label">Body Mass Index</p>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header-left mb-4">
                        <span style="font-size: 1.5rem;">📈</span>
                        <h3 class="card-title">Weight Progress</h3>
                    </div>
                    <div class="chart-container-large">
                        <canvas id="progress-weight-chart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <h3 class="card-title mb-4">Weekly Calorie Overview</h3>
                    <div class="chart-container-large">
                        <canvas id="progress-calorie-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderGoals() {
    const activeGoals = (userData.goals || []).filter(goal => !goal.completed);
    const completedGoals = (userData.goals || []).filter(goal => goal.completed);
    
    return `
        <div class="main-content">
            <div class="max-w-4xl">
                <div class="content-header">
                    <h1 class="content-title">Goals</h1>
                    <p class="content-subtitle">Set and track your fitness goals</p>
                </div>

                <div class="card mb-4">
                    <h3 class="card-title mb-2">Add New Goal</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Goal</label>
                            <input id="goal-text" type="text" class="form-input" placeholder="e.g., Lose 5kg" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Target Date</label>
                            <input id="goal-target" type="date" class="form-input" />
                        </div>
                    </div>
                    <button onclick="addGoal()" class="btn btn-white btn-full">➕ Add Goal</button>
                </div>

                <div class="card mb-4">
                    <div class="card-header-left mb-2">
                        <span style="font-size: 1.5rem;">🎯</span>
                        <h3 class="card-title">Active Goals</h3>
                        <span class="badge badge-blue">${activeGoals.length}</span>
                    </div>
                    ${activeGoals.length > 0 ? `
                        ${activeGoals.map((goal, index) => `
                            <div class="goal-item">
                                <div class="goal-content">
                                    <button onclick="toggleGoal(${userData.goals.indexOf(goal)})" class="goal-checkbox"></button>
                                    <div class="goal-text">
                                        <p class="goal-title">${goal.text}</p>
                                        <p class="goal-target">Target: ${new Date(goal.target).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button onclick="deleteGoal(${userData.goals.indexOf(goal)})" class="icon-btn icon-btn-red">🗑️</button>
                            </div>
                        `).join('')}
                    ` : `
                        <div class="empty-state">
                            <div class="empty-icon">🎯</div>
                            <p class="empty-state-title">No active goals</p>
                            <p class="empty-state-subtitle">Set a goal to get started</p>
                        </div>
                    `}
                </div>

                <div class="card">
                    <div class="card-header-left mb-2">
                        <span style="font-size: 1.5rem;">✅</span>
                        <h3 class="card-title">Completed Goals</h3>
                        <span class="badge badge-green">${completedGoals.length}</span>
                    </div>
                    ${completedGoals.length > 0 ? `
                        ${completedGoals.map((goal, index) => `
                            <div class="goal-item goal-completed">
                                <div class="goal-content">
                                    <button onclick="toggleGoal(${userData.goals.indexOf(goal)})" class="goal-checkbox checked">✓</button>
                                    <div class="goal-text">
                                        <p class="goal-title">${goal.text}</p>
                                        <p class="goal-target">Completed</p>
                                    </div>
                                </div>
                                <button onclick="deleteGoal(${userData.goals.indexOf(goal)})" class="icon-btn icon-btn-red">🗑️</button>
                            </div>
                        `).join('')}
                    ` : `
                        <div class="empty-state">
                            <div class="empty-icon">✅</div>
                            <p class="empty-state-title">No completed goals yet</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

function renderWaterTracker() {
    const percentage = Math.min((userData.waterGlasses / userData.waterGoal) * 100, 100);
    
    return `
        <div class="main-content">
            <div class="max-w-2xl">
                <div class="content-header">
                    <h1 class="content-title">Water Tracker</h1>
                    <p class="content-subtitle">Stay hydrated throughout the day</p>
                </div>

                <div class="card mb-4">
                    <div class="text-center mb-4">
                        <div class="card-icon icon-blue" style="display: inline-flex; padding: 1.5rem; margin-bottom: 1rem; font-size: 4rem;">💧</div>
                        <div class="water-display">
                            <span class="water-count">${userData.waterGlasses}</span>
                            <span class="water-goal"> / ${userData.waterGoal}</span>
                        </div>
                        <p class="card-label">glasses of water</p>
                    </div>

                    <div class="mb-4">
                        <div class="progress-bar" style="height: 1.5rem; margin-bottom: 0.5rem;">
                            <div class="progress-fill" style="background: linear-gradient(to right, #3b82f6, #06b6d4); width: ${percentage}%;"></div>
                        </div>
                    </div>

                    <div class="water-controls mb-4">
                        <button onclick="removeWaterGlass()" class="btn btn-dark">➖ Remove</button>
                        <button onclick="addWaterGlass()" class="btn btn-blue">➕ Add Glass</button>
                        <button onclick="resetWater()" class="btn btn-dark">🔄 Reset</button>
                    </div>

                    <div class="water-glasses">
                        ${Array.from({ length: userData.waterGoal }).map((_, i) => `
                            <div class="water-glass ${i < userData.waterGlasses ? 'filled' : 'empty'}"></div>
                        `).join('')}
                    </div>
                </div>

                <div class="card mb-4">
                    <h3 class="card-title mb-2">Daily Goal</h3>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <input
                            id="water-goal-slider"
                            type="range"
                            min="1"
                            max="20"
                            value="${userData.waterGoal}"
                            oninput="updateWaterGoal(this.value)"
                            style="flex: 1;"
                        />
                        <span style="color: #fff; font-size: 1.25rem; width: 4rem; text-align: center;">${userData.waterGoal}</span>
                    </div>
                    <p class="card-label mt-2">Recommended: 8 glasses per day (2 liters)</p>
                </div>

                <div class="card">
                    <h3 class="card-title mb-2">Benefits of Staying Hydrated</h3>
                    <div class="tips-list">
                        ${[
                            'Improves physical performance',
                            'Boosts energy and brain function',
                            'Helps with weight loss',
                            'Prevents headaches',
                            'Aids digestion',
                            'Maintains healthy skin',
                        ].map(benefit => `
                            <div class="tip-item">
                                <div class="tip-bullet">
                                    <div class="tip-bullet-dot"></div>
                                </div>
                                <p class="tip-text">${benefit}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderProfile() {
    return `
        <div class="main-content">
            <div class="max-w-4xl">
                <div class="content-header">
                    <h1 class="content-title">Profile</h1>
                    <p class="content-subtitle">Manage your personal information</p>
                </div>

                <div class="card mb-4">
                    <div class="profile-info">
                        <div class="profile-avatar">👤</div>
                        <div class="profile-details">
                            <h2>${userData.profile?.name || 'User'}</h2>
                            <p>${userData.profile?.email || 'user@example.com'}</p>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input id="profile-name" type="text" class="form-input" value="${userData.profile?.name || ''}" placeholder="Enter your name" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input id="profile-email" type="email" class="form-input" value="${userData.profile?.email || ''}" placeholder="Enter your email" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Age</label>
                            <input id="profile-age" type="number" class="form-input" value="${userData.profile?.age || ''}" placeholder="Enter your age" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Gender</label>
                            <select id="profile-gender" class="form-input">
                                <option value="">Select gender</option>
                                <option value="male" ${userData.profile?.gender === 'male' ? 'selected' : ''}>Male</option>
                                <option value="female" ${userData.profile?.gender === 'female' ? 'selected' : ''}>Female</option>
                                <option value="other" ${userData.profile?.gender === 'other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                    </div>

                    <button onclick="saveProfile()" class="btn btn-white btn-full">Save Changes</button>
                </div>

                <div class="card">
                    <h3 class="card-title mb-2">Physical Stats</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-header">
                                <span style="font-size: 1.25rem;">⚖️</span>
                                <span class="stat-label">Weight</span>
                            </div>
                            <p class="stat-value">${userData.weight} kg</p>
                        </div>
                        <div class="stat-card">
                            <div class="stat-header">
                                <span style="font-size: 1.25rem;">📏</span>
                                <span class="stat-label">Height</span>
                            </div>
                            <p class="stat-value">${userData.height} cm</p>
                        </div>
                        <div class="stat-card">
                            <div class="stat-header">
                                <span style="font-size: 1.25rem;">🧮</span>
                                <span class="stat-label">BMI</span>
                            </div>
                            <p class="stat-value">${userData.currentBMI.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSettings() {
    return `
        <div class="main-content">
            <div class="max-w-2xl">
                <div class="content-header">
                    <h1 class="content-title">Settings</h1>
                    <p class="content-subtitle">Manage your account and preferences</p>
                </div>

                <div class="settings-section">
                    <div class="settings-content">
                        <h3 class="settings-title">Profile Information</h3>
                        <p class="settings-description">Update your profile details in the Profile section</p>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="settings-content">
                        <h3 class="settings-title">Data Management</h3>
                        <p class="settings-description">Reset all your fitness data to start fresh</p>
                        <button onclick="resetData()" class="btn btn-red">🗑️ Reset All Data</button>
                    </div>
                </div>

                <div class="settings-section">
                    <div class="settings-content">
                        <h3 class="settings-title">Account</h3>
                        <p class="settings-description">Sign out of your account</p>
                        <button onclick="handleLogout()" class="btn btn-white">🚪 Logout</button>
                    </div>
                </div>

                <div class="card">
                    <h3 class="card-title mb-2">About</h3>
                    <div class="settings-info">
                        <div class="settings-row">
                            <span class="settings-label">Version</span>
                            <span class="settings-value">1.0.0</span>
                        </div>
                        <div class="settings-row">
                            <span class="settings-label">Build</span>
                            <span class="settings-value">2026.04.27</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addManualFood() {
    const name = document.getElementById('manual-food').value;
    const calories = parseInt(document.getElementById('manual-calories').value);
    
    if (name && calories) {
        const newFood = {
            name: name,
            calories: calories,
            date: new Date().toISOString(),
        };
        updateData({
            ...userData,
            recentFoods: [newFood, ...userData.recentFoods],
            dailyCalories: userData.dailyCalories + calories,
        });
    }
}

function addQuickFood() {
    const select = document.getElementById('quick-food');
    const value = select.value;
    
    if (value) {
        const [name, calories] = value.split('|');
        const newFood = {
            name: name,
            calories: parseInt(calories),
            date: new Date().toISOString(),
        };
        updateData({
            ...userData,
            recentFoods: [newFood, ...userData.recentFoods],
            dailyCalories: userData.dailyCalories + parseInt(calories),
        });
    }
}

function deleteFood(index) {
    const deletedFood = userData.recentFoods[index];
    updateData({
        ...userData,
        recentFoods: userData.recentFoods.filter((_, i) => i !== index),
        dailyCalories: Math.max(0, userData.dailyCalories - deletedFood.calories),
    });
}

function addManualWorkout() {
    const name = document.getElementById('manual-workout').value;
    const calories = parseInt(document.getElementById('manual-workout-calories').value);
    
    if (name && calories) {
        const newWorkout = {
            name: name,
            calories: calories,
            date: new Date().toISOString(),
        };
        updateData({
            ...userData,
            recentWorkouts: [newWorkout, ...userData.recentWorkouts],
            workouts: userData.workouts + 1,
        });
    }
}

function addQuickWorkout() {
    const select = document.getElementById('quick-workout');
    const value = select.value;
    
    if (value) {
        const [name, calories] = value.split('|');
        const newWorkout = {
            name: name,
            calories: parseInt(calories),
            date: new Date().toISOString(),
        };
        updateData({
            ...userData,
            recentWorkouts: [newWorkout, ...userData.recentWorkouts],
            workouts: userData.workouts + 1,
        });
    }
}

function deleteWorkout(index) {
    updateData({
        ...userData,
        recentWorkouts: userData.recentWorkouts.filter((_, i) => i !== index),
        workouts: Math.max(0, userData.workouts - 1),
    });
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);
    
    if (weight > 0 && height > 0) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            weight: weight
        };

        const updatedWeightHistory = [
            ...userData.weightHistory,
            newEntry
        ].slice(-10);

        updateData({
            ...userData,
            weight: weight,
            height: height,
            currentBMI: bmi,
            weightHistory: updatedWeightHistory
        });
    }
}

function addWaterGlass() {
    if (userData.waterGlasses < userData.waterGoal) {
        updateData({
            ...userData,
            waterGlasses: userData.waterGlasses + 1,
        });
    }
}

function removeWaterGlass() {
    if (userData.waterGlasses > 0) {
        updateData({
            ...userData,
            waterGlasses: userData.waterGlasses - 1,
        });
    }
}

function resetWater() {
    updateData({
        ...userData,
        waterGlasses: 0,
    });
}

function updateWaterGoal(value) {
    updateData({
        ...userData,
        waterGoal: parseInt(value),
        waterGlasses: Math.min(userData.waterGlasses, parseInt(value)),
    });
}

function addGoal() {
    const text = document.getElementById('goal-text').value;
    const target = document.getElementById('goal-target').value;
    
    if (text && target) {
        const newGoal = {
            id: Date.now(),
            text: text,
            target: target,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        updateData({
            ...userData,
            goals: [...(userData.goals || []), newGoal],
        });
    }
}

function toggleGoal(index) {
    const goals = [...userData.goals];
    goals[index].completed = !goals[index].completed;
    updateData({
        ...userData,
        goals: goals,
    });
}

function deleteGoal(index) {
    updateData({
        ...userData,
        goals: userData.goals.filter((_, i) => i !== index),
    });
}

function saveProfile() {
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const age = document.getElementById('profile-age').value;
    const gender = document.getElementById('profile-gender').value;
    
    updateData({
        ...userData,
        profile: {
            name: name,
            email: email,
            age: age,
            gender: gender,
        },
    });
}

function render() {
    const app = document.getElementById('app');
    
    if (!isLoggedIn) {
        app.innerHTML = renderLogin();
        return;
    }
    
    let content = '';
    switch (currentPage) {
        case 'dashboard':
            content = renderDashboard();
            break;
        case 'calorie-tracker':
            content = renderCalorieTracker();
            break;
        case 'workout-planner':
            content = renderWorkoutPlanner();
            break;
        case 'bmi-calculator':
            content = renderBMICalculator();
            break;
        case 'progress-tracker':
            content = renderProgressTracker();
            break;
        case 'goals':
            content = renderGoals();
            break;
        case 'water-tracker':
            content = renderWaterTracker();
            break;
        case 'profile':
            content = renderProfile();
            break;
        case 'settings':
            content = renderSettings();
            break;
    }
    
    app.innerHTML = `
        <div class="main-layout">
            ${renderSidebar()}
            ${content}
        </div>
    `;
    
    setTimeout(() => {
        initializeCharts();
    }, 100);
}

function getWeeklyAverageWeight() {
    const weeks = {};

    userData.weightHistory.forEach(entry => {
        const date = new Date(entry.date);
        
        const week = `Week ${Math.ceil(date.getDate() / 7)}`;

        if (!weeks[week]) {
            weeks[week] = { total: 0, count: 0 };
        }

        weeks[week].total += entry.weight;
        weeks[week].count += 1;
    });

    const labels = Object.keys(weeks);
    const data = labels.map(week => {
        const w = weeks[week];
        return (w.total / w.count).toFixed(1);
    });

    return { labels, data };
}

function initializeCharts() {

    if (document.getElementById('dashboard-weight-chart')) {
        createChart('dashboard-weight-chart', 'line', {
            labels: userData.weightHistory.map(d => d.date),
            datasets: [{
                label: 'Average Weight (kg)',
                data: weekly.data,
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
            }]
        }, {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#27272a' },
                    ticks: { color: '#71717a' }
                },
                x: {
                    grid: { color: '#27272a' },
                    ticks: { color: '#71717a' }
                }
            }
        });
    }
    
    if (document.getElementById('progress-weight-chart')) {
        createChart('progress-weight-chart', 'line', {
            labels: userData.weightHistory.map(d => d.date),
            datasets: [{
                 label: 'Average Weight (kg)',
                 data: weekly.data,
                 borderColor: '#a855f7',
                 backgroundColor: 'rgba(168, 85, 247, 0.1)',
                 tension: 0.4,
            }]
        }, {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#27272a' },
                    ticks: { color: '#71717a' }
                },
                x: {
                    grid: { color: '#27272a' },
                    ticks: { color: '#71717a' }
                }
            }
        });
    }
    
    if (document.getElementById('progress-calorie-chart')) {
        const calorieData = [
            { date: 'Mon', consumed: 1800, burned: 400 },
            { date: 'Tue', consumed: 2100, burned: 350 },
            { date: 'Wed', consumed: 1950, burned: 450 },
            { date: 'Thu', consumed: 2050, burned: 380 },
            { date: 'Fri', consumed: 1900, burned: 420 },
            { date: 'Sat', consumed: 2200, burned: 500 },
            { date: 'Sun', consumed: 2000, burned: 300 },
        ];
        
        createChart('progress-calorie-chart', 'bar', {
            labels: calorieData.map(d => d.date),
            datasets: [
                {
                    label: 'Consumed',
                    data: calorieData.map(d => d.consumed),
                    backgroundColor: '#f97316',
                },
                {
                    label: 'Burned',
                    data: calorieData.map(d => d.burned),
                    backgroundColor: '#3b82f6',
                }
            ]
        }, {
            showLegend: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#27272a' },
                    ticks: { color: '#71717a' }
                },
                x: {
                    grid: { color: '#27272a' },
                    ticks: { color: '#71717a' }
                }
            }
        });
    }
}

render();

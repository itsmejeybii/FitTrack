// ================= DATA MANAGEMENT =================
const AppData = {
    init() {
        const saved = localStorage.getItem('fitnessData');
        return saved ? JSON.parse(saved) : this.getDefaultData();
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
            profile: { name: '', email: '', age: '', gender: '' },
        };
    },

    save(data) {
        localStorage.setItem('fitnessData', JSON.stringify(data));
    },

    reset() {
        const data = this.getDefaultData();
        this.save(data);
        return data;
    }
};

// ================= APP STATE =================
let isLoggedIn = false;
let currentPage = 'dashboard';
let userData = AppData.init();
let charts = {};

// ================= NAVIGATION =================
function navigateTo(page) {
    currentPage = page;
    render();
}

// ================= AUTH =================
function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value;
    const p = document.getElementById('login-password').value;

    if (u && p) {
        isLoggedIn = true;
        render();
    }
}

function handleLogout() {
    isLoggedIn = false;
    currentPage = 'dashboard';
    render();
}

// ================= DATA =================
function updateData(data) {
    userData = data;
    AppData.save(userData);
    render();
}

// ================= BMI =================
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);

    if (weight > 0 && height > 0) {
        const bmi = weight / ((height / 100) ** 2);

        updateData({
            ...userData,
            weight,
            height,
            currentBMI: bmi
        });
    }
}

// ================= WATER =================
function addWaterGlass() {
    if (userData.waterGlasses < userData.waterGoal) {
        updateData({
            ...userData,
            waterGlasses: userData.waterGlasses + 1
        });
    }
}

function resetWater() {
    updateData({ ...userData, waterGlasses: 0 });
}

// ================= FOOD =================
function addManualFood() {
    const name = document.getElementById('manual-food').value;
    const calories = parseInt(document.getElementById('manual-calories').value);

    if (!name || !calories) return;

    const newFood = {
        name,
        calories,
        date: new Date().toISOString()
    };

    updateData({
        ...userData,
        recentFoods: [newFood, ...userData.recentFoods],
        dailyCalories: userData.dailyCalories + calories
    });
}

// ================= WORKOUT =================
function addManualWorkout() {
    const name = document.getElementById('manual-workout').value;
    const calories = parseInt(document.getElementById('manual-workout-calories').value);

    if (!name || !calories) return;

    const newWorkout = {
        name,
        calories,
        date: new Date().toISOString()
    };

    updateData({
        ...userData,
        recentWorkouts: [newWorkout, ...userData.recentWorkouts],
        workouts: userData.workouts + 1
    });
}

// ================= PROFILE =================
function saveProfile() {
    updateData({
        ...userData,
        profile: {
            name: document.getElementById('profile-name').value,
            email: document.getElementById('profile-email').value,
            age: document.getElementById('profile-age').value,
            gender: document.getElementById('profile-gender').value,
        }
    });
}

// ================= RENDER =================
function render() {
    const app = document.getElementById('app');

    if (!isLoggedIn) {
        app.innerHTML = `
            <div class="login-container">
                <form onsubmit="handleLogin(event)">
                    <input id="login-username" placeholder="Username" required />
                    <input id="login-password" type="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>
            </div>
        `;
        return;
    }

    app.innerHTML = `
        <div class="main-layout">
            <div class="sidebar">
                <button onclick="navigateTo('dashboard')">Dashboard</button>
                <button onclick="navigateTo('profile')">Profile</button>
                <button onclick="handleLogout()">Logout</button>
            </div>

            <div class="main-content">
                <h1>${currentPage}</h1>
            </div>
        </div>
    `;
}

// ================= INIT =================
render();

// Fitness Tracker PWA - Russian Version with Korean Style Design

// App State
const state = {
    steps: 0,
    calories: 0,
    minutes: 0,
    water: 0,
    dailyGoal: 10000,
    weeklyData: [],
    userProfile: null,
    achievements: [],
    isNewUser: true
};

// Russian motivational quotes
const quotes = [
    { text: "Здоровье — величайшая ценность", author: "Народная мудрость" },
    { text: "Движение — это жизнь", author: "Вольтер" },
    { text: "В здоровом теле — здоровый дух", author: "Ювенал" },
    { text: "Тысяча миль начинается с первого шага", author: "Лао-цзы" },
    { text: "Не важно, как медленно ты идёшь, главное — не останавливайся", author: "Конфуций" },
    { text: "Спорт заменяет множество лекарств, но ни одно лекарство не заменит спорт", author: "А. Мюссе" },
    { text: "Каждый день — новый шанс стать лучше", author: "Мотивация дня" },
    { text: "Успех приходит к тем, кто действует", author: "Бернард Шоу" }
];

// Achievements definitions
const achievementsList = [
    { id: 'first_steps', name: 'Первые шаги', icon: '👣', requirement: 1000, type: 'steps' },
    { id: 'halfway', name: 'Полпути', icon: '🎯', requirement: 5000, type: 'steps' },
    { id: 'goal_reached', name: 'Цель достигнута', icon: '🏆', requirement: 10000, type: 'steps' },
    { id: 'water_lover', name: 'Любитель воды', icon: '💧', requirement: 2000, type: 'water' },
    { id: 'calorie_burner', name: 'Сжигатель калорий', icon: '🔥', requirement: 500, type: 'calories' },
    { id: 'active_minutes', name: 'Активные минуты', icon: '⏱️', requirement: 60, type: 'minutes' }
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkOnboarding();
    setupNavigation();
    loadAchievements();
});

// Check if user completed onboarding
function checkOnboarding() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        state.userProfile = JSON.parse(savedProfile);
        state.isNewUser = false;
        document.getElementById('onboardingOverlay').classList.add('hidden');
        loadData();
        updateUI();
        generateWeeklyChart();
        setDailyQuote();
        renderAchievements();
    } else {
        // Show onboarding
        document.getElementById('onboardingOverlay').classList.remove('hidden');
    }
}

// Onboarding form handling
let selectedGoal = 10000;

function nextStep(currentStep) {
    // Validate current step
    let isValid = true;
    
    if (currentStep === 1) {
        const nameInput = document.getElementById('userName');
        if (!nameInput.value.trim()) {
            nameInput.style.borderColor = '#FF6B6B';
            isValid = false;
        }
    } else if (currentStep === 2) {
        const ageInput = document.getElementById('userAge');
        if (!ageInput.value || ageInput.value < 10 || ageInput.value > 100) {
            ageInput.style.borderColor = '#FF6B6B';
            isValid = false;
        }
    } else if (currentStep === 3) {
        const weightInput = document.getElementById('userWeight');
        if (!weightInput.value || weightInput.value < 30 || weightInput.value > 300) {
            weightInput.style.borderColor = '#FF6B6B';
            isValid = false;
        }
    }
    
    if (!isValid) return;
    
    // Move to next step
    const currentEl = document.querySelector(`[data-step="${currentStep}"]`);
    const nextEl = document.querySelector(`[data-step="${currentStep + 1}"]`);
    
    currentEl.classList.remove('active');
    nextEl.classList.add('active');
    
    // Update dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentStep);
    });
}

function prevStep(currentStep) {
    const currentEl = document.querySelector(`[data-step="${currentStep}"]`);
    const prevEl = document.querySelector(`[data-step="${currentStep - 1}"]`);
    
    currentEl.classList.remove('active');
    prevEl.classList.add('active');
    
    // Update dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentStep - 2);
    });
}

function selectGoal(goal) {
    selectedGoal = goal;
    document.querySelectorAll('.goal-option').forEach(option => {
        option.classList.remove('selected');
        if (parseInt(option.dataset.goal) === goal) {
            option.classList.add('selected');
        }
    });
}

// Handle form submission
document.getElementById('onboardingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const age = parseInt(document.getElementById('userAge').value);
    const weight = parseFloat(document.getElementById('userWeight').value);
    
    state.userProfile = {
        name,
        age,
        weight,
        dailyGoal: selectedGoal,
        createdAt: new Date().toISOString()
    };
    
    state.dailyGoal = selectedGoal;
    localStorage.setItem('userProfile', JSON.stringify(state.userProfile));
    
    // Hide onboarding with animation
    document.getElementById('onboardingOverlay').classList.add('hidden');
    
    // Initialize app
    loadData();
    updateUI();
    generateWeeklyChart();
    setDailyQuote();
    renderAchievements();
    
    showToast(`🎉 Добро пожаловать, ${name}!`);
});

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('fitnessData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        state.steps = parsed.steps || 0;
        state.calories = parsed.calories || 0;
        state.minutes = parsed.minutes || 0;
        state.water = parsed.water || 0;
        
        // Check if it's a new day
        const lastDate = parsed.lastDate;
        const today = new Date().toDateString();
        if (lastDate !== today) {
            // Save yesterday's data to weekly history
            if (lastDate) {
                saveWeeklyData(parsed);
            }
            // Reset daily stats
            state.steps = 0;
            state.calories = 0;
            state.minutes = 0;
            state.water = 0;
        }
        
        state.weeklyData = parsed.weeklyData || [];
    }
    
    // Update greeting
    if (state.userProfile) {
        document.getElementById('userGreeting').textContent = `Привет, ${state.userProfile.name}! 👋`;
        document.getElementById('dailyGoalDisplay').textContent = state.dailyGoal.toLocaleString('ru-RU');
    }
}

// Save data to localStorage
function saveData() {
    const data = {
        steps: state.steps,
        calories: state.calories,
        minutes: state.minutes,
        water: state.water,
        lastDate: new Date().toDateString(),
        weeklyData: state.weeklyData
    };
    localStorage.setItem('fitnessData', JSON.stringify(data));
}

// Save weekly data
function saveWeeklyData(yesterdayData) {
    const dayData = {
        date: yesterdayData.lastDate,
        steps: yesterdayData.steps,
        calories: yesterdayData.calories,
        minutes: yesterdayData.minutes
    };
    
    state.weeklyData.push(dayData);
    
    // Keep only last 7 days
    if (state.weeklyData.length > 7) {
        state.weeklyData.shift();
    }
}

// Update UI
function updateUI() {
    document.getElementById('steps').textContent = formatNumber(state.steps);
    document.getElementById('calories').textContent = formatNumber(state.calories);
    document.getElementById('minutes').textContent = formatNumber(state.minutes);
    document.getElementById('water').textContent = formatNumber(state.water);
    
    updateProgress();
    saveData();
}

// Format number with commas
function formatNumber(num) {
    return num.toLocaleString('ko-KR');
}

// Update progress circle
function updateProgress() {
    const progressCircle = document.getElementById('progressCircle');
    const progressPercent = document.getElementById('progressPercent');
    
    const percentage = Math.min((state.steps / state.dailyGoal) * 100, 100);
    const circumference = 2 * Math.PI * 45; // r = 45
    const offset = circumference - (percentage / 100) * circumference;
    
    progressCircle.style.strokeDashoffset = offset;
    progressPercent.textContent = Math.round(percentage);
    
    // Add gradient definition to SVG if not exists
    const svg = progressCircle.closest('svg');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#FF8E8E;stop-opacity:1" />
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
    }
    
    progressCircle.setAttribute('stroke', 'url(#progressGradient)');
}

// Generate weekly chart
function generateWeeklyChart() {
    const chartContainer = document.getElementById('weeklyChart');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    
    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push({
            date: date,
            dayName: days[date.getDay()],
            data: state.weeklyData.find(d => 
                new Date(d.date).toDateString() === date.toDateString()
            )
        });
    }
    
    // Find max steps for scaling
    const maxSteps = Math.max(...last7Days.map(d => d.data?.steps || 0), 1000);
    
    // Generate chart HTML
    chartContainer.innerHTML = last7Days.map(day => {
        const steps = day.data?.steps || 0;
        const height = (steps / maxSteps) * 100;
        
        return `
            <div class="chart-bar">
                <div class="bar" style="height: ${height}%"></div>
                <span class="bar-label">${day.dayName}</span>
            </div>
        `;
    }).join('');
}

// Set daily quote
function setDailyQuote() {
    const quoteElement = document.getElementById('dailyQuote');
    const today = new Date().getDay();
    const quote = quotes[today % quotes.length];
    
    quoteElement.textContent = `"${quote.text}"`;
    quoteElement.nextElementSibling.textContent = `- ${quote.author}`;
}

// Action functions
function addSteps(amount) {
    state.steps += amount;
    showToast(`👟 ${amount}걸음 추가!`);
    updateUI();
}

function addCalories(amount) {
    state.calories += amount;
    showToast(`🔥 ${amount}kcal 추가!`);
    updateUI();
}

function addWater(amount) {
    state.water += amount;
    showToast(`💧 ${amount}ml 섭취!`);
    updateUI();
}

function addMinutes(amount) {
    state.minutes += amount;
    state.calories += amount * 5; // Estimate calories burned
    showToast(`⏱️ ${amount}분 운동!`);
    updateUI();
}

// Show toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Setup bottom navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show appropriate message for demo
            const label = item.querySelector('.nav-label').textContent;
            showToast(`${label} 페이지 준비중입니다!`);
        });
    });
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Send daily reminder notification
function sendDailyReminder() {
    if (Notification.permission === 'granted') {
        const now = new Date();
        const hour = now.getHours();
        
        // Send reminder in the evening if goal not reached
        if (hour >= 20 && state.steps < state.dailyGoal) {
            const remaining = state.dailyGoal - state.steps;
            new Notification('건강친구 💪', {
                body: `오늘 목표까지 ${remaining.toLocaleString()}걸음 남았어요!`,
                icon: '/icon-192.png'
            });
        }
    }
}

// Check and send reminder daily
setInterval(() => {
    sendDailyReminder();
}, 60000); // Check every minute

// Export data function
function exportData() {
    const dataStr = JSON.stringify({
        steps: state.steps,
        calories: state.calories,
        minutes: state.minutes,
        water: state.water,
        weeklyData: state.weeklyData,
        exportDate: new Date().toISOString()
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('데이터가 내보내졌습니다!');
}

// Import data function
function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (confirm('기존 데이터를 덮어쓰시겠습니까?')) {
                state.steps = imported.steps || 0;
                state.calories = imported.calories || 0;
                state.minutes = imported.minutes || 0;
                state.water = imported.water || 0;
                state.weeklyData = imported.weeklyData || [];
                
                updateUI();
                showToast('데이터가 불러와졌습니다!');
            }
        } catch (error) {
            showToast('파일 형식이 올바르지 않습니다.');
        }
    };
    reader.readAsText(file);
}

// Reset daily data
function resetDailyData() {
    if (confirm('오늘의 데이터를 초기화하시겠습니까?')) {
        state.steps = 0;
        state.calories = 0;
        state.minutes = 0;
        state.water = 0;
        updateUI();
        showToast('데이터가 초기화되었습니다.');
    }
}

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
});

// Function to show install prompt
async function showInstallPrompt() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        deferredPrompt = null;
    }
}

console.log('🌸 건강친구 - Korean Fitness Tracker loaded successfully!');

// Save data to localStorage
function saveData() {
    const data = {
        steps: state.steps,
        calories: state.calories,
        minutes: state.minutes,
        water: state.water,
        lastDate: new Date().toDateString(),
        weeklyData: state.weeklyData
    };
    localStorage.setItem('fitnessData', JSON.stringify(data));
}

// Save weekly data
function saveWeeklyData(yesterdayData) {
    const dayData = {
        date: yesterdayData.lastDate,
        steps: yesterdayData.steps,
        calories: yesterdayData.calories,
        minutes: yesterdayData.minutes
    };
    
    state.weeklyData.push(dayData);
    
    // Keep only last 7 days
    if (state.weeklyData.length > 7) {
        state.weeklyData.shift();
    }
}

// Update UI
function updateUI() {
    document.getElementById('steps').textContent = formatNumber(state.steps);
    document.getElementById('calories').textContent = formatNumber(state.calories);
    document.getElementById('minutes').textContent = formatNumber(state.minutes);
    document.getElementById('water').textContent = formatNumber(state.water);
    
    updateProgress();
    updateMilestones();
    checkAchievements();
    saveData();
}

// Format number with Russian locale
function formatNumber(num) {
    return num.toLocaleString('ru-RU');
}

// Update progress circle
function updateProgress() {
    const progressCircle = document.getElementById('progressCircle');
    const progressPercent = document.getElementById('progressPercent');
    
    const percentage = Math.min((state.steps / state.dailyGoal) * 100, 100);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;
    
    progressCircle.style.strokeDashoffset = offset;
    progressPercent.textContent = Math.round(percentage);
    
    const svg = progressCircle.closest('svg');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#FF8E8E;stop-opacity:1" />
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
    }
    
    progressCircle.setAttribute('stroke', 'url(#progressGradient)');
}

// Update milestones
function updateMilestones() {
    const percentage = (state.steps / state.dailyGoal) * 100;
    document.querySelectorAll('.milestone').forEach(milestone => {
        const milestonePercent = parseInt(milestone.dataset.percent);
        milestone.classList.toggle('active', percentage >= milestonePercent);
    });
}

// Generate weekly chart
function generateWeeklyChart() {
    const chartContainer = document.getElementById('weeklyChart');
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push({
            date: date,
            dayName: days[date.getDay()],
            data: state.weeklyData.find(d => 
                new Date(d.date).toDateString() === date.toDateString()
            )
        });
    }
    
    const maxSteps = Math.max(...last7Days.map(d => d.data?.steps || 0), 1000);
    
    chartContainer.innerHTML = last7Days.map(day => {
        const steps = day.data?.steps || 0;
        const height = (steps / maxSteps) * 100;
        
        return `
            <div class="chart-bar" onclick="showDayDetails('${day.dayName}', ${steps})">
                <div class="bar" style="height: ${height}%" data-value="${steps.toLocaleString()}"></div>
                <span class="bar-label">${day.dayName}</span>
            </div>
        `;
    }).join('');
    
    // Calculate stats
    const totalSteps = last7Days.reduce((sum, day) => sum + (day.data?.steps || 0), 0);
    const avgSteps = Math.round(totalSteps / 7);
    const bestDay = last7Days.reduce((best, day) => 
        (day.data?.steps || 0) > (best.data?.steps || 0) ? day : best
    , last7Days[0]);
    
    document.getElementById('avgSteps').textContent = avgSteps.toLocaleString();
    document.getElementById('bestDay').textContent = bestDay.data ? `${bestDay.dayName} (${bestDay.data.steps.toLocaleString()})` : '-';
}

// Set daily quote
function setDailyQuote() {
    const quoteElement = document.getElementById('dailyQuote');
    const today = new Date().getDay();
    const quote = quotes[today % quotes.length];
    
    quoteElement.textContent = `"${quote.text}"`;
    quoteElement.nextElementSibling.textContent = `— ${quote.author}`;
}

// Action functions
function addSteps(amount) {
    state.steps += amount;
    animateValue('steps', state.steps - amount, state.steps);
    showToast(`👟 +${amount} шагов!`);
    updateUI();
}

function addCalories(amount) {
    state.calories += amount;
    animateValue('calories', state.calories - amount, state.calories);
    showToast(`🔥 +${amount} ккал!`);
    updateUI();
}

function addWater(amount) {
    state.water += amount;
    animateValue('water', state.water - amount, state.water);
    showToast(`💧 +${amount} мл!`);
    updateUI();
}

function addMinutes(amount) {
    state.minutes += amount;
    state.calories += amount * 5;
    animateValue('minutes', state.minutes - amount, state.minutes);
    showToast(`⏱️ +${amount} мин!`);
    updateUI();
}

// Animate value change
function animateValue(elementId, start, end) {
    const element = document.getElementById(elementId);
    const duration = 500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + (end - start) * progress);
        element.textContent = value.toLocaleString('ru-RU');
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Add custom values
function addCustomValues() {
    const steps = parseInt(document.getElementById('customSteps').value) || 0;
    const calories = parseInt(document.getElementById('customCalories').value) || 0;
    const water = parseInt(document.getElementById('customWater').value) || 0;
    const minutes = parseInt(document.getElementById('customMinutes').value) || 0;
    
    if (steps > 0) addSteps(steps);
    if (calories > 0) addCalories(calories);
    if (water > 0) addWater(water);
    if (minutes > 0) addMinutes(minutes);
    
    // Clear inputs
    document.getElementById('customSteps').value = '';
    document.getElementById('customCalories').value = '';
    document.getElementById('customWater').value = '';
    document.getElementById('customMinutes').value = '';
    
    if (steps === 0 && calories === 0 && water === 0 && minutes === 0) {
        showToast('Введите значения для добавления');
    }
}

// Show toast notification
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Setup bottom navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const page = item.dataset.page;
            const messages = {
                'home': 'Главная страница',
                'stats': 'Статистика в разработке 🚧',
                'goals': 'Управление целями скоро будет 🎯',
                'profile': 'Настройки профиля 👤'
            };
            
            showToast(messages[page] || 'Страница в разработке');
        });
    });
}

// Toggle settings panel
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('open');
}

// Export data
function exportData() {
    const dataStr = JSON.stringify({
        profile: state.userProfile,
        steps: state.steps,
        calories: state.calories,
        minutes: state.minutes,
        water: state.water,
        weeklyData: state.weeklyData,
        achievements: state.achievements,
        exportDate: new Date().toISOString()
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('📊 Данные экспортированы!');
    toggleSettings();
}

// Handle file import
function handleFileImport(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (confirm('Заменить текущие данные импортированными?')) {
                state.steps = imported.steps || 0;
                state.calories = imported.calories || 0;
                state.minutes = imported.minutes || 0;
                state.water = imported.water || 0;
                state.weeklyData = imported.weeklyData || [];
                state.achievements = imported.achievements || [];
                
                if (imported.profile) {
                    state.userProfile = imported.profile;
                    state.dailyGoal = imported.profile.dailyGoal || 10000;
                }
                
                updateUI();
                generateWeeklyChart();
                renderAchievements();
                showToast('📥 Данные импортированы!');
            }
        } catch (error) {
            showToast('❌ Ошибка файла');
        }
    };
    reader.readAsText(file);
    toggleSettings();
}

// Reset daily data
function resetDailyData() {
    if (confirm('Сбросить данные за сегодня?')) {
        state.steps = 0;
        state.calories = 0;
        state.minutes = 0;
        state.water = 0;
        updateUI();
        showToast('🔄 Данные сброшены');
    }
    toggleSettings();
}

// Show profile modal
function showProfile() {
    if (state.userProfile) {
        showToast(`👤 ${state.userProfile.name}, ${state.userProfile.age} лет, ${state.userProfile.weight} кг`);
    } else {
        showToast('Профиль не найден');
    }
    toggleSettings();
}

// Load achievements
function loadAchievements() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
        state.achievements = JSON.parse(saved);
    }
}

// Render achievements
function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = achievementsList.map(achievement => {
        const unlocked = state.achievements.includes(achievement.id);
        return `
            <div class="achievement-item ${unlocked ? 'unlocked' : ''}" onclick="showAchievementDetail('${achievement.id}')">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
        `;
    }).join('');
}

// Check and unlock achievements
function checkAchievements() {
    let changed = false;
    
    achievementsList.forEach(achievement => {
        if (!state.achievements.includes(achievement.id)) {
            let currentValue = 0;
            switch(achievement.type) {
                case 'steps': currentValue = state.steps; break;
                case 'water': currentValue = state.water; break;
                case 'calories': currentValue = state.calories; break;
                case 'minutes': currentValue = state.minutes; break;
            }
            
            if (currentValue >= achievement.requirement) {
                state.achievements.push(achievement.id);
                changed = true;
                showToast(`🏆 Достижение: ${achievement.name}!`);
            }
        }
    });
    
    if (changed) {
        localStorage.setItem('achievements', JSON.stringify(state.achievements));
        renderAchievements();
    }
}

// Show achievement detail
function showAchievementDetail(id) {
    const achievement = achievementsList.find(a => a.id === id);
    if (achievement) {
        const unlocked = state.achievements.includes(id);
        showToast(`${achievement.icon} ${achievement.name}: ${unlocked ? 'Разблокировано!' : `Требуется: ${achievement.requirement}`}`);
    }
}

// Show day details
function showDayDetails(dayName, steps) {
    showToast(`${dayName}: ${steps.toLocaleString()} шагов`);
}

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
});

console.log('🌸 Здоровый Друг - Фитнес-трекер готов к работе!');

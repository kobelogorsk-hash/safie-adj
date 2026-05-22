// Korean Fitness Tracker PWA - Main Application Logic

// App State
const state = {
    steps: 0,
    calories: 0,
    minutes: 0,
    water: 0,
    dailyGoal: 10000, // steps
    weeklyData: []
};

// Korean motivational quotes
const quotes = [
    { text: "건강은 가장 큰 선물입니다.", author: "한국 속담" },
    { text: "천 리 길도 한 걸음부터", author: "한국 속담" },
    { text: "꾸준함이 재능을 이긴다", author: "한국 속담" },
    { text: "오늘 걷지 않으면 내일 뛰어야 한다", author: "현대 격언" },
    { text: "작은 습관이 큰 변화를 만듭니다", author: "건강 명언" },
    { text: "몸이 건강해야 마음이 건강합니다", author: "한국 속담" },
    { text: "매일이 새로운 시작입니다", author: "motivational" },
    { text: "포기하지 않는 것이 성공의 비결입니다", author: "한국 속담" }
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateUI();
    generateWeeklyChart();
    setDailyQuote();
    setupNavigation();
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

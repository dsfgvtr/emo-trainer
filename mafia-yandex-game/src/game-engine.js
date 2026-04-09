/**
 * Игровой движок: управление состоянием, сценами и выбором
 */

// Состояние игры
let gameState = {
    playerName: "Тони",
    playerRole: "soldier", // soldier, capo, consigliere
    reputation: 50,
    money: 200,
    currentDay: 1,
    currentChapter: 1,
    currentScene: null,
    visitedScenes: [],
    inventory: [],
    flags: {} // Флаги для ветвления сюжета
};

// Текущая сцена
let currentSceneData = null;

// DOM элементы
const elements = {};

function initGameEngine() {
    // Кэшируем DOM элементы
    elements.screens = {
        loading: document.getElementById('loading-screen'),
        menu: document.getElementById('menu-screen'),
        charCreation: document.getElementById('char-creation-screen'),
        gameplay: document.getElementById('gameplay-screen')
    };

    elements.gameplay = {
        dayCounter: document.getElementById('day-counter'),
        repValue: document.getElementById('rep-value'),
        speakerName: document.getElementById('speaker-name'),
        dialogueText: document.getElementById('dialogue-text'),
        choicesContainer: document.getElementById('choices-container'),
        sceneImage: document.getElementById('scene-image')
    };

    setupEventListeners();
}

function setupEventListeners() {
    // Главное меню
    document.getElementById('btn-start').addEventListener('click', () => {
        showScreen('charCreation');
    });

    document.getElementById('btn-continue').addEventListener('click', continueGame);

    document.getElementById('btn-settings').addEventListener('click', () => {
        alert('Настройки будут добавлены в следующей версии!');
    });

    // Создание персонажа
    document.getElementById('btn-confirm-char').addEventListener('click', startNewGame);
}

function showScreen(screenName) {
    // Скрыть все экраны
    Object.values(elements.screens).forEach(screen => {
        screen.classList.remove('active');
    });

    // Показать нужный
    const targetScreen = elements.screens[screenName];
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function startNewGame() {
    const nameInput = document.getElementById('player-name').value.trim();
    const roleSelect = document.getElementById('player-role').value;

    if (nameInput) {
        gameState.playerName = nameInput;
    }
    
    gameState.playerRole = roleSelect;
    gameState.currentScene = 'intro';
    gameState.visitedScenes = ['intro'];
    
    // Бонусы за роль
    if (gameState.playerRole === 'capo') {
        gameState.reputation = 60;
        gameState.money = 300;
    } else if (gameState.playerRole === 'consigliere') {
        gameState.reputation = 55;
        gameState.money = 250;
    }

    updateUI();
    showScreen('gameplay');
    loadScene('intro');
}

function continueGame() {
    // Загрузка сохранённой игры
    import('./yandex-sdk.js').then(module => {
        module.loadData().then(savedData => {
            if (savedData) {
                gameState = { ...gameState, ...savedData };
                updateUI();
                showScreen('gameplay');
                loadScene(gameState.currentScene);
            } else {
                alert('Нет сохранённых игр');
            }
        });
    });
}

function loadScene(sceneId) {
    // Поиск сцены в данных
    let sceneData = null;
    
    // Определяем текущую главу
    const chapterKey = `chapter${gameState.currentChapter}`;
    
    if (storyData[chapterKey] && storyData[chapterKey][sceneId]) {
        sceneData = storyData[chapterKey][sceneId];
    } else if (sceneId === 'menu') {
        showScreen('menu');
        return;
    } else {
        console.error(`Scene ${sceneId} not found in chapter ${gameState.currentChapter}`);
        return;
    }

    currentSceneData = sceneData;
    gameState.currentScene = sceneId;

    // Обновляем UI сцены
    elements.gameplay.speakerName.textContent = sceneData.speaker;
    
    // Эффект печатной машинки для текста
    typeWriterEffect(sceneData.text, elements.gameplay.dialogueText);

    // Обновляем фон (в реальной игре здесь были бы изображения)
    updateBackground(sceneData.background);

    // Генерируем выборы
    generateChoices(sceneData.choices);

    // Сохраняем посещение сцены
    if (!gameState.visitedScenes.includes(sceneId)) {
        gameState.visitedScenes.push(sceneId);
    }

    // Применяем эффекты сцены
    applySceneEffects(sceneData);
}

function typeWriterEffect(text, element) {
    element.textContent = '';
    let i = 0;
    const speed = 30; // мс на символ

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

function updateBackground(bgName) {
    // В реальной игре здесь была бы смена изображений
    // Для демо используем цветовые схемы
    const colors = {
        'city_dock': 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Crect fill=\'%232c3e50\' width=\'100\' height=\'100\'/%3E%3C/svg%3E")',
        'street_night': 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), #1a1a2e',
        'restaurant': 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), #8b4513',
        'bar': 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), #654321',
        'don_office': 'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), #2c1810',
        'warehouse_night': 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), #34495e',
        'warehouse_battle': 'linear-gradient(rgba(50,0,0,0.8), rgba(50,0,0,0.8)), #4a0000',
        'warehouse_interior': 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), #555',
        'warehouse_gate': 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), #444',
        'rainy_street': 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), #1a2a3a',
        'black_screen': '#000'
    };

    const bgStyle = colors[bgName] || colors['street_night'];
    document.getElementById('gameplay-screen').style.backgroundImage = bgStyle;
}

function generateChoices(choices) {
    const container = elements.gameplay.choicesContainer;
    container.innerHTML = '';

    choices.forEach(choice => {
        // Проверка требований
        if (choice.reqRep && gameState.reputation < choice.reqRep) {
            return; // Пропускаем выбор, если не хватает репутации
        }

        const btn = document.createElement('button');
        btn.textContent = choice.text;
        
        btn.addEventListener('click', () => {
            handleChoice(choice);
        });

        container.appendChild(btn);
    });
}

function handleChoice(choice) {
    // Применение затрат
    if (choice.moneyCost) {
        if (gameState.money >= choice.moneyCost) {
            gameState.money -= choice.moneyCost;
        } else {
            alert('Недостаточно денег!');
            return;
        }
    }

    // Переход к следующей сцене
    if (choice.nextScene) {
        loadScene(choice.nextScene);
    }

    // Авто-сохранение после важного выбора
    autoSave();
}

function applySceneEffects(sceneData) {
    if (sceneData.reputationChange) {
        gameState.reputation += sceneData.reputationChange;
        // Ограничиваем от 0 до 100
        gameState.reputation = Math.max(0, Math.min(100, gameState.reputation));
    }

    if (sceneData.isChapterEnd && sceneData.nextChapter) {
        gameState.currentChapter++;
        gameState.currentDay++;
    }

    updateUI();
}

function updateUI() {
    elements.gameplay.dayCounter.textContent = `День ${gameState.currentDay}`;
    elements.gameplay.repValue.textContent = gameState.reputation;
    
    // Обновляем кнопку продолжения в меню
    const continueBtn = document.getElementById('btn-continue');
    if (gameState.visitedScenes.length > 1) {
        continueBtn.disabled = false;
    }
}

function autoSave() {
    import('./yandex-sdk.js').then(module => {
        module.saveData(gameState);
    });
}

export { initGameEngine, loadScene, gameState };

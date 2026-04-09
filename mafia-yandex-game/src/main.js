/**
 * Точка входа в игру
 * Инициализация SDK и запуск игрового движка
 */

// Глобальные переменные для доступа из HTML
window.gameExports = {};

async function initGame() {
    console.log('Инициализация игры...');

    try {
        // Инициализация Яндекс SDK
        const sdkModule = await import('./yandex-sdk.js');
        await sdkModule.initYandexSDK();
        
        // Инициализация игрового движка
        const engineModule = await import('./game-engine.js');
        engineModule.initGameEngine();
        
        // Экспорт функций для глобального доступа
        window.gameExports = {
            loadScene: engineModule.loadScene,
            gameState: engineModule.gameState,
            saveData: sdkModule.saveData,
            loadData: sdkModule.loadData,
            showAd: sdkModule.showAd
        };

        // Скрываем экран загрузки, показываем меню
        setTimeout(() => {
            document.getElementById('loading-screen').classList.remove('active');
            document.getElementById('menu-screen').classList.add('active');
            
            // Проверяем наличие сохранений
            sdkModule.loadData().then(savedData => {
                if (savedData) {
                    document.getElementById('btn-continue').disabled = false;
                }
            });
        }, 1500);

        console.log('Игра готова!');
        
        // Логирование события для Яндекс Игр
        sdkModule.logEvent('game_started', { timestamp: Date.now() });

    } catch (error) {
        console.error('Ошибка инициализации игры:', error);
        // Даже при ошибке показываем меню
        document.getElementById('loading-screen').classList.remove('active');
        document.getElementById('menu-screen').classList.add('active');
    }
}

// Запуск после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// Обработка закрытия страницы (авто-сохранение)
window.addEventListener('beforeunload', () => {
    if (window.gameExports && window.gameExports.gameState.currentScene) {
        window.gameExports.saveData(window.gameExports.gameState);
    }
});

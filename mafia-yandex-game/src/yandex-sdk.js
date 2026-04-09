/**
 * Модуль интеграции с Яндекс Играми SDK
 */
let ysdk = null;
let player = null;

function initYandexSDK() {
    return new Promise((resolve, reject) => {
        if (typeof YaGames === 'undefined') {
            console.warn('Yandex SDK not found, running in standalone mode');
            resolve(null);
            return;
        }

        YaGames.init().then(ysdkInstance => {
            console.log('Yandex SDK initialized');
            ysdk = ysdkInstance;
            
            // Инициализация игрока
            ysdk.getPlayer().then(_player => {
                player = _player;
                console.log('Player initialized:', player.getID());
                loadData(); // Попытка загрузить сохранение
                resolve(ysdk);
            }).catch(err => {
                console.log('Player initialization failed (likely no auth):', err);
                resolve(ysdk);
            });
        }).catch(err => {
            console.error('Yandex SDK init error:', err);
            reject(err);
        });
    });
}

// Показ рекламы (Interstitial)
function showAd(callback) {
    if (ysdk) {
        ysdk.adv.showFullscreenAdv({
            callbacks: {
                onClose: function(wasShown) {
                    console.log('Ad closed');
                    if (callback) callback();
                },
                onError: function(error) {
                    console.log('Ad error:', error);
                    if (callback) callback();
                }
            }
        });
    } else {
        // В режиме разработки просто вызываем коллбек
        if (callback) setTimeout(callback, 1000);
    }
}

// Сохранение прогресса
function saveData(gameState) {
    if (player) {
        player.setData(gameState).then(() => {
            console.log('Game saved successfully');
        }).catch(err => {
            console.error('Save error:', err);
        });
    } else {
        // Локальное сохранение для тестов
        localStorage.setItem('mafia_save', JSON.stringify(gameState));
        console.log('Game saved locally');
    }
}

// Загрузка прогресса
function loadData() {
    return new Promise((resolve) => {
        if (player) {
            player.getData().then(data => {
                if (Object.keys(data).length > 0) {
                    console.log('Cloud save loaded');
                    resolve(data);
                } else {
                    resolve(null);
                }
            }).catch(() => resolve(null));
        } else {
            const localSave = localStorage.getItem('mafia_save');
            if (localSave) {
                console.log('Local save loaded');
                resolve(JSON.parse(localSave));
            } else {
                resolve(null);
            }
        }
    });
}

// Отправка события в Яндекс Игры (для аналитики)
function logEvent(eventName, eventValue) {
    if (ysdk) {
        ysdk.features.LogsAPI?.logEvent(eventName, eventValue);
    }
}

export { initYandexSDK, showAd, saveData, loadData, logEvent };

/**
 * Данные сюжета и сценарий игры
 * Масштабная история в 3 главах с ветвлениями
 */

const storyData = {
    // Глава 1: Возвращение домой
    chapter1: {
        intro: {
            id: "intro",
            speaker: "Рассказчик",
            text: "1945 год. Вторая мировая война окончена. Вы возвращаетесь в родной город Нью-Валлетто, который изменился до неузнаваемости. Семья Моретти контролирует порт, но ходят слухи о войне с ирландцами из Бруклина.",
            background: "city_dock",
            choices: [
                { text: "Найти старого друга", nextScene: "meet_sally" },
                { text: "Отправиться в ресторан семьи", nextScene: "restaurant_intro" }
            ]
        },
        meet_sally: {
            id: "meet_sally",
            speaker: "Салли",
            text: "Тони! Боже мой, ты жив! Я думал... мы все думали... Слушай, Дон Моретти хочет видеть тебя. Но будь осторожен - здесь теперь не так безопасно, как раньше.",
            background: "street_night",
            choices: [
                { text: "Пойти к Дону немедленно", nextScene: "don_meeting" },
                { text: "Сначала узнать обстановку", nextScene: "gather_intel" }
            ]
        },
        restaurant_intro: {
            id: "restaurant_intro",
            speaker: "Луиджи",
            text: "А вот и наш герой войны! Столик уже готов. Сегодня особенный вечер - капо семьи собирает людей. Тебе стоит быть здесь.",
            background: "restaurant",
            choices: [
                { text: "Заказать виски и ждать", nextScene: "capo_arrival" },
                { text: "Осмотреться, нет ли знакомых", nextScene: "look_around" }
            ]
        },
        gather_intel: {
            id: "gather_intel",
            speaker: "Бармен Джо",
            text: "Так ты вернулся? Слухи говорят, что ирландцы готовят что-то большое. Прошлой ночью взорвали склад семьи на пристани №5. Полиция ничего не делает - они куплены.",
            background: "bar",
            reputationChange: 5,
            choices: [
                { text: "Расспросить подробнее о взрыве", nextScene: "bomb_details" },
                { text: "Уйти к Дону", nextScene: "don_meeting" }
            ]
        },
        don_meeting: {
            id: "don_meeting",
            speaker: "Дон Карло Моретти",
            text: "Мальчик мой, ты вырос настоящим мужчиной. Твой отец отдал жизнь за эту семью. Теперь твой черёд. У нас проблема - О'Брайен из Бруклина нарушил перемирие. Я хочу, чтобы ты возглавил операцию по возврату нашего склада.",
            background: "don_office",
            choices: [
                { text: "Я готов служить семье (Принять миссию)", nextScene: "mission_warehouse", roleBonus: "soldier" },
                { text: "Может есть более хитрый план? (Предложить стратегию)", nextScene: "strategic_plan", roleBonus: "consigliere" },
                { text: "Мне нужны люди для этого (Попросить подкрепление)", nextScene: "request_backup", roleBonus: "capo" }
            ]
        },
        mission_warehouse: {
            id: "mission_warehouse",
            speaker: "Рассказчик",
            text: "Ночь. Пристань №5. Охрана ирландцев расслабилась после победы. У вас есть выбор: атаковать в лоб или проникнуть незаметно.",
            background: "warehouse_night",
            choices: [
                { text: "Атака в лоб! (Требуется репутация 60+)", nextScene: "assault_front", reqRep: 60 },
                { text: "Проникнуть через крышу", nextScene: "stealth_roof" },
                { text: "Подкупить одного из охранников", nextScene: "bribe_guard" }
            ]
        },
        assault_front: {
            id: "assault_front",
            speaker: "Рассказчик",
            text: "Перестрелка была жестокой. Вы потеряли двух людей, но склад возвращён. Дон будет доволен, но кровь на ваших руках...",
            background: "warehouse_battle",
            reputationChange: 20,
            choices: [
                { text: "Доложить Дону", nextScene: "chapter1_end_good" }
            ]
        },
        stealth_roof: {
            id: "stealth_roof",
            speaker: "Рассказчик",
            text: "Вы бесшумно устранили часовых и открыли ворота изнутри. Склад ваш без единого выстрела. Идеальная работа.",
            background: "warehouse_interior",
            reputationChange: 15,
            choices: [
                { text: "Доложить Дону", nextScene: "chapter1_end_perfect" }
            ]
        },
        bribe_guard: {
            id: "bribe_guard",
            speaker: "Охранник Микки",
            text: "Золото? За золото я могу забыть, что видел вас. Но О'Брайен узнает... Ладно, входите. Я ничего не видел.",
            background: "warehouse_gate",
            moneyCost: 100,
            reputationChange: 5,
            choices: [
                { text: "Войти на склад", nextScene: "chapter1_end_mixed" }
            ]
        },
        chapter1_end_good: {
            id: "chapter1_end_good",
            speaker: "Дон Карло Моретти",
            text: "Ты доказал свою ценность, сын мой. Но это только начало. Ирландцы не простят такого унижения. Готовься к войне.",
            background: "don_office",
            isChapterEnd: true,
            nextChapter: "chapter2",
            choices: [
                { text: "Продолжить историю", nextScene: "chapter2_start" }
            ]
        },
        chapter1_end_perfect: {
            id: "chapter1_end_perfect",
            speaker: "Дон Карло Моретти",
            text: "Без шума, без крови... Ты мыслишь как настоящий консильери. Возможно, ты станешь моей правой рукой. Впереди большие дела.",
            background: "don_office",
            isChapterEnd: true,
            nextChapter: "chapter2",
            choices: [
                { text: "Продолжить историю", nextScene: "chapter2_start" }
            ]
        },
        chapter1_end_mixed: {
            id: "chapter1_end_mixed",
            speaker: "Дон Карло Моретти",
            text: "Склад наш, но потрачены деньги семьи. Не идеально, но результат есть. Не повторяй ошибок впредь.",
            background: "don_office",
            isChapterEnd: true,
            nextChapter: "chapter2",
            choices: [
                { text: "Продолжить историю", nextScene: "chapter2_start" }
            ]
        }
    },

    // Заглушки для следующих глав (можно расширить)
    chapter2: {
        start: {
            id: "chapter2_start",
            speaker: "Рассказчик",
            text: "ГЛАВА 2: КРОВАВЫЙ ДОЖДЬ. Война разгорается. На улицах всё чаще находят тела. Кто-то должен остановить это безумие... или возглавить его.",
            background: "rainy_street",
            choices: [
                { text: "Начать новую главу", nextScene: "ch2_mission1" }
            ]
        },
        ch2_mission1: {
            id: "ch2_mission1",
            speaker: "Разработка продолжается...",
            text: "Эта часть истории находится в разработке. Полная версия будет включать предательство внутри семьи, романтическую линию и финальную битву за контроль над городом.",
            background: "black_screen",
            choices: [
                { text: "Вернуться в меню", nextScene: "menu" }
            ]
        }
    }
};

// Стартовая сцена
const startingScene = "intro";

export { storyData, startingScene };

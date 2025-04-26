// Добавляем конфиг файл для хранения токена и подключаем библиотеку, которая облегчит работу с API ВК
const config = require("./config.json"), // конфиг файл
    { VK } = require('vk-io'), // сама библиотека
    { HearManager } = require('@vk-io/hear') // Удобен для создания команд бота
     const vk = new VK({
    token: config.token
});
const command = new HearManager(); // Создаём экземпляр
vk.updates.on('message', command.middleware); 
vk.updates.on('message', async (context, next) => {
    console.log('Пришло новое сообщение!'); 
    await next(); 
});
command.hear('/start', async (context) => {
    context.send('Это наша первая программа и она работает 🎉');
})
vk.updates.start()
    .then(() => console.log('Бот запущен!'))
    .catch(console.error);
const express = require("express");
const body_parser = require("body-parser");
const app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({"extended":true}))

const vkcallback_router = require("./clasess/vkcallback_api.js");
app.use("/api/vk_callback",vkcallback_router);

app.listen(4000, () => console.log("port 3000"))

const VkBot = require('node-vk-bot-api');
const Markup = require("node-vk-bot-api/lib/markup");
const api = require('node-vk-bot-api/lib/api');

const bot = new VkBot('vk1.a.I2ML-nb2yu3xD_M2Vu380hX8RUcixN6ldF74WcFwFdiI7QtNemS-6ccclpDcaDKdN7B1IK4zjuevTQYBmQcGurhI_2nkkmgyEN0YVEaAKkgawOC_MLgTkJGh82ckNKD1xEEnOtuAQ4hgaBNf9HYMyEaz1m4-gLdnzFN02l6iyyT3iHdGPh0leNaCuabWbu880eq49PL1JaEMQiC_qrkPbQ');
bot.command('/start', (ctx) => {
  ctx.reply('Привет, я Кленушка🍁\nМы даем шанс получить индивидуальную скидку на проживание в период майских праздников. ', null, Markup
    .keyboard([
      'Получить скидку',
    ], { columns: 1 })
    .inline(),
  );
});
bot.command('Получить скидку', (ctx) => {
  ctx.reply(`Количество доступных скидок
40% - 2 штуки
30% - 3 штуки
20% - 5 штук
10% - 200 штук
7% - 300 штук
5% - 500 штук

После игры вы получаете промокод, который является индивидуальным и одноразовым, действующий на все категории номеров `, null, Markup
    .keyboard([
      'Как использовать промокод',
      'Играть'
    ], { columns: 1 })
    .inline(),
  );
});
bot.command('Как использовать промокод', (ctx) => {
  ctx.reply(`Чтобы воспользоваться промокодом, надо сделать некоторые шаги.
1. Перейти на официальный сайт Парк-Отеля https://www.klen-rosha.ru/
2. Перейти в модуль бронирования
3. Выбрать даты проживания, количество гостей
4. Выбрать понравившийся номер
5. Выбрать тариф и понравившиеся услуги
6. Использовать промокод при оплате`, null, Markup
    .keyboard([
      'Играть'
    ], { columns: 1 })
    .inline(),
  );
});
bot.command('Играть', (ctx) => {
  ctx.reply(`Для участия в игре необходимо выполнить несколько условий:
1. Вступить в отряд "Кленушек"
2. Поставить лайк и сделать репост записи (ссылка)
`, null, Markup
    .keyboard([
      'Проверить выполнение условий'
    ], { columns: 1 })
    .inline(),
  );
});
bot.command('Играть', (ctx) => {
  ctx.reply(`Для участия в игре необходимо выполнить несколько условий:
1. Вступить в отряд "Кленушек"
2. Поставить лайк и сделать репост записи (ссылка)
`, null, Markup
    .keyboard([
      'Проверить выполнение условий'
    ], { columns: 1 })
    .inline(),
  );
});
bot.command('Проверить выполнение условий', (ctx) => {
  
});

bot.startPolling();

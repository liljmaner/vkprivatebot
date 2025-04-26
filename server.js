const express = require("express");
const body_parser = require("body-parser");
const app = express();
const mongodb = require("mongodb");
const moment = require("moment")
app.use(body_parser.json());
app.use(body_parser.urlencoded({"extended":true}))

const vkcallback_router = require("./clasess/users/vkcallback_router.js");
app.use("/vkbot",vkcallback_router);

app.listen(4000, () => console.log("port 4000"))

mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/')
.then((mongoclient) => 
{
    const VkBot = require('node-vk-bot-api');
    const Markup = require("node-vk-bot-api/lib/markup");

    const users_class = require("./clasess/users/users_class.js");
    const Users_Class = new users_class.users(mongoclient);

    const promocodes_class = require("./clasess/promocodes/promocodes_class.js");
    const Promocodes_Class = new promocodes_class.promocodes_class(mongoclient)
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
      ctx.reply(`Количество доступных скидок\n40% - 2 штуки\n30% - 3 штуки\n20% - 5 штук\n10% - 200 штук\n7% - 300 штук\n5% - 500 штук\nПосле игры вы получаете промокод, который является индивидуальным и одноразовым, действующий на все категории номеров `, null, Markup
            .keyboard([
              'Как использовать промокод',
              'Играть'
            ], { columns: 1 })
            .inline(),
          );
    });
    bot.command('Как использовать промокод', (ctx) => {
      ctx.reply(`Чтобы воспользоваться промокодом, надо сделать некоторые шаги.\n1. Перейти на официальный сайт Парк-Отеля https://www.klen-rosha.ru/\n2. Перейти в модуль бронирования\n3. Выбрать даты проживания, количество гостей\n4. Выбрать понравившийся номер\n5. Выбрать тариф и понравившиеся услуги\n6. Использовать промокод при оплате\n`, null, Markup
            .keyboard([
              'Играть'
            ], { columns: 1 })
            .inline(),
          );
    });
    bot.command('Играть', (ctx) => {
     ctx.reply(`Для участия в игре необходимо выполнить несколько условий:\n1. Вступить в отряд "Кленушек"\n2. Поставить лайк и сделать репост записи (ссылка)`, null, Markup
            .keyboard([
              'Проверить выполнение условий'
            ], { columns: 1 })
            .inline(),
          );
    });
    bot.command('Играть', (ctx) => {
      ctx.reply(`Для участия в игре необходимо выполнить несколько условий:\m1. Вступить в отряд "Кленушек"\n2. Поставить лайк и сделать репост записи (ссылка)`, null, Markup
              .keyboard([
                'Проверить выполнение условий'
              ], { columns: 1 })
              .inline(),
            );
    });
    bot.command('Проверить выполнение условий', (ctx) => {
      console.log(ctx['message']['from_id']  );
      Users_Class.check_requirement(ctx['message']['from_id'],(status,description) => 
      {
        if (status == 'sucess')
        {
          console.log("1")
          Promocodes_Class.get_random(ctx['message']['from_id'],(gr_status,gr_row) => 
          {
              if (gr_status == 'error')
              {
                ctx.reply(`На сервере произошла ошибка!`, null, Markup
                  .keyboard([
                    'Проверить выполнение условий'
                  ], { columns: 1 })
                  .inline(),
                );
              }
              else
              {
                ctx.reply(`Вот ваш промокод: ${gr_row}`, null, Markup
                  .keyboard([
                    'Проверить выполнение условий'
                  ], { columns: 1 })
                  .inline(),
                 );
              }
          })
        }
        else
        {
          ctx.reply('Вы либо получили свой промокод либо не выполнили одно из условий', null, Markup
            .keyboard([
              'Проверить выполнение условий'
            ], { columns: 1 })
            .inline(),
          );
        }
      })
    });

    bot.startPolling();

}) 
.catch((err) => console.log(err))


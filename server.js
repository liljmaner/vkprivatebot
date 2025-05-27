const express = require("express");
const body_parser = require("body-parser");
const app = express();
const mongodb = require("mongodb");
const base64 = require("js-base64");
app.use(body_parser.json());
app.use(body_parser.urlencoded({"extended":true}))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})


const users_router = require("./clasess/users/users_router.js");
app.use("/vkbot/users",users_router);

app.listen(4000, () => console.log("port 4000"))

mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/')
.then((mongoclient) => 
{
    const VkBot = require('node-vk-bot-api');
    const Markup = require("node-vk-bot-api/lib/markup");
    const api = require('node-vk-bot-api/lib/api');

    const users_class = require("./clasess/users/users_class.js");
    const Users_Class = new users_class.users(mongoclient);


    const promocodes_class = require("./clasess/promocodes/promocodes_class.js");
    const Promocodes_Class = new promocodes_class.promocodes_class(mongoclient)


    const bot = new VkBot('vk1.a.I2ML-nb2yu3xD_M2Vu380hX8RUcixN6ldF74WcFwFdiI7QtNemS-6ccclpDcaDKdN7B1IK4zjuevTQYBmQcGurhI_2nkkmgyEN0YVEaAKkgawOC_MLgTkJGh82ckNKD1xEEnOtuAQ4hgaBNf9HYMyEaz1m4-gLdnzFN02l6iyyT3iHdGPh0leNaCuabWbu880eq49PL1JaEMQiC_qrkPbQ');
    bot.command('/start', (ctx) => {
      ctx.reply('Привет, меня зовут Кленушка и я являюсь виртуальным асистентом Парк-отеля.\nУ нас будет проходить этно-фестиваль "Абашевские узоры" , не хочешь приехать?', null, Markup
        .keyboard([
          'Зарегистрироваться',
        ], { columns: 1 })
        .inline(),
      );
    });
    bot.command('Зарегистрироваться', (ctx) => {
      ctx.reply('Для подтверждения регистрации необходимо подписаться на нашу группу и подписаться на рассылку, чтобы мы могли оперативно рассказывать вам все организационные моменты', null, Markup
        .keyboard([
          'Проверить выполнение условий',
        ], { columns: 1 })
        .inline(),
      );
    });
    bot.command('Проверить выполнение условий', (ctx) => {
      Users_Class.festival_requirement(ctx.message.from_id,(status,row) => 
      {
            if (status == 'error')
                ctx.reply(row, null, Markup
                    .keyboard([
                      'Проверить выполнение условий',
                    ], { columns: 1 })
                    .inline(),
                );
            else
            {
                Users_Class.get_by_id(ctx.message.from_id,(ch_status,ch_row) => 
                { 
                   if (ch_status == 'error')
                    ctx.reply('Произошла ошибка на сервере', null, Markup
                       .keyboard([
                         'Проверить выполнение условий',
                        ], { columns: 1 })
                      .inline(),
                    );
                   else
                   {
                       const qr_code = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${base64.encode(JSON.stringify(ch_row))}`
                       ch_row['qr_code'] = qr_code
                       ch_row['festival_users'] = true
                       Users_Class.change(ch_row['id'], ch_row , (status,row) => 
                        {
                           if (status == 'sucess')
                             bot.sendMessage(ctx.message.from_id, 'Статус: Подтвержденный участник! Ваш персональный qr код', qr_code);
                           else
                             bot.sendMessage(ctx.message.from_id, 'Произошла ошибка на сервере');

                        })
                   }
                })
            }
      })
    });
    bot.startPolling();

}) 
.catch((err) => console.log(err))


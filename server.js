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
    bot.startPolling();

}) 
.catch((err) => console.log(err))


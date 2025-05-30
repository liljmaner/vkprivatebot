const express = require("express");
const body_parser = require("body-parser");
const app = express();
const mongodb = require("mongodb");
const base64 = require("js-base64");
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
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
    const users_class = require("./clasess/users/users_class.js");
    const Users_Class = new users_class.users(mongoclient);
    const bot = new VkBot('vk1.a.I2ML-nb2yu3xD_M2Vu380hX8RUcixN6ldF74WcFwFdiI7QtNemS-6ccclpDcaDKdN7B1IK4zjuevTQYBmQcGurhI_2nkkmgyEN0YVEaAKkgawOC_MLgTkJGh82ckNKD1xEEnOtuAQ4hgaBNf9HYMyEaz1m4-gLdnzFN02l6iyyT3iHdGPh0leNaCuabWbu880eq49PL1JaEMQiC_qrkPbQ');
    const api = require('node-vk-bot-api/lib/api');

    bot.command('Начать', (ctx) => {
      ctx.reply('Привет, меня зовут Кленушка и я являюсь виртуальным асистентом Парк-отеля.\nУ нас будет проходить этно-фестиваль "Абашевские узоры" , не хочешь приехать?', null, Markup
        .keyboard([
          'Зарегистрироваться',
          'Подписаться на рассылку'
        ], { columns: 1 })
        .inline(),
      );
    });
    bot.command('Зарегистрироваться', (ctx) => {
      ctx.reply('Для подтверждения регистрации необходимо подписаться на нашу группу и подписаться на рассылку, чтобы мы могли оперативно рассказывать вам все организационные моменты', null, Markup
        .keyboard([
          'Проверить выполнение условий',
          'Подписаться на рассылку'
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
                      'Подписаться на рассылку'
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
                           {
                              api('photos.getMessagesUploadServer', {
                                peer_id: ctx.message.from_id,
                                access_token: 'vk1.a.I2ML-nb2yu3xD_M2Vu380hX8RUcixN6ldF74WcFwFdiI7QtNemS-6ccclpDcaDKdN7B1IK4zjuevTQYBmQcGurhI_2nkkmgyEN0YVEaAKkgawOC_MLgTkJGh82ckNKD1xEEnOtuAQ4hgaBNf9HYMyEaz1m4-gLdnzFN02l6iyyT3iHdGPh0leNaCuabWbu880eq49PL1JaEMQiC_qrkPbQ',
                              })
                              .then((getserver_row) => 
                              {
                                axios({
                                    method: 'get',
                                    url: qr_code,
                                    responseType: 'stream', // Указываем, что ожидаем поток
                                })
                                .then((image_response) => 
                                {
                                    const form = new FormData();
                                    form.append('photo', image_response.data, { filename: 'image.png' }); // Можно указать имя файла
                                    console.log(form)
                                    console.log(getserver_row['response'])
                                      // Отправляем POST-запрос с формой
                                      axios.post(getserver_row['response']['upload_url'], form, {
                                        headers: {
                                            ...form.getHeaders(),
                                        },
                                    })
                                    .then((uploadserver_row) => {
                                        api('photos.saveMessagesPhoto', {
                                          photo: uploadserver_row['data']['photo'],
                                          server: uploadserver_row['data']['server'],
                                          hash: uploadserver_row['data']['hash'],
                                          access_token: 'vk1.a.I2ML-nb2yu3xD_M2Vu380hX8RUcixN6ldF74WcFwFdiI7QtNemS-6ccclpDcaDKdN7B1IK4zjuevTQYBmQcGurhI_2nkkmgyEN0YVEaAKkgawOC_MLgTkJGh82ckNKD1xEEnOtuAQ4hgaBNf9HYMyEaz1m4-gLdnzFN02l6iyyT3iHdGPh0leNaCuabWbu880eq49PL1JaEMQiC_qrkPbQ',
                                        })
                                        .then((svm_row) => 
                                        {
                                        console.log(svm_row['response'][0]['sizes'])
                                        bot.sendMessage(ctx.message.from_id, 'Вот ваш qr-code', `photo${svm_row['response'][0]['owner_id']}_${svm_row['response'][0]['id']}`);
                                        })
                                    })
                                })
                              })
                           }
                           else
                             bot.sendMessage(ctx.message.from_id, 'Произошла ошибка на сервере');

                        })
                   }
                })
            }
      })
    });
    bot.command('Подписаться на рассылку', (ctx) => {
      Users_Class.insert_newsletter(ctx.message.from_id,(status,row) => 
      {
           if (status == 'sucess')
             ctx.reply('Вы успешно подписались на рассылку', null, Markup
                       .keyboard([
                         'Проверить выполнение условий',
                        ], { columns: 1 })
                      .inline(),
              );
            else
              ctx.reply('Произошла ошибка на сервере!', null, Markup
                       .keyboard([
                         'Проверить выполнение условий',
                        ], { columns: 1 })
                      .inline(),
              );
      })
    });
    bot.startPolling();

}) 
.catch((err) => console.log(err))


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
    const { VK , Keyboard,Upload,API,APIRequest  } = require('vk-io');
    const { HearManager } = require('@vk-io/hear');
    const users_class = require("./clasess/users/users_class.js");
    const Users_Class = new users_class.users(mongoclient);
    const vk = new VK({
        token: 'vk1.a.I2ML-nb2yu3xD_M2Vu380hX8RUcixN6ldF74WcFwFdiI7QtNemS-6ccclpDcaDKdN7B1IK4zjuevTQYBmQcGurhI_2nkkmgyEN0YVEaAKkgawOC_MLgTkJGh82ckNKD1xEEnOtuAQ4hgaBNf9HYMyEaz1m4-gLdnzFN02l6iyyT3iHdGPh0leNaCuabWbu880eq49PL1JaEMQiC_qrkPbQ'
    });
    const api = new API({
          token: 'vk1.a.I2ML-nb2yu3xD_M2Vu380hX8RUcixN6ldF74WcFwFdiI7QtNemS-6ccclpDcaDKdN7B1IK4zjuevTQYBmQcGurhI_2nkkmgyEN0YVEaAKkgawOC_MLgTkJGh82ckNKD1xEEnOtuAQ4hgaBNf9HYMyEaz1m4-gLdnzFN02l6iyyT3iHdGPh0leNaCuabWbu880eq49PL1JaEMQiC_qrkPbQ'
    });
    const upload = new Upload({
        api
    });
    const hearManager = new HearManager();
    vk.updates.on('message_new', (context, next) => {
          const { messagePayload } = context;

          context.state.command = messagePayload && messagePayload.command
              ? messagePayload.command
              : null;

          return next();
    });
    vk.updates.on('message_new', hearManager.middleware);
    const hearCommand = (name, conditions, handle) => {
        if (typeof handle !== 'function') {
            handle = conditions;
            conditions = [`${name}`];
        }

        if (!Array.isArray(conditions)) {
            conditions = [conditions];
        }

        hearManager.hear(
            [
                (text, { state }) => (
                    state.command === name
                ),
                ...conditions
            ],
            handle
        );
    };
    hearCommand('Начать', async (context) => {
        await context.send({
            message: `Привет, меня зовут Кленушка и я являюсь виртуальным асистентом Парк-отеля.\nУ нас будет проходить этно-фестиваль "Абашевские узоры" , не хочешь приехать?`,
            keyboard: Keyboard.builder().inline()
                .textButton({
                    label: 'Зарегистрироваться',
                    payload: {
                        command: 'Зарегистрироваться'
                    }
                })
                .row()
                .textButton({
                    label: 'Подписаться на рассылку',
                    payload: {
                        command: 'Подписаться на рассылку'
                    }
                })

        });
    });
    hearCommand('Зарегистрироваться', async (context) => {
        await context.send({
            message: `Для подтверждения регистрации необходимо подписаться на нашу группу и подписаться на рассылку, чтобы мы могли оперативно рассказывать вам все организационные моменты`,
            keyboard: Keyboard.builder().inline()
                .textButton({
                    label: 'Проверить выполнение условий',
                    payload: {
                        command: 'Проверить выполнение условий'
                    }
                })
                .row()
                .textButton({
                    label: 'Подписаться на рассылку',
                    payload: {
                        command: 'Подписаться на рассылку'
                    }
                })
        });
    });
    hearCommand('Подписаться на рассылку', async (context) => {
        Users_Class.insert_newsletter(context.senderId,(status,row) => 
        {
            if (status == 'sucess')
              context.send({
                    message: `Вы успешно подписались на рассылку`,
                    keyboard: Keyboard.builder().inline()
                        .textButton({
                            label: 'Проверить выполнение условий',
                            payload: {
                                command: 'Проверить выполнение условий'
                            }
                        })
                        
              })
              else
                  context.send({
                        message: `Произошла ошибка на сервере`,
                        keyboard: Keyboard.builder().inline()
                            .textButton({
                                label: 'Проверить выполнение условий',
                                payload: {
                                    command: 'Проверить выполнение условий'
                                }
                            })
                            
                  })
        })
    });
    hearCommand('Проверить выполнение условий', async (context) => {
      Users_Class.festival_requirement(context.senderId,(status,row) => 
      {
            if (row != 'sucessfuly')
               context.send({
                      message: row,
                      keyboard: Keyboard.builder().inline()
                          .textButton({
                              label: 'Проверить выполнение условий',
                              payload: {
                                  command: 'Проверить выполнение условий'
                              }
                          })
                });
            else
            {
                console.log("festival_requirement_status:" ,status)
                console.log("festival_requirment_row :",row)
                Users_Class.get_by_id(context.senderId,(ch_status,ch_row) => 
                { 
                  if (ch_status == 'error')
                    context.send({
                              message: 'Произошла ошибка на сервере',
                              keyboard: Keyboard.builder().inline()
                                  .textButton({
                                      label: 'Проверить выполнение условий',
                                      payload: {
                                          command: 'Проверить выполнение условий'
                                      }
                                  })
                    });
                   else
                   {
                       ch_row['qr_code'] = qr_code
                       ch_row['festival_users'] = true
                       const qr_code = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${base64.encode(JSON.stringify(ch_row))}`
                       Users_Class.change(ch_row['id'], ch_row , (status,row) => 
                        {
                           if (status == 'sucess')
                           {
                             upload.messagePhoto({
                                        source: {
                                            value: qr_code
                                        }
                              })
                              .then((uploadphoto_row) =>
                              {
                                  api.messages.send({
                                    'message': 'Вот ваш qr code:',
                                    'peer_id': context.senderId,
                                    'attachment': uploadphoto_row,
                                    'random_id': 0
                                  })
                              })
                           }
                           else
                              context.send({
                                        message: 'Произошла ошибка на сервере',
                                        keyboard: Keyboard.builder().inline()
                                            .textButton({
                                                label: 'Проверить выполнение условий',
                                                payload: {
                                                    command: 'Проверить выполнение условий'
                                                }
                                            })
                              });
                        })
                   }
                })
            }
      })
    })
    vk.updates.start().catch(console.error);

}) 
.catch((err) => console.log(err))


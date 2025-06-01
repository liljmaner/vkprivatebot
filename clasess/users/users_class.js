
class users
{
    constructor(mongoclient)
    {
      const db = mongoclient.db("vkrandom_bot");
      this.collection = db.collection("users");
      this.mongodb = require("mongodb");
      const { API} = require('vk-io');
      this.api = new API({
          token: 'vk1.a.I2ML-nb2yu3xD_M2Vu380hX8RUcixN6ldF74WcFwFdiI7QtNemS-6ccclpDcaDKdN7B1IK4zjuevTQYBmQcGurhI_2nkkmgyEN0YVEaAKkgawOC_MLgTkJGh82ckNKD1xEEnOtuAQ4hgaBNf9HYMyEaz1m4-gLdnzFN02l6iyyT3iHdGPh0leNaCuabWbu880eq49PL1JaEMQiC_qrkPbQ'
     });
    }
    insert = (object,callback) => 
    {
       this.collection.insertOne(object)
       .then((row) => callback("sucess",row))
       .catch((err) => callback("error",err))
    }
    get_by_id = (id, callback) => 
    {
        this.collection.findOne({"id": id})
        .then((row) => callback("sucess",row))
        .catch((err) => callback("error",err) ) 
    } 
    get_by_mongoid = (mongo_id, callback) => 
    {
         this.collection.findOne({"_id": new this.mongodb.ObjectId(mongo_id)})
        .then((row) =>  callback("sucess",row))
        .catch((err) => callback("error",err) ) 
    }
    change = (id,object,callback) => 
    {
      this.collection.replaceOne({"id":id},object)
      .then((row) => callback("sucess",row))
      .catch((err) => callback("error",err) ) 
    }
    insert_maininfo = (id,callback) => 
    {
        this.api.users.get({
            'user_ids': id,
            fields: 'photo_200'
        })
        .then((ug_row) => 
        {
            this.get_by_id(id,(gbi_status,gbi_row) => 
            {
                if (gbi_status == 'error')
                    return callback(gbi_status,gbi_row)
                else
                {
                    gbi_row['name'] = `${ug_row[0]['first_name']}  ${ug_row[0]['last_name']}`;
                    gbi_row['photo_200'] = ug_row[0]['photo_200'];
                    this.change(id,gbi_row,(status,row) => callback(status,row) )
                }
            })
        })
    }
    change_feststatus = (id,status,callback) => 
    {
        this.get_by_mongoid(id,(gbmi_status,gbmi_row) => 
        {
               if (gbmi_status == 'sucess')
               {
                  gbmi_row['festival_users'] = status;
                  delete gbmi_row['_id']
                  this.change(gbmi_row['id'], gbmi_row, (ch_status,ch_row) =>
                  {
                     return callback(ch_status,gbmi_row)
                  })
               }
               else
                 return callback("error",gbmi_row)
        })
    }
    check_user   = (object, callback) => 
    { 
        this.get_by_id(object['id'], (gbi_status,gbi_row) => //gbi = get_by_id 
        {   
            if (gbi_status != 'sucess')
                return callback("error",gbi_row)
            if  (gbi_row == null || typeof(gbi_row) == 'undefined')
            {
                
                this.insert({
                    "id": object['id'],
                    "events": 
                    [ 
                        {
                            "name": "like_add",
                            "value": object['event'] == 'like_add'
                        },
                        {   
                            "name": "group_join",
                            "value": false
                        },
                        {
                            "name": "newsletter_allowed",
                            "value": false
                        }
                    ],
                    "is_used": false,
                    "festival_users": false,
                    "qr_code": ""
                }, (ins_status,ins_row) => 
                { 
                   this.insert_maininfo(object['id'],(inmi_status,inmi_row) => callback(inmi_status,inmi_row))
                } )
            }

            else
            {
                console.log("1231231231212")
                const new_events = gbi_row['events'].map(arr_el => 
                {
                       if ( arr_el['name'] == object['event'])
                          return {
                                     "name":  object['event'],
                                     "value": true
                          }
                       return arr_el
                })
                this.change(object['id'], {
                    "id": object['id'],
                    "events": new_events,
                    "is_used": gbi_row['is_used'],
                    "festival_users": gbi_row['festival_users'],
                    "qr_code": gbi_row['qr_code']
                } , (ch_status,ch_row) => callback(ch_status,ch_row))
            } 
        })
    }
    insert_newsletter = (id,callback) => 
    {
          this.get_by_id(id, ( gbi_status,gbi_row ) => 
          {
              console.log("gbi_row:" , gbi_row);
              if (gbi_status == 'error')
                return  callback('error',gbi_row)
              else
              {
                if (gbi_row != null && typeof(gbi_row) != 'undefined')
                {
                    this.change(id, 
                    { 
                            "id": gbi_row['id'],
                            "events": 
                            [ 
                                {
                                    "name": "like_add",
                                    "value": gbi_row['events'][0]['value']
                                },
                                {   
                                    "name": "group_join",
                                    "value": gbi_row['events'][1]['value']
                                },
                                {
                                    "name": "newsletter_allowed",
                                    "value": true
                                }
                            ],
                            "is_used": gbi_row['is_used'],
                            "festival_users": gbi_row['festival_users'],
                            "qr_code": gbi_row['qr_code']
                        } , (ch_status,ch_row) => callback(ch_status,ch_row))
                }
                else
                {
                   this.insert({
                        "id": id,
                        "events": 
                        [ 
                            {
                                "name": "like_add",
                                "value": false
                            },
                            {   
                                "name": "group_join",
                                "value": false
                            },
                            {
                                "name": "newsletter_allowed",
                                "value": true
                            }
                        ],
                        "is_used": false,
                        "festival_users": false,
                        "qr_code": ""
                    }, (ins_status,ins_row) => {
                        this.insert_maininfo(id,(inmi_status,inmi_row) => callback(inmi_status,inmi_row))
                    } )
                }
              }
            
          })
    }
    check_requirement = (id,callback) => 
    {
        this.get_by_id(id, (gbi_status,gbi_row) => //gbi = get_by_id  
        {
            
            if (gbi_status != 'sucess')
                return callback("error",gbi_row)
            gbi_row["events"].forEach((element) => 
            {
                if (element['value'] == false)
                    return callback("error","Вы не выполнили одно из условий.")
                    
            })
            if (gbi_row['is_used'] == true) 
                return callback("error","Вы уже получили свой промокод")

            return callback("sucess","sucessfuly")
        })
    }
    festival_requirement = (id,callback) => 
    {
        this.get_by_id(id, (gbi_status,gbi_row) => //gbi = get_by_id  
        {
            
            if (gbi_status != 'sucess')
                return callback("error",gbi_row)
            if (gbi_row != null && typeof(gbi_row) != 'undefined')
            {
                if (gbi_row['events'][2]['value'] == true  && gbi_row['events'][1]['value'] == true && gbi_row['festival_users'] == false)
                    return callback("sucess",'sucessfuly')
                else if (gbi_row['festival_users'] == true)
                    return callback("error","Вы уже участник фестиваля")
                else
                    return callback("error", `Вы не ${gbi_row['events'][2]['value'] == true ? 'подписались на группу' : 'подписались на рассылку'}`)
            }
            else
                return callback("error","Вы не выполнили оба условия.")


        })
    }
    check_subscribe = (id,callback) => 
    {
      this.api.call('groups.isMember', { 
        'group_id': '230259684',
        'user_id': id,
      })
      .then((ismember_row) => 
      {
        if (ismember_row == 1)
        {
            this.get_by_id(id,(gbi_status,gbi_row) => 
            {
                 if (gbi_status == 'sucess')
                 {
                    gbi_row['events']['1']['value'] = true
                    this.change(id,gbi_row,(ch_status,ch_row) => callback(ch_status,ch_row))
                 }
                 else
                  return callback('error', 'Произошла ошибка при получении пользователя')

            })
        }
        else
           return callback('error','Вы не подписаны на группу?')
      })   
    }

}
module.exports = 
{
    users
}
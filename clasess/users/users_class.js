
class users
{
    constructor(mongoclient)
    {
      const db = mongoclient.db("vkrandom_bot");
      this.collection = db.collection("users")
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
    change = (id,object,callback) => 
    {
      this.collection.replaceOne({"id":id},object)
      .then((row) => callback("sucess",row))
      .catch((err) => callback("error",err) ) 
    }
    check_user   = (object, callback) => 
    { 
        this.get_by_id(object['id'], (gbi_status,gbi_row) => //gbi = get_by_id 
        {   
            if (gbi_status != 'sucess')
                return callback("error",gbi_row)
            if  (gbi_row == null || typeof(gbi_row) == 'undefined')
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
                            "value": object['event'] == 'group_join'
                        },
                        {
                            "name": "newsletter_allowed",
                            "value": false
                        }
                    ],
                    "is_used": false,
                    "festival_users": false,
                    "qr_code": ""
                }, (ins_status,ins_row) => callback(ins_status,ins_row) )
            else
            {
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
                    }, (ins_status,ins_row) => callback(ins_status,ins_row) )
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
                gbi_row["events"].forEach((element) => 
                {
                    if (element['value'] == false && element['name'] != 'like_add')
                        return callback("error","Вы не выполнили одно из условий.")
                        
                })
                if (gbi_row['festival_users'] == true ) 
                    return callback("error","Вы уже учавствуете в фестивале ")

                return callback("sucess","sucessfuly")
            }
            else
                return callback("error","Вы не выполнили одно из условий.")


        })
    }

}
module.exports = 
{
    users
}
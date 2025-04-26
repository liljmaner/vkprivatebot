class promocodes_class
{
  constructor(mongoclient) 
  {
    const db = mongoclient.db("vkrandom_bot");
    this.collection = db.collection("promocodes")
    const users_class = require("../users/users_class.js")
    this.Users_Class = new users_class.users(mongoclient)
  }
  find_one = (chance,callback) => 
  {
    this.collection.findOne({"chance": chance})
    .then((row) => callback("sucess",row))
    .catch((err) => callback("error",err))
  }
  get_random = (user_id,callback) => 
  {
    const chance = Math.floor(Math.random() * 101);
    if (chance <= 3) { // p2c row
       this.find_one({$lt: 4}, (fo_status,fo_row) => {
        this.Users_Class.change(user_id, { 
            "id": user_id,
            "events": 
            [ 
                {
                    "name": "like_add",
                    "value": true
                },
                {
                    "name": "group_join",
                    "value": true
                }
            ],
            "is_used": true
        }, (ch_status,ch_row) => 
        { 
          console.log("ch_status:",ch_status)
          console.log("ch_row",ch_row)  
          if (ch_status != 'sucess')
            return callback("error",ch_row)
          return callback("sucess",fo_row['promocode_name'])
        })
       } )
    } else if (chance <= 7) {
        this.find_one({$lt: 4}, (fo_status,fo_row) => {
            this.Users_Class.change(user_id, { 
                "id": user_id,
                "events": 
                [ 
                    {
                        "name": "like_add",
                        "value": true
                    },
                    {
                        "name": "group_join",
                        "value": true
                    }
                ],
                "is_used": true
            }, (ch_status,ch_row) => 
            { 
              console.log("ch_status:",ch_status)
              console.log("ch_row",ch_row)  
              if (ch_status != 'sucess')
                return callback("error",ch_row)
              return callback("sucess",fo_row['promocode_name'])
            })
           } )
    } else if (chance <= 40) {
        this.find_one({$lt: 4}, (fo_status,fo_row) => {
            this.Users_Class.change(user_id, { 
                "id": user_id,
                "events": 
                [ 
                    {
                        "name": "like_add",
                        "value": true
                    },
                    {
                        "name": "group_join",
                        "value": true
                    }
                ],
                "is_used": true
            }, (ch_status,ch_row) => 
            { 
              console.log("ch_status:",ch_status)
              console.log("ch_row",ch_row)  
              if (ch_status != 'sucess')
                return callback("error",ch_row)
              return callback("sucess",fo_row['promocode_name'])
            })
        })
    } else if (chance > 40) {
        this.find_one({$lt: 4}, (fo_status,fo_row) => {
            this.Users_Class.change(user_id, { 
                "id": user_id,
                "events": 
                [ 
                    {
                        "name": "like_add",
                        "value": true
                    },
                    {
                        "name": "group_join",
                        "value": true
                    }
                ],
                "is_used": true
            }, (ch_status,ch_row) => 
            { 
              console.log("ch_status:",ch_status)
              console.log("ch_row",ch_row)  
              if (ch_status != 'sucess')
                return callback("error",ch_row)
              return callback("sucess",fo_row['promocode_name'])
            })
        })
    }
  }

}
module.exports = 
{
    promocodes_class
}
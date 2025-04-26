
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
                            "name": "is_liked",
                            "value": object['event'] == 'is_liked'
                        },
                        {
                            "name": "is_subscribed",
                            "value": object['event'] == 'group_join'
                        }
                    ]
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
                    "events": new_events
                } , (ch_status,ch_row) => callback(ch_status,ch_row))
            } 
        })
    }
}
module.exports = 
{
    users
}
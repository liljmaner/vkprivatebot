const router = require("express").Router();

const request_check = require("../request_check.js");
const Request_Check = new request_check.request_check();

const Request_CheckJSON = require("../request_check.json")

router.post("/new_event", (req,res) => 
{ 
  Request_Check.Check(Request_CheckJSON.new_event,req.body,(status) => 
  {
    if (status == 'sucess')
    {
      console.log(Request_CheckJSON.new_event)
      const mongodb = require("mongodb");
      mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/')
      .then((mongoclient) => 
      { 
        console.log(req.body['type'])
        if (req.body['type'] == 'group_join' || req.body['type'] == 'like_add'  )
        {
          console.log("1")
          const users_class = require("./users_class.js");
          const Users_Class = new users_class.users(mongoclient);
          Users_Class.check_user({
              "id": typeof(req.body['object']['user_id']) == 'undefined' ?   req.body['object']['liker_id'] : req.body['object']['user_id']  ,
              "event": req.body['type'],
          }, (cu_status,cu_row) => 
          {
            if (cu_status == 'sucess')
              res.status(200).send("ffe2335e");
            else
              res.status(500).json({"status": "error", "description": cu_row})
          })
          console.log(req.body);
        }
        else 
        {
          console.log("2")
          res.status(200).send("ffe2335e");

        }
      })
      .catch((err) => res.status(500).json({"status": "error", "description": err}))
    }
    else
       res.status(500).json({"status": "error", "description": "request check error"})
  })
})

module.exports = router
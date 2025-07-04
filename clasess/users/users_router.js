const router = require("express").Router();

const request_check = require("../request_check.js");
const Request_Check = new request_check.request_check();

const Request_CheckJSON = require("./request_check.json")
const mongodb = require("mongodb");
const { API} = require('vk-io');
const api = new API({
          token: 'vk1.a.I2ML-nb2yu3xD_M2Vu380hX8RUcixN6ldF74WcFwFdiI7QtNemS-6ccclpDcaDKdN7B1IK4zjuevTQYBmQcGurhI_2nkkmgyEN0YVEaAKkgawOC_MLgTkJGh82ckNKD1xEEnOtuAQ4hgaBNf9HYMyEaz1m4-gLdnzFN02l6iyyT3iHdGPh0leNaCuabWbu880eq49PL1JaEMQiC_qrkPbQ'
});
mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/')
.then((mongoclient) => 
{
   const users_class = require("./users_class.js");
   const Users_Class = new users_class.users(mongoclient);
  router.post("/new_event", (req,res) => 
  { 
      Request_Check.Check(Request_CheckJSON.new_event,req.body,(status) => 
      {
        if (status == 'sucess')
        {
            console.log(Request_CheckJSON.new_event)
            console.log(req.body['type'])
            if (req.body['type'] == 'like_add'  )
            {
              console.log("1")
              Users_Class.check_user({
                  "id": req.body['object']['liker_id'] ,
                  "event": req.body['type'],
              }, (cu_status,cu_row) => 
              {
                console.log(cu_row);
                if (cu_status == 'sucess')
                  res.status(200).send("a2ff670e");
                else
                  res.status(500).json({"status": "error", "description": cu_row})
              })
              console.log(req.body);
            }
            else 
            {
              console.log("2")
              res.status(200).send("a2ff670e");
    
            }
        }
        else
           res.status(500).json({"status": "error", "description": "request check error"})

      })
  })
  router.post("/insert_newsletter", (req,res) => 
  { 
      Request_Check.Check(Request_CheckJSON.insert_newsletter,req.body,(status) => 
      {
        if (status == 'sucess')
        {
          Users_Class.insert_newsletter(req.body['vk_user_id'], (status,row) => 
          {
                if (status == 'sucess')
                  res.status(200).send({"status": status, "description": row} );
                else
                  res.status(500).json({"status": status, "description": row})
          })
        }
        else
           res.status(500).json({"status": "error", "description": "request check error"})
      })
  })
  router.post("/get_by_id", (req,res) => 
  { 
      Request_Check.Check(Request_CheckJSON.get_by_id,req.body,(status) => 
      {
        if (status == 'sucess')
        {

          console.log("1")
          Users_Class.get_by_mongoid(req.body['id'], (status,row) => 
          {
                if (status == 'sucess')
                    res.status(200).send({"status": status, "description": row} );
                else
                  res.status(500).json({"status": status, "description": row})
          })
        }
        else
           res.status(500).json({"status": "error", "description": "request check error"})
      })
  })
  router.post("/change_feststatus", (req,res) => 
  { 
      Request_Check.Check(Request_CheckJSON.change_feststatus,req.body,(status) => 
      {
        if (status == 'sucess')
        {
          Users_Class.change_feststatus(req.body['id'],req.body['status'], (status,row) => 
          {
                if (status == 'sucess')
                    res.status(200).send({"status": status, "description": row} );

                else
                  res.status(500).json({"status": status, "description": row})
          })
        }
        else
           res.status(500).json({"status": "error", "description": "request check error"})
      })
  })
})
.catch((err) => console.log("[mongodb_connecterror]:",err))

module.exports = router
class request_check
{
  constructor() {
    this.jsonschema = require('jsonschema');
    this.validator = new this.jsonschema.Validator();
    const vk_funcs = require("./vk_funcs");
    this.Vk_Funcs = new vk_funcs.Vk_Funcs();
  }
  Check = (check_object , object_to_check,is_vkcheck,callback) => 
  {
   const valid_obj = this.validator.validate(object_to_check,check_object)//object_to_check,check_object
   console.log(valid_obj);
   console.log(valid_obj.valid);
   if (valid_obj.valid == true)
   {
            if (is_vkcheck == true)
            {
                console.log(object_to_check);
                const args_massive = []
                for (let key in object_to_check) 
                  if (key.includes("vk_"))
                    args_massive.push({
                     "key": key,
                     "value": object_to_check[key]
                    })
                 console.log(this.Vk_Funcs.verifyLaunchParams(object_to_check['sign'],args_massive,"WV5IO4Vgv2t6o1uCoVbp"))
                 return callback(this.Vk_Funcs.verifyLaunchParams(object_to_check['sign'],args_massive,"WV5IO4Vgv2t6o1uCoVbp") == true ? "sucess" : "false")
            }
              else
                return callback("sucess")

   }
   return callback("false")
  }
}
module.exports = {
    request_check
}
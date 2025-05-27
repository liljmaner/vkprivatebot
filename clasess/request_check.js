class request_check
{
  constructor() {
    this.jsonschema = require('jsonschema');
    this.validator = new this.jsonschema.Validator();
    const vk_funcs = require("./vk_funcs");
    this.Vk_Funcs = new vk_funcs.Vk_Funcs();
  }
  Check = (check_object , object_to_check,callback) => 
  {
   const valid_obj = this.validator.validate(object_to_check,check_object)//object_to_check,check_object
   if (valid_obj.valid == true)
   {
                return callback("sucess")

   }
   else 
     return callback("false")
  }
}
module.exports = {
    request_check
}
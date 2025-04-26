class request_check
{
  constructor() {
     this.jsonschema = require('jsonschema');
     this.validator = new this.jsonschema.Validator();
  }
  Check = (check_object , object_to_check,callback) => 
  {
   const valid_obj = this.validator.validate(object_to_check,check_object)//object_to_check,check_object
   console.log(valid_obj.valid);
   if (valid_obj.valid == true)
     return callback("sucess")
   return callback("error")
  }
}
module.exports = {
    request_check
}
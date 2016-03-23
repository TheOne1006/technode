var mongoose = require('mongoose')

  , Schema = mongoose.Schema;



mongoose.connect('mongodb://root:root@ds029630.mlab.com:29630/protheone');



var TestSchema = new Schema({

   user_id        : {type : Number, index : true}

  ,username       : {type : String}

});



var model_name = coll_name = 'taobao';

mongoose.model(model_name, TestSchema, coll_name);



var TAOBAO  = mongoose.model(model_name, coll_name);

var taobao  = new TAOBAO();

taobao.user_id  = 1;

taobao.username = 'xuanhou';

taobao.save(function(err) {

  if (err) {

    console.log('save failed');

  }

  console.log('save success');

});

const { Schema, model } = require('../Connection');

const mySchema = new Schema({
    name: String,
    email: { type: String, require: true },
    password: { type: String, require: true },
    role :{type:String, 
        enum:['admin','company','participant'], 
        default:'participant'},
    createdAt: { type: Date, default: Date.now },
})
module.exports = model('users', mySchema);
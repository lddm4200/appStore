const mongoose = require("mongoose");

const uri = "mongodb+srv://longddm4200:longddm4200@longddm4200.l2gxluo.mongodb.net/app_store" 


const connect = async () => {
    try{
        await mongoose.connect(uri);
        console.log('connect success')
    }catch(err){
        console.log(err);
        console.log('connect fail')
    }
}

module.exports = {connect}
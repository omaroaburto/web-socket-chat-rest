const jwt = require('jsonwebtoken');
const {Usuario} = require("../models/");

const createJWT = ( uid='')=>{
    return new Promise((resolve, reject)=>{
        const payload = {uid};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '3d'
        },(err, token)=>{
                if(err){
                    console.log(err);
                    reject('No se pudo generar el token');
                }else{
                    resolve( token );
                }
        });
    });
}

const checkToken = async( token = '') =>{
    try {
        if(token<10){
            return null;
        }
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user =  await Usuario.findById(uid);
        if(user){
            if(user.status){
                return user;
            }else{
                return null;
            }
        }else{
            return null;
        }
    } catch (error) {
        return null;
    }
}

module.exports = {
    createJWT,
    checkToken
}
const {
    response,
    request
} = require('express');
const jwt = require('jsonwebtoken'); 
const Usuario = require("../models/usuario");

const validarJWT = async (req= request, res= response, next)=>{
    const token = req.header('x-token');
    if(!token){
        return res.status(400).json({
            msg:"No hay token en la petición"
        });
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY); 
        const usuario = await Usuario.findById(uid);
        if(!usuario){
            return res.status(401).json({
                msg: "token no válido - El usuario no existe"
            });
        }
        if(!usuario.status){
            return res.status(401).json({
                msg: "El usuario está desactivado"
            });
        } 
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg:"token no válido"
        });
    }
}

module.exports = {
    validarJWT
}

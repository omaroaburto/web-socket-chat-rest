const {
    request,
    response
} = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { createJWT } = require("../helpers/create-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login =  async(req = request, res = response)=>{
    const {email, password} = req.body;
    //verificar si email existe
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        return res.status(400).json({
            msg:'Usuario/password no son correctos - email'
        });
    }
    //verificar si usuario está activo
    if(!usuario.status){
        return res.status(400).json({
            msg:'Usuario/password no son correctos - estado = false'
        });
    }
    //verificar la contraseña
    const validatePassword = bcryptjs.compareSync(password, usuario.password);

    if(!validatePassword){
        return res.status(400).json({
            msg:'Usuario/password no son correctos - password'
        });
    }
    //generar json web token

    const token = await createJWT(usuario.id );
    try {
        res.status(500).json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hable con el administrador'
        });
    }
    
}

const googleSignIn = async (req =request, res = response, next)=>{
    const {id_token} = req.body;
    const {name, img, email} = await googleVerify( id_token );

    let usuario = await Usuario.findOne({email});
    if(!usuario){
        const data = {
            name,
            email,
            password:'---',
            img,
            google: true
        }
        usuario = new Usuario( data);
        await usuario.save();
    }else{
        //si el usuario no está registrado con google pero tiene registro con el correo
    }

    if(!usuario.status){
        return  res.status(401).json({
            msg:'Usuario bloqueado'
        });
    }

    const token = await createJWT( usuario.id)

    try {
        res.json({
            msg:"ingreso con google", 
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg:"Token de google no es válido"
        });
    }
    next()
}

module.exports = {
    login,
    googleSignIn
}
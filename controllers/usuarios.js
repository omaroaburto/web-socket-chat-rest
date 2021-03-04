const {
    request,
    response
} = require("express");
const bcryptjs =  require('bcryptjs');
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response)=>{
    const {limit=5, since=0} =  req.query;
    const query = {status: true}
    const [countUsers, users ] =  await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(since))
            .limit(Number(limit))
    ]);

    res.json({
        countUsers,
        users
    });
}

//post usuarios 
const postUsuarios = async (req = request, res = response)=>{
    const {name, email, password, role} = req.body;
    const usuario = new Usuario({name, email, password, role}); 
    
    //encriptar contraseña
    const salt = bcryptjs.genSaltSync();//nivel de encriptación
    usuario.password = bcryptjs.hashSync(password, salt);//encriptar contraseña
    //guardar en base de datos
    await usuario.save();
    res.json({ 
        usuario
    });
}

const putUsuarios = async (req = request, res = response)=>{
    const {id} = req.params;
    const {_id, password, google, email, ...others} = req.body;
    //validar 
    if(password){
        const salt = bcryptjs.genSaltSync();//nivel de encriptación
        others.password = bcryptjs.hashSync(password, salt);//encriptar contraseña
    }

    const  usuario =  await Usuario.findByIdAndUpdate( id, others );


    res.json({
        msg:"api put",
        usuario
    });
}

const deleteUsuarios = async (req = request, res = response)=>{
    const {id} = req.params; 
    const usuario =  await Usuario.findByIdAndUpdate(id,{status:false});
    res.json({usuario});
}

const patchUsuarios = (req = request, res = response)=>{
    res.json({
        msg:"api patch"
    });
}

module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios,
    patchUsuarios
}

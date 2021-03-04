const {request, response} = require('express');

const isAdminRole = (req= request, res = response, next) =>{
    if(!req.usuario){
        return res.status(500).json({
            msg: "Se require verificar el role sin verificar el token primero"
        });
    }
    const {role, name} = req.usuario;
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} no es administrador.`
        });
    }
    next();
}

const haveRole = ( ... roles)=>{
    return (req= request, res = response, next)=>{
        if(!req.usuario){
            return res.status(500).json({
                msg: "Se require verificar el role sin verificar el token primero"
            });
        }

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    haveRole
}
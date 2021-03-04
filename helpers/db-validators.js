const Role = require('../models/role');
const {Usuario, Category }= require('../models/');

//función que consulta si es válido el rol
const isRoleValidate = async (role ='') =>{
    const existRol = await Role.findOne({role});
    if(!existRol){
        throw new Error(`El rol ${role} no está registrado en la base de datos.`);
    }
    return true;
}

//consulta si está registrado el email 
const existEmail = async (email)=>{
    const existe = await Usuario.findOne({ email});
    if( existe){
        throw new Error(`El correo ${email} ya está registrado`);   
    }
    return true;
}

const existId = async (id)=>{
    const existe = await Usuario.findById(id);
    if( !existe){
        throw new Error(`El ID ${id} del usuario no existe.`);   
    }
    return true;
}

const existIdCategory = async (id) => {
    const existe = await Category.findById(id);
    if(!existe){
        throw new Error(`El ID ${id} de la categoria no existe. `)
    }
    return true;
}

const collectionValidate = (collection ='', arg=[])=>{
    if(!arg.includes(collection)){
        throw new Error(`${collection} no pertenece a las colecciones, opciones válidas ${arg}`)
    }
    return true;
}
module.exports = {
    isRoleValidate,
    existEmail, 
    existId,
    existIdCategory,
    collectionValidate
}
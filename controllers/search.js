const { 
    response, 
    request 
} = require("express");
const {ObjectId} = require("mongoose").Types;
const {Usuario, Product, Category} = require("../models/");
//colecciones permitidas en la búsqueda
const allowedColletion =[ 
    'user',
    'category',
    'product',
    'role'
];

//función para buscar un usuario
const searchUser = async (quest ='', res = response) =>{
    //búsqueda por id
    const isMongoId = ObjectId.isValid(quest);
    if(isMongoId){
        const user =  await Usuario.findById(quest)
        res.json({
            result: (user)?[user]:[]
        });
    }
    //búsqueda por otros parámetros: nombre, correo
    const regex = new RegExp(quest,'i');
    const users = await Usuario.find({
        $or: [{name: regex},{email:regex}],
        $and:[{status:true}]
    });
    res.json({
        results: users
    })
}
//búsqueda de productos
const searchProduct = async (quest ='', res = response) =>{
    //búsqueda por id
    const isMongoId = ObjectId.isValid(quest);//validar si es de formato id mongo
    if(isMongoId){
        const product=  await Product.findById(quest)
                            .populate('category','name');//consultar si existe id
        res.json({
            result: (product)?[product]:[]
        });
    }
    //búsqueda por otros parámetros: nombre, correo
    const regex = new RegExp(quest,'i');
    const product = await Product.find({
        name: regex,
        $and:[{status:true}]
    })
    .populate('category','name');
    
    res.json({
        results: product
    })
}
//búsqueda de categoria
const searchCategory = async (quest ='', res = response) =>{
    //búsqueda por id
    const isMongoId = ObjectId.isValid(quest);//validar si es de formato id mongo
    if(isMongoId){
        const category=  await Category.findById(quest)//consultar si existe id
        res.json({
            result: (category)?[category]:[]
        });
    }
    //búsqueda por otros parámetros: nombre, correo
    const regex = new RegExp(quest,'i');
    const category = await Category.find({
        name: regex,
        $and:[{status:true}]
    });
    res.json({
        results: category
    })
}
//método para hacer búsquedas 
const search = (req= request, res=response)=>{
    const {collection, quest} = req.params;
    
    if(!allowedColletion.includes(collection)){
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${allowedColletion}`,     
        })
    }
    switch (collection) {
        case 'user': 
            searchUser(quest,res);
            break;
        case 'category':
            searchCategory(quest,res);
            break;
        case 'product':
            searchProduct(quest,res);
            break;
        default:
            res.status(500).json({
                msg:"No se ha implementado esa coleccion."
            });
            break;
    }
}

module.exports = {
    search
}
const {request, response} = require("express");
const Category = require('../models/category');

//crear categoria
const postCategory = async (req=request, res= response)=>{
    const name = req.body.name.toUpperCase();
    const categoryDB =  await Category.findOne({name});
    if(categoryDB){
        return res.status(400).json({
            msg:`La categoria ${categoryDB.name} ya existe`
        });
    }
    //generar data a guardar
    const data = {
        name,
        user: req.usuario._id
    }
    const category  = new Category(data);
    category.save();
    return res.status(201).json(category);
}
//obtener categorias
const getCategories = async (req= request, res = response)=>{
    const {limit=5, since=0} =  req.query;
    const query = {status:true};
    const [countCategories, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user','name')
            .skip(Number(since))
            .limit(Number(limit))
    ]); 
    return res.json({
        countCategories,
        categories
    })
}
//obtener categoria
const getCategory = async (req= request, res = response)=>{
    try {
        const{ id} =req.params;  
        const category = await Category.findById(id)
                                    .populate('user','name'); 
        if(category){ 
            return res.json({ 
                category
            });
        }
    } catch (error) {
        return res.status(400).json({
            msg:`no existe la categoria`
        });
    }
    
}
//actualizar categoria
const updateCategory = async (req= request, res = response)=>{
    const {id} = req.params;
    const {_id, user, ...other} = req.body;
    other.user = req.usuario._id;  
    other.name = other.name.toUpperCase();  

    const category = await Category.findByIdAndUpdate(id,other, {new:true}); 
    res.json({
        msg:"update category",
        category
    })

}
//desactivar categoria
const deleteCategory = async (req= request, res = response)=>{
    const {id} = req.params;
    const category = await Category.findByIdAndUpdate(id, {
        status: false,
        user: req.usuario._id
    })
    res.json({
        msg:"delete category",
        category
    });
}

module.exports = {
    postCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};
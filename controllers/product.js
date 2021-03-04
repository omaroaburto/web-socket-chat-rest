const { 
    request, 
    response 
} = require("express");
const { Product, Category}  = require("../models");

//obtener un producto
const getProduct = async (req = request, res = response)=>{
    try {
        const{ id} =req.params;  
        const product = await Product.findById(id)
                                    .populate('user','name')
                                    .populate('category','name'); 
        if(product){ 
            return res.json({ 
                product
            });
        }
    } catch (error) {
        return res.status(400).json({
            msg:`no existe la el producto`
        });
    }
}
//obtener lista de productos
const getProducts = async (req = request, res = response)=>{
    const {limit=5, since=0} =  req.query;
    const query = {status:true};
    const [countProducts, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user','name')
            .populate('category','name')
            .skip(Number(since))
            .limit(Number(limit))
    ]); 
    return res.json({
        countProducts, 
        products
    })
}
//crear producto
const postProduct = async (req = request, res = response)=>{
    const {name, category, price, description} = req.body;
    //validaciones
    const nameDB = await Product.findOne({name});
    if(nameDB){
        res.status(400).json({
            msg: `El nombre del producto ${name} ya está registrado en la base de datos.`
        });
    }
    try { 
        const categoryDB = await Category.findById(category);
        if(!categoryDB){
            res.status(400).json({
                msg: `No existe la categoria con id ${category}`
            });
        } 
        if(price<0){
            res.status(400).json({
                msg: `El precio es un númeo negativo`
            });
        }  
        const data ={
            name,
            price,
            category,
            user: req.usuario._id,
            description
        };
        const product = new Product(data);
        product.save();
        return res.status(201).json({
            product
        });
    } catch (error) {
        res.status(400).json({
            msg: `Error ingrese los datos `
        });
    }
}
//actualizar producto
const updateProduct = async (req = request, res = response)=>{
    const {id} = req.params;
    const {_id, user, ...other} = req.body;
    try {
        if(other.price<0){
            res.status(400).json({
                msg: `El precio es un númeo negativo`
            });
        } 
        const isCategoryId = await Category.findById(other.category);
        if(isCategoryId){
            other.user = req.usuario._id;   
            const product = await Product.findByIdAndUpdate(id,other, {new:true}); 
            res.json({
                msg:"update product",
                product
            })
        }else{
            res.status(400).json({
                msg:"Error al actualizar el producto- id categoria", 
            })
        }
    } catch (error) {
        res.status(500).json({
            msg:"Error al actualizar el producto",
          
        })
    }
}
//eliminar producto
const deleteProduct = async (req = request, res = response)=>{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, {
        status: false,
        user: req.usuario._id
    })
    res.json({
        msg:"delete category",
        product
    });
}

module.exports = {
    getProduct,
    getProducts,
    postProduct,
    updateProduct,
    deleteProduct
}
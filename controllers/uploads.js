const { 
    response, 
    request 
} = require("express");
const path = require("path");
const fs = require("fs");
const cloudinary = require('cloudinary').v2
const { uploadFileH } = require("../helpers/uploadFile");
const {Usuario, Product} = require("../models/")
cloudinary.config(process.env.CLOUDINARY_URL);

const fileUpload = async (req= request, res=response)=>{  
        try {
          const name = await uploadFileH(req.files,['pdf', 'txt']);
          res.json({
            name
          })
        } catch (msg) {
            res.status(400).json({
              msg
            })
        }
}

//actualizar imágen utilizando el folder del sistema
const updateImage = async(req=request, res=response)=>{
      const {id, collection} = req.params;
      let model;
      switch (collection) {
        case 'user':
            model =  await Usuario.findById(id);
            if(!model){
              return res.status(400).json({
                msg:`No existe un ${collection} con el id ${id}`
              });
            }
            break;
        case 'product':
            model =  await Product.findById(id);
            if(!model){
              return res.status(400).json({
                msg:`No existe un ${collection} con el id ${id}`
              });
            }
            break;
        default:
            return res.status(500).json({
              msg:"Error - no implementado"
            });
      }
      //Limpiar imágenes previas

      if(model.img){
        const pathImage = path.join(__dirname,"../uploads", collection, model.img);
        if(fs.existsSync(pathImage)){
          fs.unlinkSync(pathImage);
        }
      }

      //guardar imágen
      const name = await uploadFileH(req.files,undefined,collection);
      model.img = name;
      await model.save();
      res.json({
          model
      });
}

//actualizar la imagen con servicio de cloudinary
const updateImageCloudinary = async(req=request, res=response)=>{
      const {id, collection} = req.params;
      let model;
      switch (collection) {
        case 'user':
            model =  await Usuario.findById(id);
            if(!model){
              return res.status(400).json({
                msg:`No existe un ${collection} con el id ${id}`
              });
            }
            break;
        case 'product':
            model =  await Product.findById(id);
            if(!model){
              return res.status(400).json({
                msg:`No existe un ${collection} con el id ${id}`
              });
            }
            break;
        default:
            return res.status(500).json({
              msg:"Error - no implementado"
            });
      }
      //Limpiar imágenes previas

      if(model.img){
          const nameArr =  model.img.split('/');
          const name = nameArr[nameArr.length-1];
          const [public_id] = name.split('.');
          cloudinary.uploader.destroy(public_id);
      }
      
      //guardar imágen
      const {tempFilePath} = req.files.archive;
      const {secure_url} =  await cloudinary.uploader.upload(tempFilePath);

      model.img = secure_url;
      await model.save();
      res.json({
          model
      });
}

//mostrar imagen
const getUpload = async(req=request, res=response)=>{
      const {id, collection} = req.params;
      let model;
      switch (collection) {
        case 'user':
            model =  await Usuario.findById(id);
            if(!model){
              return res.status(400).json({
                msg:`No existe un ${collection} con el id ${id}`
              });
            }
            break;
        case 'product':
            model =  await Product.findById(id);
            if(!model){
              return res.status(400).json({
                msg:`No existe un ${collection} con el id ${id}`
              });
            }
            break;
        default:
            return res.status(500).json({
              msg:"Error - no implementado"
            });
      }
    
      if(model.img){
        const pathImage = path.join(__dirname,"../uploads", collection, model.img);
        if(fs.existsSync(pathImage)){ 
            return res.sendFile(pathImage);
        }
      }
      const pathImage = path.join(__dirname,"../assets","no-image.jpg");
      res.sendFile(pathImage);

} 

module.exports = {
    fileUpload,
    updateImage,
    updateImageCloudinary,
    getUpload
}
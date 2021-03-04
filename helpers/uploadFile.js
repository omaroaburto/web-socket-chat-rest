 
const path = require("path");
const {v4:uuidv4} = require("uuid");
const validExtension= [
    'jpg',
    'gif',
    'jpeg',
    'png'
];
const uploadFileH = (files, vextension= validExtension,  folder="")=>{
    return new Promise((resolve, reject)=>{
        const {archive} = files;
        //obtener extensión de los archivos
        const cutFileName = archive.name.split('.');
        const extension = cutFileName[cutFileName.length-1];
        //validar extensiones válidas
        if(!vextension.includes(extension)){
            return reject(`La extensión ${extension} es inválida, las extesiones válidas son: ${vextension}`);    
        }

        const temporyName = `${uuidv4()}.${extension}`; 
    
        const uploadPath = path.join(__dirname, '../uploads/', folder, temporyName);
    
        archive.mv(uploadPath, (err)=>{
            if (err) {
                return reject(err);
            }    
            return resolve(temporyName); 
        });       
    });
}




module.exports = {
    uploadFileH
}
const { request, response } = require("express");

const validateFileUpload = (req=request, res=response, next)=>{
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archive) {
        return res.status(400).json({
            msg: "no hay archivos en la petición"
        });
    }
    next();
}

module.exports = {
    validateFileUpload
}
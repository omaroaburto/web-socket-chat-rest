const {Router} = require("express"); 
const { check } = require("express-validator");
const { fileUpload, updateImageCloudinary,updateImage, getUpload } = require("../controllers/uploads");
const { collectionValidate } = require("../helpers/db-validators");
const { validateUser, validateFileUpload } = require("../middlewares/"); 
const router = Router(); 

const allowedCollection = [
    'user',
    'product'
];

router.post("/", validateFileUpload,fileUpload);

router.put("/:collection/:id",[
    validateFileUpload,
    check('id', 'No es un ID válido').isMongoId(),
    check('collection').custom(c => collectionValidate(c,allowedCollection)),
    validateUser
], updateImageCloudinary);

router.get("/:collection/:id",[
    check('id', 'No es un ID válido').isMongoId(),
    check('collection').custom(c => collectionValidate(c,allowedCollection)),
    validateUser
],getUpload);

module.exports = router;
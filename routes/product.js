const {Router} = require("express");
const {check} = require("express-validator");
const {
    getProduct,
    getProducts,
    postProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product');
const { 
    isNumber, 
    isPositiveNumber 
} = require("../helpers/price-validate");
const { 
    validarJWT, 
    haveRole,
    validateUser 
} = require("../middlewares");

const router = Router();
//obtener productos
router.get('/',getProducts);

//obtener producto
router.get('/:id',[
    check('id','No es un id válido').isMongoId(),
    validateUser
], getProduct);

//crear producto
router.post('/',[
    validarJWT,
    haveRole('ADMIN_ROLE','SELLER_ROLE'),
    check("name", "El nombre es requerido").not().isEmpty(), 
    check("description", "La descripción es requerida").not().isEmpty(), 
    check("category","El id de la categoria es requerido").isMongoId(), 
    validateUser
],postProduct);

//actualizar producto 
router.put('/:id',[
    validarJWT,
    haveRole('ADMIN_ROLE','SELLER_ROLE'),
    check("name", "El nombre es requerido").not().isEmpty(), 
    check("description", "La descripción es requerida").not().isEmpty(), 
    check("category","El id de la categoria es requerido").isMongoId(), 
    validateUser
],updateProduct);
//eliminar producto
router.delete('/:id',[
    validarJWT,
    haveRole('ADMIN_ROLE','SELLER_ROLE'),  
    validateUser
],deleteProduct);

module.exports = router;
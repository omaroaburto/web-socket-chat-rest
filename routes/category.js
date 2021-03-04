const {Router} = require("express"); 
const { check } = require("express-validator");
const { 
    postCategory, 
    getCategories, 
    getCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/category");
const { existIdCategory } = require("../helpers/db-validators");
const { 
    validarJWT,
    validateUser, 
    haveRole
} = require("../middlewares");
const router = Router();
//obtener todas las categorias - público
router.get('/',getCategories);
//obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existIdCategory),
    validateUser
],getCategory);

// crear categoria - private
router.post('/',[
    validarJWT, 
    haveRole('ADMIN_ROLE','SELLER_ROLE'),
    check("name", "El nombre es requerido").not().isEmpty(), 
    validateUser
],postCategory);

//actualizar una categoria - private 
router.put('/:id',[
    validarJWT,
    haveRole('ADMIN_ROLE','SELLER_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existIdCategory)
],updateCategory);

//borrar una categoria - private
router.delete('/:id',[
    validarJWT,
    haveRole('ADMIN_ROLE','SELLER_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existIdCategory)
], deleteCategory);

module.exports = router;
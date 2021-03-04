const {Router} = require("express"); 
const { check } = require("express-validator");
const { 
    getUsuarios, 
    postUsuarios, 
    putUsuarios,
    deleteUsuarios,
    patchUsuarios
} = require("../controllers/usuarios");
const { 
    isRoleValidate, 
    existEmail, 
    existId
} = require("../helpers/db-validators"); 

const {
    validarJWT, 
    isAdminRole, 
    haveRole, 
    validateUser
} = require("../middlewares")

const router = Router();
//rutas
router.get('/', getUsuarios);

router.post('/',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe ser mayor a 6 letras').isLength({ min:6}),
    check('email', 'El correo es obligatorio').isEmail(),
    check('email').custom(existEmail),
    //check('role','No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isRoleValidate),
    validateUser
],postUsuarios);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existId),
    check('role').custom(isRoleValidate),
    validateUser
], putUsuarios);

router.delete('/:id',[
    validarJWT,
    //isAdminRole,
    haveRole('ADMIN_ROLE','SELLER_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existId),
    validateUser
], deleteUsuarios);

router.patch('/', patchUsuarios);

module.exports = router;
const {Router} = require("express"); 
const { check } = require("express-validator");
const { validateUser, validarJWT } = require("../middlewares/");
const {renewToken} = require('../controllers/auth');
const { 
    login, 
    googleSignIn 
} = require("../controllers/auth");
const router = Router();

router.post('/login',[ 
    check('email','El correo es obligatorio.').normalizeEmail().isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validateUser
], login);

router.post('/google',[ 
    check('id_token','El id_token es necesario').not().isEmpty(),
    validateUser
], googleSignIn);

router.get('/', validarJWT, renewToken);

module.exports = router;
const valJWT  = require("../middlewares/validar-jwt");
const valROLE = require("../middlewares/validar-roles");
const valUSER = require("../middlewares/validate");
const valFILE = require("../middlewares/validate-file");
module.exports = {
    ...valJWT,
    ...valROLE,
    ...valUSER,
    ...valFILE
}
const dbValidators = require("./db-validators");
const generarJWT = require("./general-jwt");
const googleVerify = require("./google-verify");
const subirArchivo = require("./subir-archivo");


module.exports ={
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}
const { Router } = require("express");
const {check} = require("express-validator");

const { validarCampo } = require("../middlewares/validar-campos");
const { cargarArchivos, 
        actualizarImagen, 
        mostrarImagen, 
        actualizarImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");
const { validarArchivoSubir } = require("../middlewares");


const router = Router();


router.post("/",[
    validarArchivoSubir,
],cargarArchivos);

//*Nota: En la routa put tambien se puede usar la referencia "actualizarImagen" que guarda la imagen de manera local
router.put("/:coleccion/:id",[
    validarArchivoSubir,
    check("id","El id debe ser de mongoDB").isMongoId(),
    check("coleccion").custom(c =>coleccionesPermitidas(c,["usuarios","productos"])),
    validarCampo,
],actualizarImagenCloudinary)

router.get("/:coleccion/:id",[
    check("id","El id debe ser de mongoDB").isMongoId(),
    check("coleccion").custom(c =>coleccionesPermitidas(c,["usuarios","productos"])),
    validarCampo,
],mostrarImagen)

module.exports=router;
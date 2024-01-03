const { Router } = require("express");
const {check} = require("express-validator");

const { crearProducto, 
        obtenerProductos, 
        obtenerPorducto, 
        actualizarProducto, 
        borrarProducto} = require("../controllers/productos");

const { validarJWT, validarCampo, esAdminRole } = require("../middlewares");
const { existeProductoPorId } = require("../helpers/db-validators");

const router = Router();

//*Obtener todas las producto - Publico
router.get("/",obtenerProductos);

//*Obtener una producto por id - Publico
router.get("/:id",[
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampo
],obtenerPorducto);

//*Crear producto - privado - cualquier persona con un token valido
router.post("/",[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "La categoria es obligatorio").not().isEmpty(),
    check("precio", "Precio debe ser un numero").isNumeric(),
    validarCampo
],crearProducto);

//*Actualizar - privado - cualquier persona con un token valido
router.put("/:id",[
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampo
],actualizarProducto);

//*Borrar una producto - privado - Admin
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampo,
],borrarProducto);


module.exports = router
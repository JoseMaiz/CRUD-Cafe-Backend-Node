const { Router } = require("express");
const {check} = require("express-validator");

const { validarJWT, validarCampo, esAdminRole } = require("../middlewares");

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require("../controllers/categorias");

const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

//*Obtener todas las categorias - Publico
router.get("/", obtenerCategorias);

//*Obtener una categorias por id - Publico
router.get("/:id",[
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampo,
], obtenerCategoria);

//*Crear categoria - privado - cualquier persona con un token valido
router.post("/",[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampo
], crearCategoria);

//*Actualizar - privado - cualquier persona con un token valido
router.put("/:id",[
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampo,
], actualizarCategoria);

//*Borrar una categoria - privado - Admin
router.delete("/:id", [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoria),
    validarCampo,
],borrarCategoria);

module.exports=router;
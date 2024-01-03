const { Router } = require("express");
const {check} = require("express-validator");


const {
    validarCampo,
    validarJWT,
    esAdminRole,
    tieneRole } = require("../middlewares")//*Se esta importando todo desde el index de la carpeta middleware

const { esRolValido, emailExiste, existeUsuarioPorId } = require("../helpers/db-validators");

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require("../controllers/usuarios");





const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
    validarCampo,
],usuariosPut);

router.post('/', [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La clave debe de ser mas de 6 letras").isLength({min: 6}),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE","USER_ROLE"]),//*Referencia de un validacion del ROL
    check("rol").custom(esRolValido),
    validarCampo,
] ,usuariosPost);

router.delete('/:id',[
    validarJWT,
    // esAdminRole, //*Middleware que verifica que tengas el rol de admin
    tieneRole("ADMIN_ROLE","VENTAS_ROLE","OTRO_ROLE"),//*Middleware mas flexible que verifica que sea el admin role o otro que se ponga
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampo,
], usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;
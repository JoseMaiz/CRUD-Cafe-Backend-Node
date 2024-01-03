const { Router } = require("express");
const {check} = require("express-validator");

const { validarCampo } = require("../middlewares/validar-campos");

const { login, googleSignIn } = require("../controllers/auth");

const router = Router();

router.post('/login',[
    check("correo","El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampo
] ,login);

router.post('/google',[
    check("id_token","El id_token es necescario").not().isEmpty(),
    validarCampo
] ,googleSignIn);


module.exports=router;
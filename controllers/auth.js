const {response,request, json} = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/general-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req = request, res = response) =>{
    const {correo, password} = req.body;

    try {

        //*Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - correo"
            })
        }

        //*Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - estado:false"
            })
        }
        
        //*Verificar la contraseña
        const valiedPassword = bcryptjs.compareSync(password, usuario.password);
        if (!valiedPassword) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - password"
            })
        }

        //*General el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador algo salio mal"
        });
    }
}


const googleSignIn = async (req = request,res = response) =>{
    const {id_token} = req.body;

    try {

        const {correo,nombre,img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            //*Se tiene que crear el usuario

            const data = {
                nombre,
                correo,
                password: ":p",
                img,
                rol:"USER_ROLE",
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        //* El usuario en DB

        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Hable con el administrador, usuario bloqueado"
            })
        }

        
        //*General el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg: "El token no se pudo verificar"
        })
    }

}

module.exports={
    login,
    googleSignIn
}
const {response, request} = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");


const usuariosGet =async (req=request, res=response) => {
    
    // const {q, nombre = "Not name",apikey, page = 1, limit} = req.query; //*Referencia de como desestruturar lo que venga en el query
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true}

    //*Referencia de como se hace por separado con el inconveniente le da mas lentitud a la respuesta
    // const usuarios = await Usuario.find(query)
    //     .skip(parseInt(desde))
    //     .limit(parseInt(limite));

    // const total = await Usuario.countDocuments(query);

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(parseInt(desde))
            .limit(parseInt(limite)),

    ])//*Esto para ejecutar las promesas en conjunto y no generar retraso

    res.json({
        total,
        usuarios,
    });
};

const usuariosPut = async (req = request, res = response) => {
    
    const {id} = req.params;
    const {_id ,password, google,correo, ... resto} = req.body;

    //TODO validar contra base de datos

    if (password) {
         //*Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();//*Genera los saltos para lograr desencriptar
        resto.password = bcryptjs.hashSync(password, salt);//*Genera el encriptamiento
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto,{new:true});

    res.json(usuario);
};

const usuariosPost = async (req = request, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});


    //*Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();//*Genera los saltos para lograr desencriptar
    usuario.password = bcryptjs.hashSync(password, salt);//*Genera el encriptamiento

    //*Guardar en la base de datos

    await usuario.save();

    res.json({
        usuario,
    })
};
const usuariosDelete =async (req = request, res = response) => {

    const {id} = req.params;

    const usuarioAutenticado = req.usuario;

    //*Fisicamente borrado (No es tan recomendable hacerlo asi para no perder la informacion)(Queda de referencia)
    // const usuario = await Usuario.findByIdAndDelete(id);
    
    //*Borrado cambiando el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    res.json({usuario,usuarioAutenticado});
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: "patch API - controlador"
    })
}
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
}
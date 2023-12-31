

const {Schema, model} = require("mongoose");

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    correo: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatorio"],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ["ADMIN_ROLE","USER_ROLE"]
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
})

UsuarioSchema.methods.toJSON = function(){
    const {_id,__v, password, ...usuario} =this.toObject();
    const usuario2 = {
        "uid":_id,
        ...usuario
    }
    return usuario2
}

module.exports = model( "Usuario",UsuarioSchema );
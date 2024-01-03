const { Categoria, Producto } = require("../models");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

//*Verificacion de que rol este dentro de los roles establecidos
const esRolValido = async (rol = "") =>{
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la DB`)
    }
};

//*Verificacion de correo
const emailExiste = async (correo = "") =>{
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya esta registrado`);
    }
};

//*Verificar que el Id existe (Usuario)
const existeUsuarioPorId = async (id = "") =>{
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
};

//*Verificar que el Id existe (Categoria)
const existeCategoria = async (id = "") =>{
    const existeId = await Categoria.findById(id);
    if (!existeId) {
        throw new Error(`El id no existe ${id}`);
    }
};

//*Verificar que el Id existe (Producto)
const existeProductoPorId = async (id = "") =>{
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id no existe ${id}`);
    }
};

//*Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = "", colecciones = [])=>{

    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida. Colecciones permitidas: ${colecciones}`)
    }

    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProductoPorId,
    coleccionesPermitidas,
}


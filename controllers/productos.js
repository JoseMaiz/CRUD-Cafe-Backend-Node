const { response, request } = require("express");
const { Producto, Categoria } = require("../models");

//Obtener productos
const obtenerProductos = async (req = request, res = response) =>{
    const {limite, desde} = req.query;
    const query = {estado: true};
    
    const [total, producto] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(parseInt(desde))
            .limit(parseInt(limite))
            .populate("usuario", "nombre")
            .populate("categoria","nombre"),
    ])

    res.json({
        total,
        producto,
    })

};

//Obtener producto por id

const obtenerPorducto = async (req = request, res = response) =>{

    const {id} = req.params;

    const producto = await Producto.findById(id)
                                   .populate("usuario", "nombre")
                                   .populate("categoria","nombre");

    res.json(producto);
}

//Crear nurvo producto
const crearProducto = async (req = request, res = response) =>{
    const {nombre, precio, categoria, descripcion, estado } = req.body;
    
    //*Verificar si ya el nombre existe
    nombre.toUpperCase()
    const productoDB = await Producto.findOne({nombre});
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    //*Verificar si existe esta categoria
    categoria.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre:categoria});
    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoria}, no existe`
        })
    }

    //* General la data a guardar
    const data ={
        nombre,
        usuario: req.usuario._id,
        precio,
        categoria: categoriaDB._id,
        descripcion,
    }

    const producto = new Producto(data);

    //* Guardar DB
    await producto.save();

    res.status(201).json(producto);

};

//Actualizar productos

const actualizarProducto = async (req = request, res = response) =>{
    const {id} = req.params;
    const {_id, estado, usuario, categoria, ...data} = req.body;

    //*Verificar si el nombre de la data se va actualizar
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
        //*Verificar si el producto ya existe
        const nombre = data.nombre;
        const productoDB = await Producto.findOne({nombre});
        if (productoDB) {
            return res.status(400).json({
                msg: `El nombre ${productoDB.nombre}, ya existe`
            })
        };
    }

    //*Verificar si la categoria se mando para modificarlo
    if (categoria) {
        //*Verificar si existe esta categoria
        categoria.toUpperCase();
        const categoriaDB = await Categoria.findOne({nombre:categoria});
        if (!categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${categoria}, no existe`
            })
        };
        data.categoria = categoriaDB._id;
    }
    data.usuario = req.usuario._id;

    //*Actualización de la categoria
    const producto = await Producto.findByIdAndUpdate(id, data,{new:true})
                                   .populate("usuario", "nombre")
                                   .populate("categoria", "nombre");

    res.json(producto);
};

const borrarProducto = async (req = request, res = response) =>{
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false, disponible: false}, {new:true})
                                    .populate("usuario", "nombre")
                                    .populate("categoria","nombre");

    res.json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerPorducto,
    actualizarProducto,
    borrarProducto
}
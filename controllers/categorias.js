const { response, request, json } = require("express");
const {Categoria} = require("../models");

// Obtener categorias - (paginado -total ) metodo populate
const obtenerCategorias =async (req = request, res = response)=>{
    const {limite, desde} = req.query;
    const query = {estado: true};
    
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(parseInt(desde))
            .limit(parseInt(limite))
            .populate("usuario", "nombre"),
    ])

    res.json({
        total,
        categorias
    })
}

// ObtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) =>{
    const {id} = req.params;
    
    const categorias = await Categoria.findById(id).populate("usuario", "nombre");

    res.json(categorias);
}

//Crear categoria
const crearCategoria = async (req=request, res = response)=>{
    
    const nombre = req.body.nombre.toUpperCase();

    //*Verificar si ya el nombre existe
    const categoriaDB = await Categoria.findOne({nombre});
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //* General la data a guardar
    const data ={
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //* Guardar DB
    await categoria.save();

    res.status(201).json(categoria);
}

//Actualizar categorias

const actualizarCategoria = async (req = request, res = response)=>{
    
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();

    //*Verificar si la categoria ya existe
    const categoriaDB = await Categoria.findOne({nombre});
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //*Data que se va actualizar
    const data ={
        nombre,
        usuario: req.usuario._id
    }

    //*Actualización de la categoria
    const categoria = await Categoria.findByIdAndUpdate(id, data,{new:true}).populate("usuario", "nombre");

    res.json(categoria);
}

//Borrar categorias - estado:false

const borrarCategoria = async (req = request, res = response)=>{
    const {id} = req.params;
    
    const categoria = await Categoria.findByIdAndUpdate(id,{estado: false}, {new:true})
                                     .populate("usuario", "nombre");

    res.json(categoria);
}
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
}
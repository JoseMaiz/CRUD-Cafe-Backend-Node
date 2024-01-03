const path = require("path");
const fs = require("fs");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require("../models");

//*Crea una nueva imagen para almacenarla
const cargarArchivos = async (req=request, res = response) =>{

    try {

        // const nombre = await subirArchivo(req.files,["txt","md","pdf"],"PDF"); //*Referencia como se hace con otros formatos
        const nombre = await subirArchivo(req.files,undefined,"imgs");
        res.json({nombre})
        
    } catch (msg) {
        res.status(400).json({msg})
    }
    

    
}

//*Actualiza la imagen que se relaciona con el elemento de la DB
const actualizarImagen = async (req =request,res=response) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                });
            }
            
        break;

        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

        break;
    
        default:
            return res.status(500).json({msg:"Se me olvido validar esto"})
    }

    //*Limpieza de imagenes previa

    if (modelo.img) {
        //* Se tiene que borrar la imagen del servidor
        const pathImagen = path.join(__dirname,"../uploads",coleccion,modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }

    const nombre = await subirArchivo(req.files,undefined,coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);

}

//*Actualiza la imagen que se relaciona con el elemento de la DB haciendo uso de Cloudinary
const actualizarImagenCloudinary = async (req =request,res=response) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                });
            }
            
        break;

        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

        break;
    
        default:
            return res.status(500).json({msg:"Se me olvido validar esto"})
    }

    //*Limpieza de imagenes previa

    if (modelo.img) {
        //* Se tiene que borrar la imagen del servidor
        const nombreArr = modelo.img.split("/");
        const nombre = nombreArr[nombreArr.length -1]
        const [public_id] = nombre.split(".");
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);

}

//*EndPoint para poder mostrar la imagen que tenga cada elemento
const mostrarImagen = async (req = request, res = response)=>{
    
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case "usuarios":
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                });
            }
            
        break;

        case "productos":
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

        break;
    
        default:
            return res.status(500).json({msg:"Se me olvido validar esto"})
    }

    //*Limpieza de imagenes previa

    if (modelo.img) {
        //* Se tiene que borrar la imagen del servidor
        const pathImagen = path.join(__dirname,"../uploads",coleccion,modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }

    const pathImgNoFound = path.join(__dirname, "../assets/no-image.jpg")
    res.sendFile(pathImgNoFound);

}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
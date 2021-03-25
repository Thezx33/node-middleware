const { request,response } = require('express');

const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async ( req = request, res = response ) => {

    // const { query, nombre, apikey, page='1', limit } = req.query; // Obtener parámetros de query ( consulta )

    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find( query )
    //     .skip( Number( desde ) )
    //     .limit( Number( limit ) );

    // const total = await Usuario.countDocuments( query );

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number( desde ) )
            .limit( Number( limit ) )
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async ( req = request, res = response ) => {
    

    // Obtener datos de una petición
    // const { nombre, edad } = req.body;
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save(); // Guardar en la base de datos.

    res.json({
        msg: 'post API - controller',
        usuario
    });
}

const usuariosPut = async ( req = request, res = response ) => {
    
    const { id } = req.params; // Recibir el parámetro

    const { _id, password, google, correo, ...resto } = req.body;

    // Validar contra base de datos
    if( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    
    res.json( usuario );
}

const usuariosPatch = ( req, res = response ) => {
    res.json({
        msg: 'patch API - controller'
    });
}

const usuariosDelete = async ( req = request, res = response ) => {

    const { id } = req.params;

    // const uid = req.uid;

    // Borrar físicamente
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });
    const usuarioAutenticado = req.usuario; 

    res.json({
        usuario,
        usuarioAutenticado
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};
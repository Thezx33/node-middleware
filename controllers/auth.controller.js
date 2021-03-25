const { response, request } = require('express');
const bcrypjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


const login = async ( req = request, res = response ) => {

    const { correo, password } = req.body;

    try {
        
        // Verificar si el email exite

        const usuario = await  Usuario.findOne({ correo });

        if( !usuario ) {
            return res.status(400).json({
                msg: 'El Usuario / Password no son correctos - correo'
            })
        }

        // Si el usuario está activo
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'El Usuario / Password no son correctos - estado: false'
            })
        }

        // Verificar la contraseña
        const validPassword = bcrypjs.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                msg: 'El Usuario / Password no son correctos - password'
            })
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {

        console.log( error );

        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }


}

module.exports = {
    login
}
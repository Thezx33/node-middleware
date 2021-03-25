const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch } = require('../controllers/usuarios.controller');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();


router.get( '/', usuariosGet );

router.put( '/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut ); // Enviar un parámetro

router.post( '/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de más de 6 letras').isLength( { min: 6} ),
    check('rol').custom( esRoleValido ),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    validarCampos
], usuariosPost );

router.patch( '/', usuariosPatch );

router.delete( '/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete );


module.exports = router;
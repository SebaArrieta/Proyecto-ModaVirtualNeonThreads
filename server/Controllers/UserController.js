const db = require('../Database/index');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Encrypt = {

    cryptPassword: (password) =>
        bcrypt.genSalt(10)
        .then((salt => bcrypt.hash(password, salt)))
        .then(hash => hash),
    
        comparePassword: (password, hashPassword) =>
            bcrypt.compare(password, hashPassword)
            .then(resp => resp)
    }

exports.SignUp = async (req, res) => {
    console.log(req.body)
    const pass = await bcrypt.hash(req.body["Contraseña"], 10);

    const query = `INSERT INTO Usuarios (Nombre, Apellido, Correo, Contraseña, Direccion, Tipo,Zip, Ciudad) VALUES (
        '${req.body.Nombre}',
        '${req.body.Apellido}',
        '${req.body.Email}',
        '${pass}',
        '${req.body.Direccion}',
        0,
        '${req.body.Zip}',
        '${req.body.Ciudad}'
    );`;

    db.query(query, async (err, results) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        res.json(results)
      });
};

exports.Login = async (req, res) => {

    const query = `SELECT * FROM Usuarios WHERE Correo = "${req.body.Correo}"`;
    db.query(query, async (err, results) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        if (results.length == 0) {
            return res.status(401).json({ Correo: 'Correo no encontrado' });
        }

        user = results[0]

        const passwordMatch = await bcrypt.compare(req.body['Contraseña'], user.Contraseña);

        if (!passwordMatch) {
            return res.status(401).json({ Contraseña: 'Contraseña incorrecta' });
        }

        try {
            console.log(user)
            const token = jwt.sign({ userId: user.id }, 'secret', {
                expiresIn: '72h',
            });
            res.status(200).json({ token });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Login failed' });
        }
    });
}
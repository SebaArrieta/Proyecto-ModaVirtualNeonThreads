const db = require('../Database/index');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { object, string, date } = require('yup');

let FormSchema = object({
    Nombre: string().required("Nombre es obligatorio"),
    Apellido: string().required("Apellido es obligatorio"),
    Correo: string().email("Email no es válido").required("Email es obligatorio"),
    Contraseña: string()
        .min(5, "La contraseña debe contener al menos 5 caracteres")
        .required("Contraseña es obligatoria")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/,
            "La contraseña debe tener al menos una letra mayúscula, una minúscula y un número"
        ),
    Direccion: string().required("Dirección es obligatoria"),
    Ciudad: string().required("Ciudad es obligatoria"),
    Zip: string().required("Código postal es obligatorio"),
    createdOn: date().default(() => new Date()),
});

exports.SignUp = async (req, res) => {
    const pass = await bcrypt.hash(req.body["Contraseña"], 10);

    console.log(req.body)
    const mailDomain = req.body.Correo.match(/(?<=@)[\w.-]+/);

    let tipo = mailDomain == "neon.com" ? 1 : 0;  

    const query = `INSERT INTO Usuarios (Nombre, Apellido, Correo, Contraseña, Direccion, Tipo,Zip, Ciudad) VALUES (
        '${req.body.Nombre}',
        '${req.body.Apellido}',
        '${req.body.Correo}',
        '${pass}',
        '${req.body.Direccion}',
        ${tipo},
        '${req.body.Zip}',
        '${req.body.Ciudad}'
    );`;

    const queryCorreo = `SELECT * FROM Usuarios WHERE Correo = "${req.body.Correo}"`;

    try {
        await FormSchema.validate(req.body, { abortEarly: false });

        db.query(queryCorreo, async(err, results) => {
            if (err) {
              console.error('Error en la consulta:', err);
              return res.status(500).json({ error: 'Error en la consulta' });
            }
    
            if (results.length > 0) {
                return res.status(401).json({ Correo: 'Correo ya existe' });
            }
    
            db.query(query, async (err, results) => {
                if (err) {
                  console.error('Error en la consulta:', err);
                  return res.status(500).json({ error: 'Error en la consulta' });
                }
        
                res.json(results)
            });
        });
    } catch (validationErrors) {
        const formattedErrors = validationErrors.inner.reduce((acc, error) => {
            acc[error.path] = error.message; 
            return acc;
        }, {});

        return res.status(401).json(formattedErrors);
    }
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
            res.status(200).json({ token: token, tipo: user.Tipo });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Login failed' });
        }
    });
}
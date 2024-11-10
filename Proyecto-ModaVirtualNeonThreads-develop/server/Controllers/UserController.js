const db = require('../Database/index');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { object, string, date } = require('yup');

let UserSchema = object({
    Nombre: string().required("Nombre es obligatorio"),
    Apellido: string().required("Apellido es obligatorio"),
    Correo: string().email("Email no es válido").required("Email obligatorio"),
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

const CardSchema = object({
    Nombre_Titular: string().required('El nombre del titular es obligatorio')
        .max(100, 'El nombre del titular no puede exceder los 100 caracteres'),
    Numero_Tarjeta: string().required('El número de tarjeta es obligatorio')
        .matches(/^[0-9]{16}$/, 'El número de tarjeta debe tener 16 dígitos'),
    CVV: string().required('El CVV es obligatorio')
        .matches(/^[0-9]{3,4}$/, 'El CVV debe tener 3 o 4 dígitos'),
    Fecha_Vencimiento: string().required('La fecha de vencimiento es obligatoria')
        .matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, 'La fecha de vencimiento debe estar en formato MM/AAAA o MM/AA'),
});

exports.SignUp = async (req, res) => {
    const pass = await bcrypt.hash(req.body["Contraseña"], 10);

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
        await UserSchema.validate(req.body, { abortEarly: false });

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
            const token = jwt.sign({ userId: user.id, tipo: user.Tipo }, 'secret', {
                expiresIn: '72h',
            });
            res.status(200).json({ token: token, tipo: user.Tipo });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Login failed' });
        }
    });
}

exports.getUser = async (req, res) => {
    const query = `SELECT * FROM Usuarios WHERE id = "${req.userId}"`;

    db.query(query, async (err, results) => {
        if (err) {
          console.log('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.status(200).json(results)
    });
}

exports.DeleteUser = async (req, res) => {
    console.log(req.userId)
    const query = `DELETE FROM Usuarios WHERE id = "${req.userId}"`;

    db.query(query, async (err, results) => {
        if (err) {
          console.log('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.status(200).json(results)
    });
}

exports.getPaymentMethodUser = async (req, res) => {
    const query = `SELECT id, Nombre_Titular, RIGHT(Numero_Tarjeta, 4) AS Numero_Tarjeta  FROM Datos_Bancarios WHERE Datos_Bancarios_Usuarios_FK = "${req.userId}"`;

    db.query(query, async (err, results) => {
        if (err) {
          console.log('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.status(200).json(results)
    });
}

exports.DeletePaymentMethodUser = async (req, res) => {
    const query = `DELETE FROM Datos_Bancarios WHERE id = "${req.body.id}"`;

    db.query(query, async (err, results) => {
        if (err) {
          console.log('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.status(200).json(results)
    });
}

exports.PostPaymentMethodUser = async (req, res) => {
    try {
        await CardSchema.validate(req.body, { abortEarly: false });

        const query = `INSERT INTO Datos_Bancarios (Nombre_Titular, Numero_Tarjeta, CVV, Fecha_Vencimiento, Datos_Bancarios_Usuarios_FK) VALUES (
            '${req.body.Nombre_Titular}',
            '${req.body.Numero_Tarjeta}',
            '${req.body.CVV}',
            '${req.body.Fecha_Vencimiento}',
            ${req.userId});`;

        db.query(query, async (err, results) => {
            if (err) {
                console.log('Error en la consulta:', err);
                return res.status(500).json({ error: 'Error en la consulta' });
            }

            return res.status(200).json(results);
        });
    } catch (validationErrors) {
        const formattedErrors = validationErrors.inner.reduce((acc, error) => {
            acc[error.path] = error.message; 
            return acc;
        }, {});

        console.log(validationErrors)
        return res.status(401).json(formattedErrors);
    }
}
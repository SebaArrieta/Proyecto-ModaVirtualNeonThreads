const db = require('../Database/index');

exports.Prueba = async (req, res) => {
    console.log("HOLA")
};

exports.AddCart = async (req, res) => {
    data = req.body

    const query = `INSERT INTO Carrito (Carrito_Stock_FK, Carrito_Usuarios_FK, Cantidad) VALUES (
        ${data["StockID"]},
        ${req.userId},
        ${data["Cantidad"]}
    );`;

    db.query(query, async (err, results) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.json(results)
    });
}
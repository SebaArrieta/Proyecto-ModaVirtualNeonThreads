const db = require('../Database/index');

//Añadir un elemento al carrito
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

//Obtener los productos de la tabla Carrito asosiados a un id de usuario
exports.GetCart = async (req, res) => {
    const query = `SELECT c.id AS CarritoID, p.id AS ProductoID, p.Nombre, p.Precio, p.Color, s.tamaño, s.Stock, c.Cantidad
                   FROM Productos p
                   JOIN Stock s ON p.id = s.Stock_Productos_FK
                   JOIN Carrito c ON c.Carrito_Stock_FK = s.id
                   WHERE c.Carrito_Usuarios_FK = ${req.userId};`;
    
    db.query(query, async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.json(results)
    });
}

//Aumentar o dirminuir la cantidad de un elemento del carrito
exports.ModifyQuantity = async (req, res) => {
    const data = req.body

    const query = `UPDATE Carrito
                   SET Cantidad = ${data.Cantidad}
                   WHERE id = ${data.CarritoID};`;
    
    db.query(query, async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.json(results)
    });
}

//Eliminar un elemento del carrito
exports.DeleteCart = async (req, res) => {
    const data = req.body

    const query = `DELETE FROM Carrito
                   WHERE id = ${data.CarritoID};`;
    
    db.query(query, async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.json(results)
    });
}
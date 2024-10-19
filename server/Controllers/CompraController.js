const db = require('../Database/index');

exports.AddCart = async (req, res) => {
    const data = req.body;

    const checkQuery = `
        SELECT Cantidad 
        FROM Carrito 
        WHERE Carrito_Stock_FK = ? AND Carrito_Usuarios_FK = ?`;

    db.query(checkQuery, [data["StockID"], req.userId], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }

        if (results.length > 0) {
            const existingQuantity = results[0].Cantidad;

            const updateQuery = `
                UPDATE Carrito 
                SET Cantidad = Cantidad + ? 
                WHERE Carrito_Stock_FK = ? AND Carrito_Usuarios_FK = ?`;

            db.query(updateQuery, [data["Cantidad"], data["StockID"], req.userId], (err, results) => {
                if (err) {
                    console.error('Error al actualizar el carrito:', err);
                    return res.status(500).json({ error: 'Error al actualizar el carrito' });
                }
                return res.json({ message: 'Cantidad actualizada con éxito' });
            });
        } else {
            // Si no existe, realiza la inserción
            const insertQuery = `
                INSERT INTO Carrito (Carrito_Stock_FK, Carrito_Usuarios_FK, Cantidad) VALUES (?, ?, ?)`;

            db.query(insertQuery, [data["StockID"], req.userId, data["Cantidad"]], (err, results) => {
                if (err) {
                    console.error('Error al insertar en el carrito:', err);
                    return res.status(500).json({ error: 'Error al insertar en el carrito' });
                }
                return res.json({ message: 'Producto añadido al carrito' });
            });
        }
    });
};

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

exports.MakeCompra = async (req, res) => {
    const queryStock = `SELECT p.Nombre
                   FROM Productos p
                   JOIN Stock s ON p.id = s.Stock_Productos_FK
                   JOIN Carrito c ON c.Carrito_Stock_FK = s.id
                   WHERE s.Stock < c.Cantidad and c.Carrito_Usuarios_FK = ${req.userId};`;

    const queryCompra = `INSERT INTO Compras (Compras_Usuarios_FK, Compras_Stock_FK, Cantidad)
                         SELECT c.Carrito_Usuarios_FK, c.Carrito_Stock_FK, c.Cantidad
                         FROM Carrito c
                         WHERE c.Carrito_Usuarios_FK = ${req.userId};`;

    db.query(queryStock, async (err, results) => {
        if (err) {
          console.log('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        if (results.length > 0){
            console.log(results)
            return res.status(400).json({ error: `Los siguientes productos ${results.join(" ")} no poseen el stock suficiente` });
        }

        db.query(queryCompra, async (err, results) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return res.status(500).json({ error: 'Error en la consulta' });
            }
    
            return res.status(200).json(results)
        });
    });
};
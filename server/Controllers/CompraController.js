const db = require('../Database/index');

exports.AddCart = async (req, res) => {
    const data = req.body;

    if(data["Cantidad"] <= 0){
        return res.status(500).json({ error: 'Cantidad del producto es 0' });
    }

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
                return res.status(200).json({ message: 'Cantidad actualizada con éxito', results: results});
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
                return res.status(200).json({ message: 'Producto añadido al carrito', results: results });
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

        console.log(results)
        return res.json(results)
    });
}

//genera un codigo de compra y verifica que este sea unico
const generateUniqueCodigoCompra = async () => {
    const generateCodigo = () => {
        return Math.random().toString(36).substr(2, 10);  //Genera un string random de largo 10
    };

    let isUnique = false;
    let newCodigoCompra;

    while (!isUnique) {
        newCodigoCompra = generateCodigo();

        const checkCodigoQuery = `SELECT 1 FROM Compras WHERE Codigo_Compra = '${newCodigoCompra}';`;

        await new Promise((resolve, reject) => { // comprueba que el string generado sea unico
            db.query(checkCodigoQuery, (err, results) => {
                if (err) {
                    console.error('Error checking Codigo_Compra:', err);
                    return reject(err);
                }

                if (results.length === 0) {
                    isUnique = true;
                }

                resolve();
            });
        });
    }

    return newCodigoCompra;
};

exports.MakeCompra = async (req, res) => {
    const queryStock = `
        SELECT p.Nombre
        FROM Productos p
        JOIN Stock s ON p.id = s.Stock_Productos_FK
        JOIN Carrito c ON c.Carrito_Stock_FK = s.id
        WHERE s.Stock < c.Cantidad AND c.Carrito_Usuarios_FK = ${req.userId};
    `;

    db.query(queryStock, async (err, results) => { // query para verificar el stock antes de la compra
        if (err) {
            console.error('Error in stock query:', err);
            return res.status(500).json({ error: 'Error in stock query' });
        }

        if (results.length > 0) {// error de productos sin stock
            const productNames = results.map(result => result.Nombre).join(', ');
            return res.status(400).json({ error: `Los siguientes productos no tienen suficiente stock: ${productNames}` });
        }

        // Generar Codigo_Compra unico
        try {
            const uniqueCodigo = await generateUniqueCodigoCompra();

            // Procedimiento que añade los articulos a la tabla compras y elimina stock de la tabla de Stock
            const queryCompra = `CALL RealizarCompra(${req.userId}, "${uniqueCodigo}");`;

            db.query(queryCompra, (err, results) => {
                if (err) {
                    console.error('Error en la compra', err);
                    return res.status(500).json({ error: 'Error en la compra' });
                }

                return res.status(200).json({results: results, Codigo_Compra: uniqueCodigo});
            });
        } catch (err) {
            console.error('Error generando Codigo de Compra:', err);
            return res.status(500).json({ error: 'Error generando Codigo de Compra' });
        }
    });
};

exports.GetCompra = async (req, res) => {
    const query = `SELECT c.id AS CarritoID, p.id AS ProductoID, p.Nombre, p.Precio, p.Color, s.tamaño, s.Stock, c.Cantidad
                   FROM Productos p
                   JOIN Stock s ON p.id = s.Stock_Productos_FK
                   JOIN Compras c ON c.Compras_Stock_FK = s.id
                   WHERE c.Codigo_Compra = "${req.query.Codigo}";`;
    
    db.query(query, async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.json(results)
    });
}
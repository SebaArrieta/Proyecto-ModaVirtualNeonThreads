const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const db = require('../Database/index');

const client_s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

const GetImg = async (object) => {
    const input_s3 = {
        Bucket: "inf331-proyecto",
        Key: object["Imagen"],
    };

    const command_s3 = new GetObjectCommand(input_s3);
    const response_s3 = await client_s3.send(command_s3);

    return new Promise((resolve, reject) => {
        const chunks = [];

        response_s3.Body.on('data', (chunk) => {
            chunks.push(chunk);
        });

        response_s3.Body.on('end', () => {
            try {
                const buffer = Buffer.concat(chunks);
                const base64Image = buffer.toString('base64');
                object["Imagen"] = base64Image;  // Modify the object here
                resolve(object);  // Resolve the promise after modification
            } catch (error) {
                reject(error);  // Handle any errors during processing
            }
        });

        response_s3.Body.on('error', (err) => {
            reject(err);  // Handle stream errors
        });
    });
}

exports.GetProducts = async (req, res) => {
    const query = `SELECT p.id, p.Nombre, p.Precio, p.Descripcion, p.Imagen, p.Categoria, p.Color, s.tamaño, s.Stock
                   FROM Productos p
                   JOIN Stock s ON p.id = s.Stock_Productos_FK
                   WHERE s.Stock > 0
                   GROUP BY p.id, p.Nombre, p.Precio, p.Descripcion, p.Imagen, p.Categoria, p.Color;`;

    db.query(query, async (err, results) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        for(let i = 0; i < results.length; i++){
            await GetImg(results[i])
        }

        res.json(results)
    });
};

exports.GetStock = async (req, res) => {
    data = req.query

    const query = `SELECT * FROM Stock WHERE Stock_Productos_FK = ${data.ProductosId}`;

    db.query(query, async (err, results) => {
        if (err) {
          console.log('Error en la consulta:', err);
          return res.status(500).json({ error: 'Error en la consulta' });
        }

        return res.status(200).json(results)
    });
};
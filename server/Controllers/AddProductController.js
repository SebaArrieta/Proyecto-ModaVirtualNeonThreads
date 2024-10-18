const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const db = require('../Database/index');
const { v4: uuidv4 } = require('uuid'); // To generate unique filenames for S3

const client_s3 = new S3Client({ region: "sa-east-1" });

// Function to upload an image to S3
const UploadImg = async (fileName, imageBuffer) => {
    const input_s3 = {
        Bucket: "inf331-proyecto",
        Key: fileName,
        Body: imageBuffer,
        ContentType: "image/jpeg" // or the appropriate MIME type of the image
    };

    const command_s3 = new PutObjectCommand(input_s3);
    const response_s3 = await client_s3.send(command_s3);
    return response_s3;
}

// Controller to add a new product
exports.AddProduct = async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio } = req.body;
        const { Imagen } = req.files; // Assuming you're using middleware like multer for file uploads

        // Generate a unique name for the image to store in S3
        const uniqueFileName = `${uuidv4()}.jpg`;

        // Upload the image to S3
        await UploadImg(uniqueFileName, Imagen.data);

        // Store the product info in the database, including the S3 key for the image
        const query = 'INSERT INTO Productos (Nombre, Descripcion, Precio, Imagen) VALUES (?, ?, ?, ?)';
        const values = [Nombre, Descripcion, Precio, uniqueFileName];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return res.status(500).json({ error: 'Error al agregar el producto' });
            }

            res.status(201).json({ message: 'Producto agregado con éxito' });
        });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

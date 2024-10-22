const multer = require('multer');
const upload = multer(); // Use memory storage to handle the uploaded files in memory

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const db = require('../Database/index');
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const queryPromise = promisify(db.query).bind(db);

const client_s3 = new S3Client({ region: "sa-east-1" });

const UploadImg = async (fileName, imageBuffer) => {
    const input_s3 = {
        Bucket: "inf331-proyecto",
        Key: fileName,
        Body: imageBuffer,
        ContentType: "image/jpeg",
    };

    const command_s3 = new PutObjectCommand(input_s3);
    const response_s3 = await client_s3.send(command_s3);
    return response_s3;
}

exports.AddProduct = [
    
    upload.single('Imagen'), // Multer middleware to handle image upload
    
    async (req, res) => {
        try {
            // Get form data from request body
            const { Nombre, Descripcion, Precio, Categoria, Color } = req.body;
            const { buffer } = req.file; // Image file is now available in req.file
            console.log("hola");
            if (!Nombre || !Descripcion || !Precio || !buffer || !Categoria || !Color) {
                return res.status(400).json({ error: 'Missing product data or image' });
            }
            console.log("hola2");
            // Generate a unique filename for the image
            const uniqueFileName = `${uuidv4()}.jpg`;
            console.log("hola3");
            // Upload the image to S3
            await UploadImg(uniqueFileName, buffer);
            console.log("hola4");
            // Insert product details into the database
            const query = 'INSERT INTO Productos (Nombre, Descripcion, Precio, Imagen, Categoria, Color) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [Nombre, Descripcion, Precio, uniqueFileName, Categoria, Color];

            await queryPromise(query, values);

            // Respond with success message
            res.status(201).json({ message: 'Producto agregado con éxito' });
        } catch (error) {
            console.error('Error adding the product:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
];

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const db = require('../Database/index');

const client_s3 = new S3Client({ region: "sa-east-1" });
const client_db = new DynamoDBClient({ region: "sa-east-1" });

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
    const query = 'SELECT * FROM Productos';

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

exports.GetProduct = async (req, res) => {

};
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const client_s3 = new S3Client({ region: "sa-east-1" });
const client_db = new DynamoDBClient({ region: "sa-east-1" });


const dbItemToObject = (Item) => {
    result = {
        'id': parseInt(Item['id']['N']),
        'Nombre': Item['Nombre']['S'],
        'Categoria': Item['Categoria']['S'],
        'Precio': parseInt(Item['Precio']['N']),
        'Color': Item['Color']['S'],
        'Imagen': Item['imagen']['S'],
        'Descripcion': Item['Descripcion']['S']
    }

    return result
}

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
    const input_db = {
        "TableName": "Productos"
      };

    const command_db = new ScanCommand(input_db);

    try {
        const response_db = await client_db.send(command_db);
        let res_db = response_db['Items'];
        
        for(let i = 0; i < res_db.length; i++){
            res_db[i] = dbItemToObject(res_db[i]);
            await GetImg(res_db[i])
        }

        res.json(res_db)
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching image from S3");
    }
};

exports.GetProduct = async (req, res) => {

};
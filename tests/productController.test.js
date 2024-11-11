const { DeleteProductTest, GetStock } = require('../server/Controllers/ProductsViewController');
const db = require('../server/Database/index');
require('dotenv').config();

jest.mock('mysql2', () => ({
    createConnection: jest.fn().mockReturnValue({
      connect: jest.fn(),
      query: jest.fn((sql, callback) => {
      
        callback(null, [{ id: 1, nombre: 'Producto 1' }]);
      }),
      end: jest.fn(),
     
      charset: 'utf8',
    }),
  }));

describe('Product Controller Tests', () => {

  afterEach(() => {
    jest.clearAllMocks(); 
  });
  
  it('should delete a product', async () => {
    const req = {
      userTipo: 1,
      body: { id: 1 },
    };

    const mockDbResponse = {};
    db.query = jest.fn((query, callback) => {
      callback(null, mockDbResponse);
    });

    const res = {
      status: jest.fn().mockReturnThis(), 
      json: jest.fn().mockReturnThis(),
    };

    await DeleteProductTest(req, res);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM neon.Productos'), expect.any(Function));
    expect(res.json).toHaveBeenCalledWith(mockDbResponse);
  });


  it('should get stock by product ID', async () => {
    const req = {
      query: { ProductosId: 1 },
    };

    const mockDbResponse = [
      { Stock: 10, Tamaño: 'M', Stock_Productos_FK: 1 },
    ];
    db.query = jest.fn((query, callback) => {
      callback(null, mockDbResponse);
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    await GetStock(req, res);

    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM Stock WHERE Stock_Productos_FK'), expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDbResponse);
  });
});

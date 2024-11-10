const { DeleteProductTest, GetStock } = require('../server/Controllers/ProductsViewController');
const db = require('../server/Database/index');
require('dotenv').config(); // Carga las variables del archivo .env

jest.mock('mysql2', () => ({
    createConnection: jest.fn().mockReturnValue({
      connect: jest.fn(),
      query: jest.fn((sql, callback) => {
        // Si la consulta es la que esperas, retornamos una respuesta simulada.
        // Aquí puedes simular una respuesta con 'utf8' directamente.
        callback(null, [{ id: 1, nombre: 'Producto 1' }]); // Ejemplo de respuesta
      }),
      end: jest.fn(),
      // Añadimos un 'charset' específico para evitar codificación 'c
      charset: 'utf8',
    }),
  }));

// Simulación completa del módulo 'mysql2' para evitar la conexión real a la base de datos
jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn((sql, callback) => callback(null, [])), // Simula la respuesta vacía de cualquier consulta
    end: jest.fn(),
  }),
}));

describe('Product Controller Tests', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar mocks después de cada test
  });

  // Test para la función DeleteProductTest
  it('should delete a product', async () => {
    const req = {
      userTipo: 1,
      body: { id: 1 },
    };

    const mockDbResponse = {}; // Respuesta simulada de la base de datos
    db.query = jest.fn((query, callback) => {
      callback(null, mockDbResponse); // Simula la respuesta de la consulta DELETE
    });

    const res = {
      status: jest.fn().mockReturnThis(),  // Permite encadenar métodos
      json: jest.fn().mockReturnThis(),
    };

    await DeleteProductTest(req, res);

    // Asegurarse de que se llamó a la consulta DELETE
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM neon.Productos'), expect.any(Function));
    expect(res.json).toHaveBeenCalledWith(mockDbResponse);
  });

  // Test para la función GetStock
  it('should get stock by product ID', async () => {
    const req = {
      query: { ProductosId: 1 },
    };

    const mockDbResponse = [
      { Stock: 10, Tamaño: 'M', Stock_Productos_FK: 1 },
    ];
    db.query = jest.fn((query, callback) => {
      callback(null, mockDbResponse); // Simula la respuesta de la consulta SELECT
    });

    const res = {
      status: jest.fn().mockReturnThis(),  // Permite encadenar métodos
      json: jest.fn().mockReturnThis(),
    };

    await GetStock(req, res);

    // Asegurarse de que se llamó a la consulta SELECT
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM Stock WHERE Stock_Productos_FK'), expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDbResponse);
  });
});

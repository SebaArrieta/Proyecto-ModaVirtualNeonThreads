const mysql = require('mysql2');

// Configura los parámetros de la base de datos
const connection = mysql.createConnection({
  host: 'database-project.c108uqeim6y2.sa-east-1.rds.amazonaws.com', // Endpoint de tu instancia RDS
  user: 'admin',      // Nombre de usuario de la base de datos
  password: 'Proyectoneon#',  // Contraseña de la base de datos
  database: 'neon'   // Nombre de la base de datos
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL en RDS');
});

module.exports = connection;
require('dotenv').config();

const express = require('express');
const path = require('path');
const cfdiRoutes = require('./routes/cfdi');

// Logs para depuración
/*console.log('Variables de entorno en server.js:');
console.log('F_PLUGIN:', process.env.F_PLUGIN);
console.log('F_API_KEY:', process.env.F_API_KEY);
console.log('F_SECRET_KEY:', process.env.F_SECRET_KEY);
*/

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/cfdi', cfdiRoutes);

// Rutas de vistas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/buscar-cfdi', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'buscar-cfdi.html'));
});

app.get('/crear-cfdi', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'crear-cfdi.html'));
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 
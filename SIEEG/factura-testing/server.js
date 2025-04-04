const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint proxy para la API de Factura.com
app.post('/api/cfdi/list', async (req, res) => {
    try {
        const response = await axios.post('https://sandbox.factura.com/api/v4/cfdi/list', req.body, {
            headers: {
                'Content-Type': 'application/json',
                'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
                'F-Api-Key': 'JDJ5JDEwJEFNaDFlQmcyWmFWd05vWG05SEZlZmU2UC9QbnZ0YVJtbkdZNHlrTUlKTE1KZkFFMFZDVDJl',
                'F-Secret-Key': 'JDJ5JDEwJEExZGZuMGpzNXFHcmpGcWlrTGJXTWVqMWVrRksuclVzWWcuRzBoY3N1SjdmNjZBbVVpaHRp'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 
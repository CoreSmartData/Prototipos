require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    facturaApi: {
        baseUrl: 'https://sandbox.factura.com/api/v4',
        plugin: '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
        apiKey: 'JDJ5JDEwJEFNaDFlQmcyWmFWd05vWG05SEZlZmU2UC9QbnZ0YVJtbkdZNHlrTUlKTE1KZkFFMFZDVDJl',
        secretKey: 'JDJ5JDEwJEExZGZuMGpzNXFHcmpGcWlrTGJXTWVqMWVrRksuclVzWWcuRzBoY3N1SjdmNjZBbVVpaHRp'
    }
}; 
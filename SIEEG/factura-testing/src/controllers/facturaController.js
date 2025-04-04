const axios = require('axios');
const config = require('../config/config');

exports.listCfdis = async (req, res) => {
    try {
        const response = await axios.post(`${config.facturaApi.baseUrl}/cfdi/list`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'F-PLUGIN': config.facturaApi.plugin,
                'F-Api-Key': config.facturaApi.apiKey,
                'F-Secret-Key': config.facturaApi.secretKey
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        res.status(500).json({ 
            error: 'Error al procesar la solicitud',
            details: error.message 
        });
    }
}; 
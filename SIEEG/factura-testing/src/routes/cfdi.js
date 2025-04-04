const express = require('express');
const router = express.Router();
const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'https://sandbox.factura.com/api/v4/cfdi';
const F_PLUGIN = process.env.F_PLUGIN;
const F_API_KEY = process.env.F_API_KEY;
const F_SECRET_KEY = process.env.F_SECRET_KEY;

// Logs para depuración
/*console.log('Variables de entorno cargadas:');
console.log('F_PLUGIN:', F_PLUGIN);
console.log('F_API_KEY:', F_API_KEY);
console.log('F_SECRET_KEY:', F_SECRET_KEY);
*/
// Middleware para verificar API keys
const checkApiKeys = (req, res, next) => {
    if (!F_PLUGIN || !F_API_KEY || !F_SECRET_KEY) {
        console.log('Error: Faltan variables de entorno');
        console.log('F_PLUGIN:', F_PLUGIN);
        console.log('F_API_KEY:', F_API_KEY);
        console.log('F_SECRET_KEY:', F_SECRET_KEY);
        return res.status(500).json({
            status: 'error',
            message: 'API keys no configuradas'
        });
    }
    next();
};

// Búsqueda por UID
router.get('/uid/:uid', checkApiKeys, async (req, res) => {
    try {
        const { uid } = req.params;
        const response = await axios.get(`${API_BASE_URL}/uid/${uid}`, {
            headers: {
                'Content-Type': 'application/json',
                'F-PLUGIN': F_PLUGIN,
                'F-Api-Key': F_API_KEY,
                'F-Secret-Key': F_SECRET_KEY
            }
        });

        res.json({
            status: 'success',
            data: response.data
        });
    } catch (error) {
        handleApiError(error, res);
    }
});

// Búsqueda por UUID
router.get('/uuid/:uuid', checkApiKeys, async (req, res) => {
    try {
        const { uuid } = req.params;
        const response = await axios.get(`${API_BASE_URL}/uuid/${uuid}`, {
            headers: {
                'Content-Type': 'application/json',
                'F-PLUGIN': F_PLUGIN,
                'F-Api-Key': F_API_KEY,
                'F-Secret-Key': F_SECRET_KEY
            }
        });

        res.json({
            status: 'success',
            data: response.data
        });
    } catch (error) {
        handleApiError(error, res);
    }
});

// Búsqueda por Folio
router.get('/folio/:folio', checkApiKeys, async (req, res) => {
    try {
        const { folio } = req.params;
        const response = await axios.get(`${API_BASE_URL}/folio/${folio}`, {
            headers: {
                'Content-Type': 'application/json',
                'F-PLUGIN': F_PLUGIN,
                'F-Api-Key': F_API_KEY,
                'F-Secret-Key': F_SECRET_KEY
            }
        });

        res.json({
            status: 'success',
            data: response.data
        });
    } catch (error) {
        handleApiError(error, res);
    }
});

// Listar CFDIs
router.post('/list', checkApiKeys, async (req, res) => {
    try {
        const { month, year, rfc, page = 1, per_page = 100 } = req.body;
        
        if (!month || !year || !rfc) {
            return res.status(400).json({
                status: 'error',
                message: 'Se requieren los campos month, year y rfc'
            });
        }

        const response = await axios.get(`${API_BASE_URL}/list`, {
            headers: {
                'Content-Type': 'application/json',
                'F-PLUGIN': F_PLUGIN,
                'F-Api-Key': F_API_KEY,
                'F-Secret-Key': F_SECRET_KEY
            },
            params: {
                month,
                year,
                rfc,
                page,
                per_page
            }
        });

        res.json({
            status: 'success',
            data: response.data
        });
    } catch (error) {
        handleApiError(error, res);
    }
});

// Crear CFDI 4.0
router.post('/create', checkApiKeys, async (req, res) => {
    try {
        const response = await axios.post(`${API_BASE_URL}40/create`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'F-PLUGIN': F_PLUGIN,
                'F-Api-Key': F_API_KEY,
                'F-Secret-Key': F_SECRET_KEY
            }
        });

        res.json({
            status: 'success',
            data: response.data
        });
    } catch (error) {
        handleApiError(error, res);
    }
});

// Manejador de errores de la API
function handleApiError(error, res) {
    const errorResponse = {
        status: 'error',
        message: 'Error al procesar la solicitud'
    };

    if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
            case 400:
                errorResponse.message = 'Solicitud inválida';
                break;
            case 401:
                errorResponse.message = 'No autorizado';
                break;
            case 404:
                errorResponse.message = 'CFDI no encontrado';
                break;
            case 429:
                errorResponse.message = 'Demasiadas solicitudes';
                break;
            default:
                errorResponse.message = data.message || 'Error del servidor';
        }
        
        res.status(status).json(errorResponse);
    } else if (error.request) {
        res.status(503).json({
            ...errorResponse,
            message: 'No se pudo conectar con el servicio'
        });
    } else {
        res.status(500).json(errorResponse);
    }
}

module.exports = router; 
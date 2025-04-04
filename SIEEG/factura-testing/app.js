document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('apiForm');
    const resultsDiv = document.getElementById('results');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Mostrar indicador de carga
        resultsDiv.innerHTML = `
            <div class="alert alert-info">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                Enviando solicitud...
            </div>
        `;

        // Obtener valores del formulario
        const payload = {
            month: document.getElementById('month').value,
            year: document.getElementById('year').value,
            rfc: document.getElementById('rfc').value,
            page: parseInt(document.getElementById('page').value),
            per_page: parseInt(document.getElementById('perPage').value)
        };

        try {
            const response = await fetch('/api/cfdi/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            // Mostrar resultados
            resultsDiv.innerHTML = `
                <div class="mb-3">
                    <h6>Status Code: ${response.status}</h6>
                </div>
                <div>
                    <h6>Response Body:</h6>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </div>
            `;
        } catch (error) {
            resultsDiv.innerHTML = `
                <div class="alert alert-danger">
                    Error al realizar la solicitud: ${error.message}
                </div>
            `;
        }
    });
}); 
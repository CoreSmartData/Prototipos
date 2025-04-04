document.addEventListener('DOMContentLoaded', () => {
    const resultsDiv = document.getElementById('searchResults');
    const forms = {
        uid: document.getElementById('uidForm'),
        uuid: document.getElementById('uuidForm'),
        folio: document.getElementById('folioForm')
    };

    // Inicializar selectores de mes y año
    initializeSelectors();

    // Agregar event listeners a los formularios
    document.querySelectorAll('form[data-search-type]').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const searchType = this.getAttribute('data-search-type');
            
            // Obtener los valores comunes
            const month = this.querySelector('.month-selector').value;
            const year = this.querySelector('.year-selector').value;
            
            let endpoint = '';
            let payload = {};
            
            switch(searchType) {
                case 'rfc':
                    const rfc = this.querySelector('#rfcInput').value;
                    endpoint = '/api/cfdi/list';
                    payload = { month, year, rfc };
                    break;
                case 'uuid':
                    const uuid = this.querySelector('#uuidInput').value;
                    endpoint = '/api/cfdi/uuid';
                    payload = { uuid };
                    break;
                case 'folio':
                    const serie = this.querySelector('#serieInput').value;
                    const folio = this.querySelector('#folioInput').value;
                    endpoint = '/api/cfdi/folio';
                    payload = { serie, folio };
                    break;
                default:
                    showError('Tipo de búsqueda no válido');
                    return;
            }

            try {
                showLoading();
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                hideLoading();

                if (data.status === 'success') {
                    displayResults(data.data);
                } else {
                    showError(data.message || 'Error al buscar el CFDI');
                }
            } catch (error) {
                hideLoading();
                showError('Error al realizar la búsqueda');
                console.error('Error:', error);
            }
        });
    });

    // Función para inicializar los selectores
    function initializeSelectors() {
        // Obtener todos los selectores de mes y año
        const monthSelectors = document.querySelectorAll('.month-selector');
        const yearSelectors = document.querySelectorAll('.year-selector');

        // Obtener el mes y año actual
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() devuelve 0-11
        const currentYear = currentDate.getFullYear();

        // Llenar selectores de mes
        monthSelectors.forEach(selector => {
            selector.innerHTML = '<option value="">Seleccionar mes</option>';
            for (let i = 1; i <= 12; i++) {
                const monthName = new Date(2000, i - 1).toLocaleString('es-ES', { month: 'long' });
                const monthValue = i.toString().padStart(2, '0');
                const option = document.createElement('option');
                option.value = monthValue;
                option.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                if (i === currentMonth) {
                    option.selected = true;
                }
                selector.appendChild(option);
            }
        });

        // Llenar selectores de año
        yearSelectors.forEach(selector => {
            selector.innerHTML = '<option value="">Seleccionar año</option>';
            for (let year = currentYear; year >= currentYear - 5; year--) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                if (year === currentYear) {
                    option.selected = true;
                }
                selector.appendChild(option);
            }
        });
    }

    // Mostrar indicador de carga
    function showLoading() {
        resultsDiv.innerHTML = `
            <div class="alert alert-info">
                <div class="spinner-container">
                    <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <span class="responsive-text">Procesando solicitud...</span>
                </div>
            </div>
        `;
    }

    // Mostrar resultados
    function displayResults(data) {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '';

        if (!data || (Array.isArray(data) && data.length === 0)) {
            resultsContainer.innerHTML = '<div class="alert alert-info">No se encontraron resultados</div>';
            return;
        }

        // Si es una búsqueda por RFC, los resultados vendrán en un array
        if (Array.isArray(data)) {
            const table = document.createElement('table');
            table.className = 'table table-striped';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Serie</th>
                        <th>Folio</th>
                        <th>UUID</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(cfdi => `
                        <tr>
                            <td>${cfdi.serie || '-'}</td>
                            <td>${cfdi.folio || '-'}</td>
                            <td>${cfdi.uuid || '-'}</td>
                            <td>${cfdi.fecha || '-'}</td>
                            <td>$${cfdi.total || '0.00'}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="downloadCFDI('${cfdi.uuid}')">
                                    <i class="fas fa-download"></i> PDF
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="downloadXML('${cfdi.uuid}')">
                                    <i class="fas fa-file-code"></i> XML
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            resultsContainer.appendChild(table);
        } else {
            // Para búsquedas individuales (UUID o Folio)
            const cfdi = data;
            resultsContainer.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">CFDI Encontrado</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Serie:</strong> ${cfdi.serie || '-'}</p>
                                <p><strong>Folio:</strong> ${cfdi.folio || '-'}</p>
                                <p><strong>UUID:</strong> ${cfdi.uuid || '-'}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Fecha:</strong> ${cfdi.fecha || '-'}</p>
                                <p><strong>Total:</strong> $${cfdi.total || '0.00'}</p>
                                <div class="btn-group">
                                    <button class="btn btn-primary" onclick="downloadCFDI('${cfdi.uuid}')">
                                        <i class="fas fa-download"></i> Descargar PDF
                                    </button>
                                    <button class="btn btn-secondary" onclick="downloadXML('${cfdi.uuid}')">
                                        <i class="fas fa-file-code"></i> Descargar XML
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Mostrar error
    function showError(message) {
        resultsDiv.innerHTML = `
            <div class="alert alert-danger">
                <div class="responsive-text">
                    <strong>Error:</strong> ${message}
                </div>
            </div>
        `;
    }

    // Función para formatear XML
    function formatXML(xml) {
        return xml
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .substring(0, 500) + '...'; // Mostrar solo los primeros 500 caracteres
    }

    // Función para ocultar el indicador de carga
    function hideLoading() {
        resultsDiv.innerHTML = '';
    }
}); 
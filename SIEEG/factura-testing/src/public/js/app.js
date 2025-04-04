document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('apiForm');
    const resultsDiv = document.getElementById('results');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');

    // Inicializar selectores y validación solo si los elementos existen
    if (monthSelect && yearSelect) {
        initializeSelectors();
        initializeFormValidation();
    } else {
        console.error('No se encontraron los selectores de mes y año');
    }

    // Evento principal del formulario
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            await makeRequest();
        });
    }

    // Inicializar selectores de mes y año
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

    // Inicializar validación del formulario
    function initializeFormValidation() {
        const rfcInput = document.getElementById('rfc');
        const pageInput = document.getElementById('page');
        const perPageInput = document.getElementById('perPage');

        if (rfcInput) {
            rfcInput.addEventListener('input', function() {
                const isValid = this.checkValidity();
                this.classList.toggle('is-valid', isValid);
                this.classList.toggle('is-invalid', !isValid);
            });
        }

        // Validación de números en tiempo real
        [pageInput, perPageInput].forEach(input => {
            if (input) {
                input.addEventListener('input', function() {
                    const value = parseInt(this.value);
                    const min = parseInt(this.min);
                    const max = parseInt(this.max) || Infinity;
                    const isValid = value >= min && value <= max;
                    
                    this.classList.toggle('is-valid', isValid);
                    this.classList.toggle('is-invalid', !isValid);
                });
            }
        });

        if (monthSelect) {
            monthSelect.addEventListener('change', function() {
                console.log('Mes seleccionado:', this.value);
            });
        }
    }

    // Realizar la solicitud a la API
    async function makeRequest() {
        if (!monthSelect || !yearSelect) {
            showError('No se encontraron los selectores necesarios');
            return;
        }

        showLoading();

        const payload = {
            month: monthSelect.value,
            year: yearSelect.value,
            rfc: document.getElementById('rfc').value.toUpperCase(),
            page: parseInt(document.getElementById('page').value),
            per_page: parseInt(document.getElementById('perPage').value)
        };

        console.log('Payload a enviar:', payload);

        try {
            const response = await fetch('/api/cfdi/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la solicitud');
            }

            showResults(response.status, data);
        } catch (error) {
            showError(error.message);
        }
    }

    // Mostrar indicador de carga
    function showLoading() {
        if (resultsDiv) {
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
    }

    // Mostrar resultados
    function showResults(status, data) {
        if (!resultsDiv) return;

        const hasData = data.data && data.data.length > 0;
        
        resultsDiv.innerHTML = `
            <div class="alert ${hasData ? 'alert-success' : 'alert-warning'} mb-3">
                <div class="responsive-text">
                    <strong>Estado:</strong> ${status} - ${hasData ? 'Registros encontrados' : 'No se encontraron registros'}
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0 responsive-text">Detalles de la respuesta</h6>
                </div>
                <div class="card-body">
                    <pre class="responsive-text">${JSON.stringify(data, null, 2)}</pre>
                </div>
            </div>
        `;
    }

    // Mostrar error
    function showError(message) {
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="alert alert-danger">
                    <div class="responsive-text">
                        <strong>Error:</strong> ${message}
                    </div>
                </div>
            `;
        }
    }
}); 
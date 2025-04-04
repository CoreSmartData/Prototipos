document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cfdiForm');
    const conceptosContainer = document.getElementById('conceptos');
    const btnAgregarConcepto = document.getElementById('agregarConcepto');
    const btnPrevisualizar = document.getElementById('btnPrevisualizar');
    const resultsDiv = document.getElementById('results');

    // Plantilla para un nuevo concepto
    const conceptoTemplate = `
        <div class="concepto border rounded p-3 mb-3">
            <div class="d-flex justify-content-between mb-3">
                <h6 class="mb-0">Concepto</h6>
                <button type="button" class="btn btn-danger btn-sm eliminar-concepto">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">Clave Producto/Servicio *</label>
                        <input type="text" class="form-control clave-prod-serv" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label class="form-label">No. Identificación</label>
                        <input type="text" class="form-control no-identificacion">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label">Cantidad *</label>
                        <input type="number" class="form-control cantidad" step="0.000001" required>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label">Clave Unidad *</label>
                        <input type="text" class="form-control clave-unidad" required>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label">Unidad *</label>
                        <input type="text" class="form-control unidad" required>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="mb-3">
                        <label class="form-label">Valor Unitario *</label>
                        <input type="number" class="form-control valor-unitario" step="0.000001" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="mb-3">
                        <label class="form-label">Descripción *</label>
                        <input type="text" class="form-control descripcion" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label">Descuento</label>
                        <input type="number" class="form-control descuento" step="0.01">
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="mb-3">
                        <label class="form-label">Objeto Impuesto *</label>
                        <select class="form-select objeto-imp" required>
                            <option value="01">01 - No objeto de impuesto</option>
                            <option value="02">02 - Sí objeto de impuesto</option>
                            <option value="03">03 - Sí objeto y no obligado al desglose</option>
                            <option value="04">04 - Sí objeto y no causa impuesto</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="impuestos">
                <h6 class="mb-3">Impuestos</h6>
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label class="form-label">Tipo</label>
                            <select class="form-select impuesto-tipo">
                                <option value="traslado">Traslado</option>
                                <option value="retencion">Retención</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label class="form-label">Impuesto</label>
                            <select class="form-select impuesto-clave">
                                <option value="002">002 - IVA</option>
                                <option value="003">003 - IEPS</option>
                                <option value="001">001 - ISR</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label class="form-label">Tipo Factor</label>
                            <select class="form-select tipo-factor">
                                <option value="Tasa">Tasa</option>
                                <option value="Cuota">Cuota</option>
                                <option value="Exento">Exento</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Tasa o Cuota</label>
                            <input type="number" class="form-control tasa-cuota" step="0.000001">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Agregar concepto
    btnAgregarConcepto.addEventListener('click', () => {
        conceptosContainer.insertAdjacentHTML('beforeend', conceptoTemplate);
    });

    // Eliminar concepto
    conceptosContainer.addEventListener('click', (e) => {
        if (e.target.closest('.eliminar-concepto')) {
            e.target.closest('.concepto').remove();
        }
    });

    // Previsualizar CFDI
    btnPrevisualizar.addEventListener('click', () => {
        const cfdiData = obtenerDatosCFDI();
        mostrarPreview(cfdiData);
    });

    // Enviar formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const cfdiData = obtenerDatosCFDI();
        await crearCFDI(cfdiData);
    });

    // Función para obtener todos los datos del formulario
    function obtenerDatosCFDI() {
        const conceptos = Array.from(document.querySelectorAll('.concepto')).map(concepto => {
            const impuestos = {
                Traslados: [],
                Retenidos: [],
                Locales: []
            };

            const tipoImpuesto = concepto.querySelector('.impuesto-tipo').value;
            const base = parseFloat(concepto.querySelector('.valor-unitario').value);
            const impuestoClave = concepto.querySelector('.impuesto-clave').value;
            const tipoFactor = concepto.querySelector('.tipo-factor').value;
            const tasaCuota = parseFloat(concepto.querySelector('.tasa-cuota').value);
            const importe = base * tasaCuota;

            const impuestoObj = {
                Base: base.toFixed(6),
                Impuesto: impuestoClave,
                TipoFactor: tipoFactor,
                TasaOCuota: tasaCuota.toFixed(6),
                Importe: importe.toFixed(6)
            };

            if (tipoImpuesto === 'traslado') {
                impuestos.Traslados.push(impuestoObj);
            } else {
                impuestos.Retenidos.push(impuestoObj);
            }

            return {
                ClaveProdServ: concepto.querySelector('.clave-prod-serv').value,
                NoIdentificacion: concepto.querySelector('.no-identificacion').value,
                Cantidad: parseFloat(concepto.querySelector('.cantidad').value).toFixed(6),
                ClaveUnidad: concepto.querySelector('.clave-unidad').value,
                Unidad: concepto.querySelector('.unidad').value,
                Descripcion: concepto.querySelector('.descripcion').value,
                ValorUnitario: parseFloat(concepto.querySelector('.valor-unitario').value).toFixed(6),
                Importe: (parseFloat(concepto.querySelector('.cantidad').value) * 
                         parseFloat(concepto.querySelector('.valor-unitario').value)).toFixed(6),
                Descuento: concepto.querySelector('.descuento').value || "0",
                ObjetoImp: concepto.querySelector('.objeto-imp').value,
                Impuestos: impuestos
            };
        });

        return {
            Receptor: {
                UID: document.getElementById('receptorUid').value,
                ResidenciaFiscal: document.getElementById('residenciaFiscal').value
            },
            TipoDocumento: document.getElementById('tipoDocumento').value,
            Serie: parseInt(document.getElementById('serie').value),
            Conceptos: conceptos,
            UsoCFDI: document.getElementById('usoCFDI').value,
            FormaPago: document.getElementById('formaPago').value,
            MetodoPago: document.getElementById('metodoPago').value,
            Moneda: document.getElementById('moneda').value,
            EnviarCorreo: document.getElementById('enviarCorreo').checked,
            BorradorSiFalla: document.getElementById('borradorSiFalla').checked ? "1" : "0",
            Comentarios: document.getElementById('comentarios').value
        };
    }

    // Función para mostrar la previsualización
    function mostrarPreview(data) {
        resultsDiv.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Previsualización del CFDI</h5>
                </div>
                <div class="card-body">
                    <pre class="language-json"><code>${JSON.stringify(data, null, 2)}</code></pre>
                </div>
            </div>
        `;
    }

    // Función para crear el CFDI
    async function crearCFDI(data) {
        try {
            resultsDiv.innerHTML = `
                <div class="alert alert-info">
                    <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <span class="ms-2">Creando CFDI...</span>
                </div>
            `;

            const response = await fetch('/api/cfdi/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.status === 'success') {
                resultsDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h5>¡CFDI creado exitosamente!</h5>
                        <p><strong>UUID:</strong> ${result.data.UUID}</p>
                        <p><strong>Serie-Folio:</strong> ${result.data.INV.Serie}-${result.data.INV.Folio}</p>
                    </div>
                `;
            } else {
                throw new Error(result.message || 'Error al crear el CFDI');
            }
        } catch (error) {
            resultsDiv.innerHTML = `
                <div class="alert alert-danger">
                    <h5>Error al crear el CFDI</h5>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    // Agregar primer concepto al cargar la página
    btnAgregarConcepto.click();
}); 
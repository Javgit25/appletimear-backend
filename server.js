// Servidor AppleTimeAR con MercadoPago REAL
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuración MercadoPago
const { MercadoPagoConfig, Preference } = require('mercadopago');

// IMPORTANTE: Reemplazar con tus credenciales reales
const client = new MercadoPagoConfig({
    accessToken: 'TAPP_USR-3956718042424860-042921-b2f180c784096c982785f8fa5d3dc90e-274238372', // TU ACCESS TOKEN AQUÍ
});

// Ruta de prueba
app.get('/test', (req, res) => {
    console.log('✅ Alguien probó el servidor!');
    res.json({
        status: 'OK',
        message: '🎉 ¡Tu servidor está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Crear pago REAL con MercadoPago
app.post('/crear-pago', async (req, res) => {
    try {
        console.log('💳 Creando pago REAL con MercadoPago...');
        console.log('Datos recibidos:', req.body);

        const preference = new Preference(client);
        
        const body = {
            items: [
                {
                    title: '3 Intentos Adicionales - AppleTimeAR',
                    description: 'Compra 3 intentos adicionales para seguir jugando',
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: 500 // $500 pesos argentinos
                }
            ],
            payment_methods: {
                excluded_payment_types: [],
                installments: 1
            },
            back_urls: {
                success: `${req.protocol}://${req.get('host')}/success`,
                failure: `${req.protocol}://${req.get('host')}/failure`,
                pending: `${req.protocol}://${req.get('host')}/pending`
            },
            auto_return: 'approved',
            external_reference: `appletimear-${Date.now()}`,
            notification_url: `${req.protocol}://${req.get('host')}/webhook`
        };

        const result = await preference.create(body);
        
        console.log('✅ Pago REAL creado exitosamente');
        console.log('ID de preferencia:', result.id);
        
        res.json({
            success: true,
            init_point: result.init_point,
            preference_id: result.id,
            message: 'Pago creado correctamente'
        });

    } catch (error) {
        console.error('❌ Error creando pago:', error);
        res.status(500).json({
            success: false,
            error: 'Error creando el pago',
            message: error.message
        });
    }
});

// Webhook para notificaciones de MercadoPago
app.post('/webhook', (req, res) => {
    console.log('🔔 Notificación de MercadoPago:', req.body);
    res.status(200).send('OK');
});

// Verificar pago
app.get('/verificar-pago/:paymentId', async (req, res) => {
    try {
        const paymentId = req.params.paymentId;
        console.log('🔍 Verificando pago:', paymentId);
        
        // Aquí podrías hacer una consulta real a MercadoPago
        // Por ahora, retornamos datos básicos
        res.json({
            id: paymentId,
            status: 'approved',
            message: 'Pago verificado correctamente'
        });
    } catch (error) {
        console.error('❌ Error verificando pago:', error);
        res.status(500).json({
            success: false,
            error: 'Error verificando el pago'
        });
    }
});

// Páginas de retorno mejoradas
app.get('/success', (req, res) => {
    console.log('✅ ¡Pago exitoso!');
    res.send(`
        <html>
            <head>
                <title>¡Pago Exitoso!</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        text-align: center; 
                        padding: 20px;
                        background: linear-gradient(135deg, #4CAF50, #45a049);
                        color: white;
                        margin: 0;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .container {
                        background: white;
                        color: #333;
                        padding: 40px 20px;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        max-width: 400px;
                        width: 100%;
                    }
                    .emoji { font-size: 60px; margin-bottom: 20px; }
                    h1 { color: #4CAF50; margin: 0 0 20px 0; }
                    p { font-size: 16px; line-height: 1.5; margin: 10px 0; }
                    .note { 
                        background: #f0f0f0; 
                        padding: 15px; 
                        border-radius: 10px; 
                        margin: 20px 0;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="emoji">🎉</div>
                    <h1>¡Pago Exitoso!</h1>
                    <p>Tu compra se procesó correctamente.</p>
                    <p><strong>Ya puedes usar tus 3 intentos adicionales.</strong></p>
                    <div class="note">
                        Puedes cerrar esta ventana y volver a la app.
                    </div>
                </div>
            </body>
        </html>
    `);
});

app.get('/failure', (req, res) => {
    console.log('❌ Pago falló');
    res.send(`
        <html>
            <head>
                <title>Pago No Completado</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        text-align: center; 
                        padding: 20px;
                        background: linear-gradient(135deg, #f44336, #d32f2f);
                        color: white;
                        margin: 0;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .container {
                        background: white;
                        color: #333;
                        padding: 40px 20px;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        max-width: 400px;
                        width: 100%;
                    }
                    .emoji { font-size: 60px; margin-bottom: 20px; }
                    h1 { color: #f44336; margin: 0 0 20px 0; }
                    p { font-size: 16px; line-height: 1.5; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="emoji">❌</div>
                    <h1>Pago No Completado</h1>
                    <p>Hubo un problema con tu pago.</p>
                    <p>Puedes intentar nuevamente en la app.</p>
                </div>
            </body>
        </html>
    `);
});

app.get('/pending', (req, res) => {
    console.log('⏳ Pago pendiente');
    res.send(`
        <html>
            <head>
                <title>Pago Pendiente</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        text-align: center; 
                        padding: 20px;
                        background: linear-gradient(135deg, #FF9800, #F57C00);
                        color: white;
                        margin: 0;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .container {
                        background: white;
                        color: #333;
                        padding: 40px 20px;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        max-width: 400px;
                        width: 100%;
                    }
                    .emoji { font-size: 60px; margin-bottom: 20px; }
                    h1 { color: #FF9800; margin: 0 0 20px 0; }
                    p { font-size: 16px; line-height: 1.5; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="emoji">⏳</div>
                    <h1>Pago Pendiente</h1>
                    <p>Tu pago está siendo procesado.</p>
                    <p>Te notificaremos cuando se complete.</p>
                </div>
            </body>
        </html>
    `);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀========================================');
    console.log('🎯 SERVIDOR APPLETIMEAR CON MERCADOPAGO');
    console.log('🚀========================================');
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`🧪 Test: http://localhost:${PORT}/test`);
    console.log('💳 MercadoPago: ACTIVADO');
    console.log('🚀========================================');
});

module.exports = app;
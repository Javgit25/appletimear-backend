// Servidor para AppleTimeAR
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/test', (req, res) => {
    console.log('✅ Alguien probó el servidor!');
    res.json({
        status: 'OK',
        message: '🎉 ¡Tu servidor está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Crear pago (simulado por ahora)
app.post('/crear-pago', (req, res) => {
    console.log('💳 Creando pago simulado...');
    res.json({
        success: true,
        init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=simulacion',
        message: 'Pago creado (simulación)'
    });
});

// Verificar pago (simulado)
app.get('/verificar-pago/:paymentId', (req, res) => {
    res.json({
        id: req.params.paymentId,
        status: 'approved',
        message: 'Pago aprobado (simulación)'
    });
});

// Páginas de retorno
app.get('/success', (req, res) => {
    res.send('<h1>🎉 Pago Exitoso!</h1><p>Tu compra se procesó correctamente.</p>');
});

app.get('/failure', (req, res) => {
    res.send('<h1>❌ Pago Fallido</h1><p>Hubo un problema con tu pago.</p>');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 Servidor iniciado en puerto', PORT);
    console.log('🔗 Prueba: http://localhost:' + PORT + '/test');
});

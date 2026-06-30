require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const porta = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializa a IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Usamos o modelo padrão de entrada (flash). 
// Se você criou um projeto novo, este modelo DEVE funcionar.
const modeloBase = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/chat', async (req, res) => {
    try {
        const { historico, mensagem } = req.body;
        
        // Mantemos o histórico simples
        const chat = modeloBase.startChat({
            history: historico || [],
        });

        const resultado = await chat.sendMessage(mensagem);
        const respostaIA = resultado.response.text();

        res.json({ resposta: respostaIA });

    } catch (erro) {
        console.error("Erro Final:", erro);
        res.status(500).json({ erro: 'Falha na IA. Verifique as configurações do projeto.' });
    }
});

app.listen(porta, () => {
    console.log(`Servidor ativo.`);
});

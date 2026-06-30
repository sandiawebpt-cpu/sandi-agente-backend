require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const porta = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializa a IA com a chave que está configurada no Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Modelo mais estável e universal atualmente
const modeloBase = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-002" 
});

app.post('/api/chat', async (req, res) => {
    try {
        const { historico, mensagem } = req.body;
        
        // Inicia o chat mantendo o histórico
        const chat = modeloBase.startChat({
            history: historico || [],
        });

        const resultado = await chat.sendMessage(mensagem);
        const respostaIA = resultado.response.text();

        res.json({ resposta: respostaIA });

    } catch (erro) {
        console.error("Erro no Gemini:", erro);
        res.status(500).json({ erro: 'Erro ao processar a mensagem.' });
    }
});

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});

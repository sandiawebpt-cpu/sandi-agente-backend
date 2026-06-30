require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const porta = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Usando o modelo mais atual e estável
const modeloBase = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-002" 
});

app.post('/api/chat', async (req, res) => {
    try {
        const { historico, mensagem } = req.body;
        
        // Criamos o chat com o histórico enviado pelo cliente
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

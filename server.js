require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const porta = process.env.PORT || 3000;

// Configuração de Segurança (Permite apenas o seu site fazer requisições)
app.use(cors());
app.use(express.json());

// Inicializa a API do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configuração do Agente e Regras de Negócio (System Prompt)
const modeloBase = genAI.getGenerativeModel({
    model: "gemini-1.5-pro", // Modelo rápido e econômico para chats
    systemInstruction: `Você é o assistente virtual da agência Sandi Web. 
    Seu tom é profissional, direto e focado em conversão. 
    O foco da agência é o modelo de assinatura WaaS (Website as a Service), oferecendo manutenção contínua e desenvolvimento web. 
    Colete o nome e o e-mail ou WhatsApp do cliente caso ele demonstre interesse em um orçamento.`
});

// Endpoint que o seu site vai chamar
app.post('/api/chat', async (req, res) => {
    try {
        const { historico, mensagem } = req.body;

        // O Gemini gerencia o histórico de forma um pouco diferente, iniciando um chat
        const chat = modeloBase.startChat({
            history: historico || [],
        });

        const resultado = await chat.sendMessage(mensagem);
        const respostaIA = resultado.response.text();

        res.json({ resposta: respostaIA });

    } catch (erro) {
        console.error("Erro no Gemini:", erro);
        res.status(500).json({ erro: 'Erro ao processar a mensagem no servidor.' });
    }
});

app.listen(porta, () => {
    console.log(`Servidor do Agente Sandi Web rodando na porta ${porta}`);
});

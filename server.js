require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const porta = process.env.PORT || 3000;

// Libera o acesso para o seu site
app.use(cors());
app.use(express.json());

// Inicializa a API do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Usamos o modelo universal que funciona em qualquer servidor/região
const modeloBase = genAI.getGenerativeModel({
    model: "gemini-pro"
});

app.post('/api/chat', async (req, res) => {
    try {
        const { historico, mensagem } = req.body;

        // Injetamos a "personalidade" do agente no início do histórico de forma silenciosa
        const regrasDeNegocio = [
            { 
                role: "user", 
                parts: [{ text: "A partir de agora, atue como o assistente virtual da agência Sandi Web. Seu tom é profissional, direto e focado em conversão. O foco da agência é o modelo de assinatura WaaS (Website as a Service), oferecendo manutenção contínua e desenvolvimento web. Colete o nome e o WhatsApp do cliente caso ele demonstre interesse. Responda apenas 'Entendido' para confirmar." }] 
            },
            { 
                role: "model", 
                parts: [{ text: "Entendido! Estou pronto para atender os clientes da Sandi Web." }] 
            }
        ];

        // Junta as regras com o histórico real da conversa
        const historicoCompleto = regrasDeNegocio.concat(historico || []);

        const chat = modeloBase.startChat({
            history: historicoCompleto,
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

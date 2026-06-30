require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Essa função roda assim que o servidor liga
async function listarModelos() {
    try {
        console.log("--- LISTANDO MODELOS DISPONÍVEIS ---");
        const models = await genAI.listModels();
        models.models.forEach(m => {
            console.log(`Nome: ${m.name}, Suporta gerar conteúdo: ${m.supportedGenerationMethods.includes('generateContent')}`);
        });
        console.log("--- FIM DA LISTA ---");
    } catch (e) {
        console.error("Erro ao listar modelos:", e);
    }
}

listarModelos();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando e verificando modelos...`);
});

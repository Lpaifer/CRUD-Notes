
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const filePath = './data.json';

const readData = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const writeData = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// GET - todas as notas
app.get('/notas', (req, res) => {
    const data = readData();
    res.json(data);
});

// POST - nova nota
app.post('/notas', (req, res) => {
    const data = readData();
    const novaNota = { id: Date.now(), ...req.body };
    data.push(novaNota);
    writeData(data);
    res.status(201).json(novaNota);
});

// PUT - editar nota
app.put('/notas/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.findIndex(n => n.id === id);
    if (index !== -1) {
        data[index] = { id, ...req.body };
        writeData(data);
        res.json(data[index]);
    } else {
        res.status(404).json({ message: 'Nota não encontrada' });
    }
});

// DELETE - remover nota
app.delete('/notas/:id', (req, res) => {
    let data = readData();
    const id = parseInt(req.params.id);
    data = data.filter(n => n.id !== id);
    writeData(data);
    res.status(204).end();
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

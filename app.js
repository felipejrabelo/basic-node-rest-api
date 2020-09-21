const Joi = require('joi');
const express = require('express');
const app = express();

// Middleware to parse json from the http body
app.use(express.json());

const remedios = [
    {id: 1, nome: 'Remedio 1'},
    {id: 2, nome: 'Remedio 2'},
    {id: 3, nome: 'Remedio 3'},
    {id: 4, nome: 'Remedio 4'},
    {id: 5, nome: 'Remedio 5'},
];

app.get('/', (req, res) => {
    res.send('This is a simple Node Rest API made by Felipe Rabelo Ferreira for testing his applications');
});

app.get('/api/remedios', (req, res) => {
    res.send(remedios);
});

app.get('/api/remedios/:id', (req, res) => {
    const remedio = remedios.find( c => c.id === parseInt(req.params.id));
    if(!remedio) // 404 - Not Found
        res.status(404).send(`O remedio com ID: ${req.params.id} não foi encontado`);
    res.send(remedio);
});

app.post('/api/remedios', (req, res) => {

    const error = validateRemedio(req.body)
    if(error) return res.status(404).send(error.details[0].message);
    
    const remedio = {
        id: remedios.length + 1,
        nome: req.body.nome
    };

    remedios.push(remedio);
    res.send(remedio);

});

app.put('/api/remedios/:id', (req, res) => {

    const remedio = remedios.find( remedio => remedio.id === parseInt(req.params.id));
    if(!remedio) // 404 - Not Found
        return res.status(404).send(`O remedio com ID: ${req.params.id} não foi encontado`);

    const error = validateRemedio(req.body)
    if(error) return res.status(404).send(error.details[0].message);
    
    remedio.nome = req.body.nome;
    res.send(remedio);

});


// How to read params
app.get('/api/params/:id', (req, res) => {
    res.send(req.params);
});

// How to read query params
// Test URL: http://localhost:PORT/api/query/?param1=56765
app.get('/api/query/', (req, res) => {
    res.send(req.query);
});


function validateRemedio(remedio) {
    // Usando Joi Package
    const schema = Joi.object({
        nome: Joi.string().min(3).required()
    });

    const { error } = schema.validate(remedio);
    if(error) return error;  
}

// PORT to listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
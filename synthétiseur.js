const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

const OPENAI_API_KEY = process.env.TOKEN ; // à remplacer par votre clé API OpenAI
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate', (req, res) => {
    const article_text = req.body.article_text;
    const style = req.body.style;

    const options = {
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        json: {
            messages: [
                {"role": "system", "content": "Tu sert seulement à synthétiser des textes"},
                {"role": "user", "content": article_text + "de manière" + style} ,
            ],
            model : "gpt-3.5-turbo",
            max_tokens: 500,
            temperature: 0.5
        }
    };

    request(options, (err, response, body) => {
        if (err) {
            return res.send('Error generating response');
        }

        if (body.error) {
            return res.send(`OpenAI API error: ${body.error.message}`);
        }

        const result = body.choices[0].message.content.split('\n').map(line => {
            return `<p>${line}</p>`;
        }).join('');
        

        const response_text = `<style>.copy-button {display: inline-block;background-color: #ffeba7;color: #333;border-radius: 50px;font-size: 1.2rem;font-weight: 600;padding: 12px 32px;margin-top: 20px;text-decoration: none;transition: all 0.3s ease-in-out;}.copy-button:hover {transform: translateY(-2px);box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);}.copy-button:active {transform: translateY(0px);box-shadow: none;}</style><script>function copyText() {const textToCopy = document.getElementById('myDiv').innerText;const tempInput = document.createElement('input');tempInput.value = textToCopy;document.body.appendChild(tempInput);tempInput.select();document.execCommand('copy');document.body.removeChild(tempInput);}</script><center><h2 style="font-weight:600;font-size:3vw;color:white;">Résultat :</h2> <br> <div id="myDiv" style="font-size: 20px; color: white;">${result}</div><br><button class="copy-button" onclick="copyText()">Copier le texte</button></center>`;
        console.log(body.choices[0])
        res.send(response_text);
        console.log(response_text );

       
    });


});

app.listen(process.env.PORT || port, () => console.log('Listening on port 3000'));

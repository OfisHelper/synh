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
        

      const response_text = `<style>.copy-button{all: unset;font-family: 'Ubuntu', sans-serif;position: absolute;transform: translate(-50%, -50%);width: 240px;height: 40px;line-height: 1;font-size: 18px;font-weight: bold;letter-spacing: 1px;background: #ffab3c;color: #f0f0f0;border-radius: 40px;cursor: pointer;overflow: hidden;transition: all .35s;border: 0px solid #ffab3c;margin-top: 20px;}.copy-button:hover{border: 3px solid #ffab3c;background: #f0f0f0;color: #ffab3c;}.copy-button span{opacity: 1 ;visibility: visible ;transition: all .35s;}</style><script>function copyText() {const textToCopy = document.getElementById('myDiv').innerText;const tempInput = document.createElement('input');tempInput.value = textToCopy;document.body.appendChild(tempInput);tempInput.select();document.execCommand('copy');document.body.removeChild(tempInput);}</script><center><h2 style="font-weight:600;font-size:3vw;color:white;">Résultat :</h2> <br> <div id="myDiv" style="font-size: 20px; color: white;">${result}</div><br><button class="copy-button" onclick="copyText()">Copier le texte</button></center>`;
        console.log(body.choices[0])
        res.send(response_text);
        console.log(response_text );

       
    });


});

app.listen(process.env.PORT || port, () => console.log('Listening on port 3000'));

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
      
      const response_text = `
          <center><h2 class="copy" style="font-weight: 600; font-size: 3vw; color:white;">Résultat :</h2></center>
          <br>
          <div class="copy" style="color:white; font-size: 20px;" oncopy="onCopy(event)">${result}</div>
          <span class="copied" style="position:absolute; right:-9999px"></span>
          <button id="copy-button" onclick="copyResult()">Copier le résultat</button>
      `;
      console.log(body.choices[0])
      res.send(response_text);
      console.log(response_text )
    });
  
});

function onCopy(event) {
    event.preventDefault();
    var text = window.getSelection().toString();
    event.clipboardData.setData("text/plain", text);
    event.clipboardData.setData("text/html", text);
    document.querySelector(".copied").innerHTML = "Copié !";
    setTimeout(() => {
        document.querySelector(".copied").innerHTML = "";
    }, 1500);
}

function copyResult() {
    const resultElement = document.querySelector(".copy");
    const range = document.createRange();
    range.selectNodeContents(resultElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    document.querySelector(".copied").innerHTML = "Copié !";
    setTimeout(() => {
        document.querySelector(".copied").innerHTML = "";
    }, 1500);
}

app.listen(process.env.PORT || port, () => console.log('Listening on port 3000'));

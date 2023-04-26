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

      const response_text = `<center><h2 class="copy" style="font-weight: 600; font-size: 3vw; color:white;">Résultat :</h2></center><br><div style="color:white; font-size: 20px;">${result}</div>`;
      console.log(body.choices[0])
      res.send(response_text);
      console.log(response_text )

      // Ajouter le texte à l'élément invisible dans la page pour pouvoir le copier
      const hiddenDiv = document.createElement('div');
      hiddenDiv.innerHTML = result.replace(/<p>/g, '').replace(/<\/p>/g, '\n');
      hiddenDiv.style.position = 'absolute';
      hiddenDiv.style.top = '-9999px';
      document.body.appendChild(hiddenDiv);

      // Sélectionner et copier le texte en noir
      const range = document.createRange();
      range.selectNode(hiddenDiv);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();

      // Retirer l'élément invisible de la page
      document.body.removeChild(hiddenDiv);
  });
  
});

app.listen(process.env.PORT || port, () => console.log('Listening on port 3000'));

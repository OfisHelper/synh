const form = document.querySelector('form');
const resultDiv = document.getElementById('result');
const copyButton = document.getElementById('copy-button');
const responseText = document.getElementById('response-text');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const articleText = document.getElementById('article-text').value;
    const style = document.getElementById('style').value;

    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            article_text: articleText,
            style: style
        })
    })
    .then(response => response.text())
    .then(result => {
        resultDiv.innerHTML = `<center><h2 class="copy" style="font-weight: 600; font-size: 3vw; color:white;">Résultat :</h2></center><br><div class="copy" style="color:white; font-size: 20px;">${result}</div><span class="copied" style="position:absolute; right:-9999px"></span>`;
        copyButton.classList.add('showresult');
    })
    .catch(error => console.error('Error:', error));
});

copyButton.addEventListener('click', () => {
    responseText.select();
    document.execCommand('copy');
    const copiedSpan = document.querySelector('.copied');
    copiedSpan.innerText = 'Copié !';
    copiedSpan.style.right = '10px';
    setTimeout(() => {
        copiedSpan.innerText = '';
        copiedSpan.style.right = '-9999px';
    }, 2000);
});

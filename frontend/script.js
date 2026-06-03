function contarCaracteres() {
    const texto = document.getElementById('textoOriginal').value;
    const limite = 5000;
    const contador = document.getElementById('charCount');
    contador.innerText = `${texto.length} / ${limite} caracteres`;
    contador.style.color = texto.length > limite ? "red" : "#666";
}

async function simplificar() {
    const texto = document.getElementById('textoOriginal').value;
    const divResultado = document.getElementById('resultado');
    const pSimples = document.getElementById('textoSimples');
    const playerAudio = document.getElementById('playerAudio');
    const botao = document.getElementById('btnProcessar');
    const spinner = document.getElementById('spinner');

    if (!texto) return;

    botao.disabled = true;
    spinner.style.display = 'inline-block';
    divResultado.style.display = 'none';

    try {
        const response = await fetch('http://127.0.0.1:5000/api/simplificar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: texto })
        });

        const data = await response.json();

        if (response.ok) {
            pSimples.innerText = data.texto_simplificado;
            playerAudio.src = data.audio_url;
            divResultado.style.display = 'block';
        } else {
            alert("Erro da API: " + data.erro);
        }
    } catch (error) {
        alert("Erro de conexão.");
    } finally {
        botao.disabled = false;
        spinner.style.display = 'none';
    }
}

function baixarAudio() {
    const urlAudio = document.getElementById('playerAudio').src;
    const nomeBase = document.getElementById('nomeArquivo').value || "aula";
    
    const link = document.createElement('a');
    link.href = urlAudio;
    link.download = `${nomeBase}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
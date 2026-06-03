const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5000' 
    : '';

function contarCaracteres() {
    const texto = document.getElementById('textoOriginal').value;
    const contador = document.getElementById('charCount'); 
    
    if (contador) {
        contador.innerText = `${texto.length} / 5000 caracteres`;
    }
}

async function simplificar() {
    const textoInput = document.getElementById('textoOriginal').value;
    const resultadoContainer = document.getElementById('resultado');
    const resultadoTexto = document.getElementById('textoSimples');
    const playerAudio = document.getElementById('playerAudio');
    const botao = document.getElementById('btnProcessar');
    const spinner = document.getElementById('spinner');

    if (!textoInput) {
        alert("Por favor, cole o conteúdo da aula primeiro.");
        return;
    }

    botao.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';

    try {
        const response = await fetch(`${API_URL}/api/simplificar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: textoInput })
        });

        const data = await response.json();

        if (response.ok) {
            resultadoTexto.innerText = data.texto_simplificado;
            
            playerAudio.src = `${API_URL}${data.audio_url}?t=${new Date().getTime()}`;
            playerAudio.load();
            
            if (resultadoContainer) resultadoContainer.style.display = 'block';
        } else {
            alert("Erro: " + data.erro);
        }
    } catch (error) {
        alert("Erro de conexão. A API pode estar carregando, tente de novo em alguns segundos.");
    } finally {
        botao.disabled = false;
        if (spinner) spinner.style.display = 'none';
    }
}

function baixarAudio() {
    const playerAudio = document.getElementById('playerAudio');
    const inputNome = document.getElementById('nomeArquivo');
    
    let nomeFinal = 'aula_acessivel';
    if (inputNome && inputNome.value.trim() !== '') {
        nomeFinal = inputNome.value.trim();
    }

    if (playerAudio && playerAudio.src && !playerAudio.src.endsWith('undefined') && playerAudio.src !== "") {
        const a = document.createElement('a');
        a.href = playerAudio.src;
        a.download = `${nomeFinal}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert("Nenhum áudio disponível para baixar. Gere o material primeiro.");
    }
}
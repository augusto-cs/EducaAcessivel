const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5000' 
    : '';

async function simplificar() {
    const textoInput = document.getElementById('textoOriginal').value;
    const resultadoTexto = document.getElementById('textoSimples');
    const playerAudio = document.getElementById('playerAudio');
    const botao = document.getElementById('btnProcessar');
    const spinner = document.getElementById('spinner');

    if (!textoInput) return;

    botao.disabled = true;
    spinner.style.display = 'inline-block';

    try {
        const response = await fetch(`${API_URL}/api/simplificar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: textoInput })
        });

        const data = await response.json();

        if (response.ok) {
            resultadoTexto.innerText = data.texto_simplificado;
            playerAudio.src = `${API_URL}${data.audio_url}?t=${new Date().getTime()}`;
            document.getElementById('resultado').style.display = 'block';
        } else {
            alert("Erro: " + data.erro);
        }
    } catch (error) {
        alert("Erro de conexão.");
    } finally {
        botao.disabled = false;
        spinner.style.display = 'none';
    }
}
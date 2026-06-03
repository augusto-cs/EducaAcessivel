import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from gtts import gTTS

app = Flask(__name__, static_folder='static')
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')

if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

GOOGLE_API_KEY = "API"
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-3.5-flash')

if not os.path.exists('static'):
    os.makedirs('static')

@app.route('/api/simplificar', methods=['POST'])
def simplificar_e_gerar_audio():
    dados = request.get_json()
    texto_complexo = dados.get('texto', '')

    if not texto_complexo:
        return jsonify({"erro": "Nenhum texto foi enviado"}), 400

    prompt = f"""
    Você é um assistente especialista em acessibilidade pedagógica. 
    Sua tarefa é reescrever o texto abaixo usando o conceito de 'Linguagem Simples'.
    Remova termos técnicos excessivamente complexos ou explique-os de forma direta.
    Mantenha o texto curto, claro e fácil de ser compreendido por qualquer estudante.
    
    REGRAS OBRIGATÓRIAS:
    1. Retorne APENAS o texto simplificado e mais nada.
    2. NÃO inclua introduções, saudações ou conclusões.
    3. NÃO use NENHUMA formatação de texto (sem asteriscos, sem negrito, sem marcação de tópicos). Apenas texto corrido e pontuação básica.
    
    Texto para simplificar:
    {texto_complexo}
    """
    
    try:
        response = model.generate_content(prompt)
        texto_simples = response.text.strip()
        
        nome_arquivo = "audio_atual.mp3"
        caminho_arquivo = os.path.join(STATIC_DIR, nome_arquivo)
        
        tts = gTTS(text=texto_simples, lang='pt', tld='com.br')
        tts.save(caminho_arquivo)
        
        url_audio = f"http://127.0.0.1:5000/static/{nome_arquivo}?t={os.path.getmtime(caminho_arquivo)}"
        
        return jsonify({
            "texto_original": texto_complexo,
            "texto_simplificado": texto_simples,
            "audio_url": url_audio
        }), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Servidor da API rodando na porta 5000...")
    app.run(debug=True, port=5000)
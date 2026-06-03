import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from gtts import gTTS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app)

# Configuração da API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

# Garante que a pasta static existe
STATIC_DIR = os.path.join(os.getcwd(), 'static')
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

# Rotas do Front-end
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_frontend(path):
    return send_from_directory('../frontend', path)

# Rota para arquivos estáticos (áudio)
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(STATIC_DIR, filename)

# Rota da API
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
        
        url_audio = f"/static/{nome_arquivo}"
        
        return jsonify({
            "texto_simplificado": texto_simples,
            "audio_url": url_audio
        }), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
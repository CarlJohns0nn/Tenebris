// ============================================
// 🔥 CONFIGURAÇÃO DO FIREBASE
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyBM7eGuK-aioIoXIUGXMKTkuphMjcZoMAo",
    authDomain: "tenebris-45f0c.firebaseapp.com",
    projectId: "tenebris-45f0c",
    storageBucket: "tenebris-45f0c.firebasestorage.app",
    messagingSenderId: "593825542368",
    appId: "1:593825542368:web:de98128bb6df49688e2085",
    measurementId: "G-QFR7CXKNF7"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("🔥 Firebase inicializado!");
console.log("📧 Auth:", auth);
console.log("📦 Firestore:", db);

// ============================================
// TOAST
// ============================================
function toast(m) {
    const t = document.getElementById('toast');
    t.textContent = m;
    t.classList.add('show');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('show'), 3000);
}

// ============================================
// LOGIN (via botão)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 DOM carregado!");
    
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        console.log("✅ Botão login encontrado!");
        btnLogin.addEventListener('click', function() {
            const email = document.getElementById('loginUser').value.trim();
            const senha = document.getElementById('loginPass').value.trim();

            console.log("📧 Tentando login com:", email);

            if (!email || !senha) {
                toast('Preencha e-mail e senha!');
                return;
            }

            auth.signInWithEmailAndPassword(email, senha)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("✅ Login bem-sucedido!", user.email);
                    
                    document.getElementById('page-login').style.display = 'none';
                    document.getElementById('page-main').style.display = 'block';
                    document.querySelectorAll('#headerUserDisplay').forEach(el => {
                        el.textContent = user.email;
                    });
                    toast('✅ Bem-vindo, ' + user.email + '!');
                    carregarFicha();
                })
                .catch((error) => {
                    console.error("❌ Erro no login:", error.code, error.message);
                    toast('❌ Erro: ' + error.message);
                });
        });
    } else {
        console.error("❌ Botão login NÃO encontrado!");
    }

    // ============================================
    // CADASTRO (via botão)
    // ============================================
    const btnCadastro = document.getElementById('btnCadastro');
    if (btnCadastro) {
        console.log("✅ Botão cadastro encontrado!");
        btnCadastro.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("🔘 Clique em cadastro");
            mostrarCadastro();
        });
    } else {
        console.error("❌ Botão cadastro NÃO encontrado!");
    }
});

// ============================================
// FUNÇÃO DE CADASTRO
// ============================================
function mostrarCadastro() {
    console.log("📝 Iniciando cadastro...");
    
    const email = prompt("Digite seu e-mail para cadastro:");
    if (!email) {
        console.log("❌ Cadastro cancelado (email)");
        return;
    }

    const senha = prompt("Digite sua senha (mínimo 6 caracteres):");
    if (!senha || senha.length < 6) {
        toast('Senha deve ter pelo menos 6 caracteres!');
        return;
    }

    const nome = prompt("Digite seu nome:");
    if (!nome) {
        console.log("❌ Cadastro cancelado (nome)");
        return;
    }

    console.log("📧 Criando usuário:", email);

    auth.createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("✅ Usuário criado!", user.uid);
            
            return db.collection("usuarios").doc(user.uid).set({
                nome: nome,
                email: email,
                dataCriacao: new Date().toISOString()
            });
        })
        .then(() => {
            console.log("✅ Dados salvos no Firestore!");
            toast('✅ Cadastro realizado! Faça login.');
        })
        .catch((error) => {
            console.error("❌ Erro no cadastro:", error.code, error.message);
            toast('❌ Erro: ' + error.message);
        });
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    auth.signOut();
    document.getElementById('page-login').style.display = 'flex';
    document.getElementById('page-main').style.display = 'none';
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    toast('👋 Até logo!');
}

// ============================================
// NAVEGAÇÃO
// ============================================
function navegarPara(pagina) {
    document.querySelectorAll('.content-page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    const target = document.getElementById('page-' + pagina);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 🔥 NOVO: Se for a página comunidade, carrega os tópicos
        if (pagina === 'comunidade') {
            console.log("📂 Página comunidade aberta, carregando tópicos...");
            carregarTopicos();
        }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pagina);
    });
}

// ============================================
// ATRIBUTOS
// ============================================
function renderizarAtributos() {
    const c = document.getElementById('atributosContainer');
    if (!c) return;

    const attrs = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    c.innerHTML = attrs.map(a => `
        <div class="atributo-item">
            <label>${a}</label>
            <input type="number" id="attr_${a}" value="10" min="1" max="20">
        </div>
    `).join('');
    console.log("✅ Atributos renderizados!");
}

function carregarPericias() {
    const c = document.getElementById('periciasContainer');
    if (!c) return;

    const p = ["Acrobacia", "Arcanismo", "Atletismo", "Enganacao", "Historia",
        "Intuicao", "Intimidacao", "Investigacao", "Medicina", "Percepcao", "Persuasao"
    ];
    c.innerHTML = p.map(x => `
        <button class="pericia-btn">${x}</button>
    `).join('');
    console.log("✅ Perícias renderizadas!");
}

// ============================================
// FICHA
// ============================================
function carregarFicha() {
    const user = auth.currentUser;
    if (!user) {
        console.log("⚠️ Ninguém logado para carregar ficha");
        return;
    }

    console.log("📂 Carregando ficha de:", user.uid);

    db.collection("fichas").doc(user.uid).get()
        .then((doc) => {
            if (!doc.exists) {
                console.log("⚠️ Nenhuma ficha encontrada");
                return;
            }
            const ficha = doc.data();
            console.log("✅ Ficha carregada!", ficha);
            
            document.getElementById('charNome').value = ficha.nome || '';
            document.getElementById('charNivel').value = ficha.nivel || 1;
            document.getElementById('charClasse').value = ficha.classe || 'Guerreiro';
            document.getElementById('charRaca').value = ficha.raca || 'Humano';
            document.getElementById('charHistoria').value = ficha.historia || '';

            if (ficha.atributos) {
                const attrs = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
                attrs.forEach(a => {
                    if (ficha.atributos[a]) {
                        document.getElementById('attr_' + a).value = ficha.atributos[a];
                    }
                });
            }
            toast('📂 Ficha carregada!');
        })
        .catch((error) => {
            console.error("❌ Erro ao carregar ficha:", error);
        });
}

function salvarFicha() {
    const user = auth.currentUser;
    if (!user) {
        toast('Faça login para salvar!');
        return;
    }

    const ficha = {
        nome: document.getElementById('charNome').value || 'Sem Nome',
        nivel: document.getElementById('charNivel').value || '1',
        classe: document.getElementById('charClasse').value || 'Guerreiro',
        raca: document.getElementById('charRaca').value || 'Humano',
        historia: document.getElementById('charHistoria').value || '',
        atributos: {},
        dataAtualizacao: new Date().toISOString()
    };

    const attrs = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    attrs.forEach(a => {
        ficha.atributos[a] = document.getElementById('attr_' + a).value || '10';
    });

    console.log("💾 Salvando ficha...", ficha);

    db.collection("fichas").doc(user.uid).set(ficha)
        .then(() => {
            console.log("✅ Ficha salva!");
            toast('✅ Ficha salva no servidor!');
        })
        .catch((error) => {
            console.error("❌ Erro ao salvar ficha:", error);
            toast('Erro ao salvar ficha!');
        });
}

function limparFicha() {
    if (!confirm('Tem certeza que deseja limpar a ficha?')) return;

    document.getElementById('charNome').value = '';
    document.getElementById('charNivel').value = '1';
    document.getElementById('charClasse').value = 'Guerreiro';
    document.getElementById('charRaca').value = 'Humano';
    document.getElementById('charHistoria').value = '';

    const attrs = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    attrs.forEach(a => {
        document.getElementById('attr_' + a).value = 10;
    });

    toast('🗑️ Ficha limpa!');
}

// ============================================
// ROLAGENS
// ============================================
function rolarDado(lados) {
    const resultado = Math.floor(Math.random() * lados) + 1;
    document.getElementById('diceResult').textContent = resultado;
    toast('🎲 d' + lados + ': ' + resultado);
}

function rolarAtributos() {
    const attrs = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    attrs.forEach(a => {
        let v = 0;
        for (let i = 0; i < 3; i++) {
            v += Math.floor(Math.random() * 6) + 1;
        }
        document.getElementById('attr_' + a).value = v;
    });
    toast('🎲 Novos atributos! (3d6)');
}

// ============================================
// MAGIAS
// ============================================
function toggleMagias() {
    const c = document.getElementById('magiasContainer');
    if (!c) return;

    if (c.style.display === 'none') {
        const magias = [
            { nome: 'Mísseis Mágicos', desc: 'Cria 3 projéteis de energia que causam 1d4+1 de dano cada.' },
            { nome: 'Escudo Arcano', desc: 'Cria uma barreira mágica que aumenta a CA em +5.' },
            { nome: 'Curar Ferimentos', desc: 'Restaura 1d8+mod de PV em um aliado.' }
        ];

        c.innerHTML = magias.map(m => `
            <div class="magia-item" onclick="this.querySelector('.desc').classList.toggle('show')">
                <span class="magia-nome">✨ ${m.nome}</span>
                <div class="desc">${m.desc}</div>
            </div>
        `).join('');
        c.style.display = 'block';
    } else {
        c.style.display = 'none';
    }
}

// ============================================
// VERIFICA SE JÁ ESTÁ LOGADO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando...");
    renderizarAtributos();
    carregarPericias();

    document.getElementById('page-login').style.display = 'flex';
    document.getElementById('page-main').style.display = 'none';

    auth.onAuthStateChanged(function(user) {
        if (user) {
            console.log("👤 Usuário já logado:", user.email);
            document.getElementById('page-login').style.display = 'none';
            document.getElementById('page-main').style.display = 'block';
            document.querySelectorAll('#headerUserDisplay').forEach(el => {
                el.textContent = user.email;
            });
            carregarFicha();
            toast('👋 Bem-vindo de volta, ' + user.email + '!');
        } else {
            console.log("👤 Ninguém logado");
        }
    });
});

// ============================================
// ========== FÓRUM COM FIREBASE ==========
// ============================================

// ============================================
// 1. CARREGAR TÓPICOS
// ============================================
async function carregarTopicos() {
    console.log("📂 Carregando tópicos...");
    
    const container = document.getElementById('forumTopicos');
    if (!container) {
        console.warn("⚠️ Elemento 'forumTopicos' não encontrado");
        return;
    }

    const categoria = document.getElementById('forumCategoria')?.value || 'todas';
    const busca = document.getElementById('forumSearch')?.value || '';

    try {
        let query = db.collection("topicos");
        
        if (categoria && categoria !== 'todas') {
            query = query.where("categoria", "==", categoria);
        }
        
        query = query.orderBy("data", "desc");
        
        const snapshot = await query.get();
        const topicos = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            topicos.push({ 
                id: doc.id, 
                ...data,
                data: data.data || data.criado_em || new Date().toISOString()
            });
        });
        
        console.log(`✅ ${topicos.length} tópicos carregados`);
        renderizarTopicos(topicos);
        atualizarStats(topicos);
        
    } catch (error) {
        console.error("❌ Erro ao carregar tópicos:", error);
        toast('Erro ao carregar tópicos!');
    }
}

// ============================================
// 2. RENDERIZAR TÓPICOS
// ============================================
function renderizarTopicos(topicos) {
    const container = document.getElementById('forumTopicos');
    if (!container) return;
    
    if (!topicos || topicos.length === 0) {
        container.innerHTML = `
            <div class="sem-topicos">
                <span class="empty-icon">📭</span>
                <h3>Nenhum tópico encontrado</h3>
                <p>Seja o primeiro a criar um tópico!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = topicos.map(t => {
        let dataFormatada = 'Data desconhecida';
        if (t.data) {
            try {
                const dataObj = t.data.toDate ? t.data.toDate() : new Date(t.data);
                dataFormatada = formatarData(dataObj.toISOString());
            } catch (e) {
                dataFormatada = 'Data inválida';
            }
        }
        
        return `
        <div class="topico-item" onclick="verTopico('${t.id}')">
            <div class="topico-header">
                <span class="topico-titulo">${t.titulo || 'Sem título'}</span>
                <span class="topico-categoria ${t.categoria || 'geral'}">${t.categoria || 'geral'}</span>
            </div>
            <div class="topico-meta">
                <span>👤 ${t.autorNome || 'Anônimo'}</span>
                <span>📅 ${dataFormatada}</span>
                <span>💬 ${t.totalComentarios || 0} respostas</span>
                <span>❤️ ${t.likes || 0}</span>
            </div>
        </div>
    `}).join('');
}

// ============================================
// 3. CRIAR TÓPICO
// ============================================
function abrirNovoTopico() {
    const user = auth.currentUser;
    if (!user) {
        toast('Faça login para criar um tópico!');
        return;
    }
    
    document.getElementById('novoTitulo').value = '';
    document.getElementById('novoConteudo').value = '';
    document.getElementById('novaCategoria').value = 'geral';
    document.getElementById('modalTopico').style.display = 'flex';
}

async function criarTopico() {
    const user = auth.currentUser;
    if (!user) {
        toast('Faça login primeiro!');
        return;
    }

    const titulo = document.getElementById('novoTitulo').value.trim();
    const categoria = document.getElementById('novaCategoria').value;
    const conteudo = document.getElementById('novoConteudo').value.trim();

    if (!titulo || !conteudo) {
        toast('Preencha todos os campos!');
        return;
    }

    try {
        // 🔥 CORREÇÃO AQUI: usar user.displayName ou user.email
        const nomeAutor = user.displayName || user.email || 'Anônimo';
        
        await db.collection("topicos").add({
            titulo: titulo,
            categoria: categoria,
            conteudo: conteudo,
            autorId: user.uid,
            autorNome: nomeAutor,  // ← AGORA USA O NOME DO FIREBASE
            data: firebase.firestore.FieldValue.serverTimestamp(),
            likes: 0,
            totalComentarios: 0
        });

        toast('✅ Tópico criado com sucesso!');
        fecharModal('modalTopico');
        carregarTopicos();
        
    } catch (error) {
        console.error("❌ Erro ao criar tópico:", error);
        toast('Erro ao criar tópico!');
    }
}

// ============================================
// 4. VER TÓPICO
// ============================================
async function verTopico(id) {
    console.log("🔍 Verificando tópico ID:", id);
    
    if (!id) {
        console.error("❌ ID do tópico é inválido!");
        toast('Erro: ID do tópico inválido!');
        return;
    }

    try {
        // Buscar o tópico
        const docTopico = await db.collection("topicos").doc(id).get();
        if (!docTopico.exists) {
            toast('Tópico não encontrado!');
            return;
        }
        
        const topico = { id: docTopico.id, ...docTopico.data() };
        console.log("✅ Tópico carregado:", topico);
        
        // Verificar se os elementos do modal existem
        const viewTitulo = document.getElementById('viewTitulo');
        const viewConteudo = document.getElementById('viewConteudo');
        const viewComentarios = document.getElementById('viewComentarios');
        const modal = document.getElementById('modalTopicoView');
        
        if (!viewTitulo || !viewConteudo || !viewComentarios || !modal) {
            console.error("❌ Elementos do modal não encontrados!");
            toast('Erro: Modal não configurado!');
            return;
        }
        
        // Mostrar título e conteúdo
        viewTitulo.textContent = topico.titulo || 'Sem título';
        viewConteudo.innerHTML = `
            <div class="view-autor">👤 ${topico.autorNome || 'Anônimo'}</div>
            <div class="view-texto">${topico.conteudo || 'Sem conteúdo'}</div>
            <div class="view-data">📅 ${formatarData(topico.data)}</div>
            <div style="margin-top:10px;color:#555;font-size:0.85rem;">
                ❤️ ${topico.likes || 0} curtidas · 💬 ${topico.totalComentarios || 0} comentários
            </div>
        `;
        
        // Buscar comentários
        const comentariosSnapshot = await db.collection("comentarios")
            .where("topicoId", "==", id)
            .orderBy("data", "asc")
            .get();
        
        const comentarios = [];
        comentariosSnapshot.forEach(doc => {
            comentarios.push({ id: doc.id, ...doc.data() });
        });
        
        // Renderizar comentários
        if (comentarios.length === 0) {
            viewComentarios.innerHTML = `
                <p style="color:#555;text-align:center;padding:1rem;">
                    💬 Nenhum comentário ainda. Seja o primeiro!
                </p>
            `;
        } else {
            viewComentarios.innerHTML = comentarios.map(c => `
                <div class="comentario-item">
                    <div class="com-autor">👤 ${c.autorNome || 'Anônimo'}</div>
                    <div class="com-texto">${c.texto}</div>
                    <div class="com-data">📅 ${formatarData(c.data)}</div>
                </div>
            `).join('');
        }
        
        // Salvar ID do tópico para responder
        modal.dataset.topicoId = id;
        document.getElementById('novoComentario').value = '';
        modal.style.display = 'flex';
        console.log("✅ Modal aberto com sucesso!");
        
    } catch (error) {
        console.error("❌ Erro ao carregar tópico:", error);
        toast('Erro ao carregar tópico!');
    }
}

// ============================================
// 5. RESPONDER TÓPICO
// ============================================
async function responderTopico() {
    const user = auth.currentUser;
    if (!user) {
        toast('Faça login para comentar!');
        return;
    }

    const id = document.getElementById('modalTopicoView').dataset.topicoId;
    const texto = document.getElementById('novoComentario').value.trim();

    if (!texto) {
        toast('Escreva um comentário!');
        return;
    }

    try {
        // 🔥 CORREÇÃO AQUI: usar user.displayName ou user.email
        const nomeAutor = user.displayName || user.email || 'Anônimo';
        
        await db.collection("comentarios").add({
            topicoId: id,
            autorId: user.uid,
            autorNome: nomeAutor,
            texto: texto,
            data: firebase.firestore.FieldValue.serverTimestamp(),
            likes: 0
        });

        // Atualizar contador no tópico
        const topicoRef = db.collection("topicos").doc(id);
        await topicoRef.update({
            totalComentarios: firebase.firestore.FieldValue.increment(1)
        });

        toast('💬 Comentário adicionado!');
        verTopico(id);
        
    } catch (error) {
        console.error("❌ Erro ao comentar:", error);
        toast('Erro ao comentar!');
    }
}

// ============================================
// 6. BUSCAR E FILTRAR
// ============================================
function buscarTopicos() {
    carregarTopicos();
}

function filtrarPorCategoria() {
    carregarTopicos();
}

// ============================================
// 7. FECHAR MODAL
// ============================================
function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

// ============================================
// 8. ATUALIZAR ESTATÍSTICAS
// ============================================
function atualizarStats(topicos) {
    const totalTopicos = document.getElementById('totalTopicos');
    const totalComentarios = document.getElementById('totalComentarios');
    
    if (totalTopicos) {
        totalTopicos.textContent = topicos ? topicos.length : 0;
    }
    
    if (totalComentarios) {
        let total = 0;
        if (topicos) {
            topicos.forEach(t => {
                total += t.totalComentarios || 0;
            });
        }
        totalComentarios.textContent = total;
    }
}

// ============================================
// 9. FORMATAR DATA
// ============================================
function formatarData(data) {
    if (!data) return 'Data desconhecida';
    try {
        const d = data.toDate ? data.toDate() : new Date(data);
        const agora = new Date();
        const diff = agora - d;
        
        if (diff < 60000) return 'Agora mesmo';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm atrás';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h atrás';
        if (diff < 604800000) return Math.floor(diff / 86400000) + 'd atrás';
        
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return 'Data inválida';
    }
}

// ============================================
// 10. CARREGAR TÓPICOS AO ABRIR A PÁGINA
// ============================================
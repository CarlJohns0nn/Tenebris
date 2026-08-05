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
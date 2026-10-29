
 // =============================
 // DADOS E ELEMENTOS DO AION
 // =============================
const servico = document.getElementById("servico");
const sugestoes = document.getElementById("sugestoes");
const listaResultados = document.getElementById("lista-resultados");
const quantidadeResultados = document.getElementById("quantidade-resultados");
const tituloResultados = document.getElementById("titulo-resultados");
const formularioBusca = document.getElementById("formulario-busca");
const modal = document.getElementById("modal");
const fecharModal = document.getElementById("fechar-modal");
const perfilProfissional = document.getElementById("perfil-profissional");
const abrirCadastro = document.getElementById("abrir-cadastro");
const modalCadastro = document.getElementById("modal-cadastro");
const fecharCadastro = document.getElementById("fechar-cadastro");
const abrirLogin = document.getElementById("btn-entrar");
const modalLogin = document.getElementById("modal-login");
const fecharLogin = document.getElementById("fechar-login");
const formularioLogin = document.getElementById("formulario-login");
const mensagemLogin = document.getElementById("mensagem-login");
const formularioCadastro = document.getElementById("formulario-cadastro");
const novoServico = document.getElementById("novo-servico");
const sugestoesCadastro = document.getElementById("sugestoes-cadastro");

const servicos = [
    "Eletricista", "Eletricista residencial", "Eletricista predial", "Pedreiro",
    "Pintor", "Encanador", "Encanador residencial", "Costureira", "Cabeleireiro",
    "Manicure", "Fotógrafo", "Motorista", "Técnico de informática",
    "Técnico de informática residencial", "Jardineiro", "Diarista", "Faxineira",
    "Mecânico", "Marceneiro", "Padeiro", "Confeiteiro"
];

const profissionais = [
    { nome: "João da Silva", servico: "Eletricista", categoria: "Construção", cidade: "sao-martinho", cidadeNome: "São Martinho", descricao: "Instalações elétricas e manutenção residencial.", telefone: "(48) 99999-1111" },
    { nome: "Carlos Souza", servico: "Eletricista residencial", categoria: "Construção", cidade: "sao-martinho", cidadeNome: "São Martinho", descricao: "Manutenção e instalação elétrica.", telefone: "(48) 99999-2222" },
    { nome: "Marcos Pereira", servico: "Pedreiro", categoria: "Construção", cidade: "sao-bonifacio", cidadeNome: "São Bonifácio", descricao: "Construção, reformas e acabamento.", telefone: "(48) 99999-3333" },
    { nome: "Ana Costa", servico: "Costureira", categoria: "Casa", cidade: "sao-martinho", cidadeNome: "São Martinho", descricao: "Consertos, ajustes e confecção de roupas.", telefone: "(48) 99999-4444" },
    { nome: "Juliana Martins", servico: "Cabeleireiro", categoria: "Beleza", cidade: "sao-bonifacio", cidadeNome: "São Bonifácio", descricao: "Cortes, escova e cuidados com o cabelo.", telefone: "(48) 99999-5555" },
    { nome: "Roberto Lima", servico: "Técnico de informática", categoria: "Tecnologia", cidade: "sao-martinho", cidadeNome: "São Martinho", descricao: "Manutenção de computadores e suporte técnico.", telefone: "(48) 99999-6666" }
];

let categoriaSelecionada = "";
let mostrarSomenteFavoritos = false;
let ultimoResultado = [];

const CHAVE_FAVORITOS = "aion-favoritos-v1";
const CHAVE_CADASTROS = "aion-cadastros-v1";

// =============================
// ARMAZENAMENTO LOCAL
// =============================
function lerListaSalva(chave) {
    try {
        const valor = JSON.parse(localStorage.getItem(chave) || "[]");
        return Array.isArray(valor) ? valor : [];
    } catch (erro) {
        return [];
    }
}

function salvarLista(chave, lista) {
    try {
        localStorage.setItem(chave, JSON.stringify(lista));
    } catch (erro) {
        console.warn("Não foi possível salvar no navegador.", erro);
    }
}

function chaveProfissional(profissional) {
    return [
        profissional.nome,
        profissional.servico,
        profissional.cidade,
        profissional.telefone
    ].map(valor => String(valor || "").trim().toLowerCase()).join("|");
}

// Recupera os cadastros salvos no navegador.
lerListaSalva(CHAVE_CADASTROS).forEach(cadastro => {
    if (cadastro && cadastro.nome && cadastro.servico) {
        profissionais.push(cadastro);

        if (!servicos.some(item =>
            item.toLowerCase() === cadastro.servico.toLowerCase()
        )) {
            servicos.push(cadastro.servico);
        }
    }
});

// =============================
// AUTOCOMPLETE
// =============================
function mostrarSugestoes(input, container) {
    container.innerHTML = "";

    const termo = input.value.trim().toLowerCase();

    if (!termo) return;

    servicos
        .filter(item => item.toLowerCase().includes(termo))
        .slice(0, 7)
        .forEach(item => {
            const opcao = document.createElement("div");

            opcao.className = "sugestao";
            opcao.textContent = item;

            opcao.addEventListener("click", () => {
                input.value = item;
                container.innerHTML = "";
            });

            container.appendChild(opcao);
        });
}

servico.addEventListener("input", () => {
    mostrarSugestoes(servico, sugestoes);
});

novoServico.addEventListener("input", () => {
    mostrarSugestoes(novoServico, sugestoesCadastro);
});

document.addEventListener("click", event => {
    if (!event.target.closest(".busca-servico")) {
        sugestoes.innerHTML = "";
    }

    if (!event.target.closest(".campo-autocomplete")) {
        sugestoesCadastro.innerHTML = "";
    }
});

// =============================
// FILTROS DE SERVIÇO, CIDADE E CATEGORIA
// =============================
function filtrarProfissionais() {
    const termo = servico.value.trim().toLowerCase();
    const cidade = document.getElementById("cidade").value;

    return profissionais.filter(profissional => {
        const correspondeServico =
            profissional.servico.toLowerCase().includes(termo);

        const correspondeCidade =
            !cidade || profissional.cidade === cidade;

        const correspondeCategoria =
            !categoriaSelecionada ||
            profissional.categoria === categoriaSelecionada;

        return correspondeServico &&
            correspondeCidade &&
            correspondeCategoria;
    });
}

function mostrarResultadosFiltrados(rolar = true) {
    const resultados = filtrarProfissionais();
    const cidadeSelect = document.getElementById("cidade");
    const cidadeNome =
        cidadeSelect.selectedOptions[0]?.textContent.trim() || "";

    if (categoriaSelecionada && cidadeSelect.value) {
        tituloResultados.textContent =
            `${categoriaSelecionada} em ${cidadeNome}`;
    } else if (categoriaSelecionada) {
        tituloResultados.textContent =
            `Profissionais de ${categoriaSelecionada}`;
    } else if (servico.value.trim()) {
        tituloResultados.textContent =
            `Resultados para “${servico.value.trim()}”`;
    } else if (cidadeSelect.value) {
        tituloResultados.textContent =
            `Profissionais em ${cidadeNome}`;
    } else {
        tituloResultados.textContent = "Profissionais encontrados";
    }

    mostrarResultados(resultados);

    if (rolar) {
        document.querySelector(".resultados").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// =============================
// ORDENAÇÃO
// =============================
function ordenarLista(resultados) {
    const ordenacao =
        document.getElementById("ordenar-resultados")?.value || "relevancia";

    const lista = [...resultados];

    if (ordenacao === "nome") {
        lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    }

    if (ordenacao === "servico") {
        lista.sort((a, b) => a.servico.localeCompare(b.servico, "pt-BR"));
    }

    if (ordenacao === "cidade") {
        lista.sort((a, b) => a.cidadeNome.localeCompare(b.cidadeNome, "pt-BR"));
    }

    return lista;
}

// =============================
// EXIBIÇÃO DOS PROFISSIONAIS
// =============================
function mostrarResultados(resultados) {
    ultimoResultado = [...resultados];

    const favoritos = lerListaSalva(CHAVE_FAVORITOS);

    const avaliacoesDemo = {
        "João da Silva": { media: 4.8, quantidade: 23 },
        "Carlos Souza": { media: 4.5, quantidade: 12 },
        "Marcos Pereira": { media: 4.9, quantidade: 31 }
    };

    let listaExibida = mostrarSomenteFavoritos
        ? resultados.filter(profissional =>
            favoritos.includes(chaveProfissional(profissional))
        )
        : resultados;

    listaExibida = ordenarLista(listaExibida);

    quantidadeResultados.textContent =
        `${listaExibida.length} ${listaExibida.length === 1
            ? "profissional"
            : "profissionais"}`;

    listaResultados.innerHTML = "";

    if (!listaExibida.length) {
        listaResultados.innerHTML = `
            <div class="sem-resultados">
                <strong>${
                    mostrarSomenteFavoritos
                        ? "Nenhum favorito por aqui ainda."
                        : "Nenhum profissional encontrado."
                }</strong>

                <p>${
                    mostrarSomenteFavoritos
                        ? "Toque no coração de um profissional para guardá-lo nesta lista."
                        : "Tente outro termo ou limpe os filtros para ver mais resultados."
                }</p>

                <button type="button" id="acao-sem-resultados">
                    ${
                        mostrarSomenteFavoritos
                            ? "Ver todos os profissionais"
                            : "Limpar filtros"
                    }
                </button>
            </div>
        `;

        document
            .getElementById("acao-sem-resultados")
            .addEventListener("click", () => {
                if (mostrarSomenteFavoritos) {
                    mostrarSomenteFavoritos = false;
                    atualizarBotaoFavoritos();
                    mostrarResultados(ultimoResultado);
                } else {
                    limparFiltros();
                }
            });

        return;
    }

    listaExibida.forEach(profissional => {
        const chave = chaveProfissional(profissional);
        const eFavorito = favoritos.includes(chave);
        const card = document.createElement("article");

        card.className = "profissional";

    const avaliacao = avaliacoesDemo[profissional.nome];
    const media = avaliacao ? avaliacao.media : 0;
    const quantidade = avaliacao ? avaliacao.quantidade : 0;

    const estrelas = [1, 2, 3, 4, 5]
        .map(numero => numero <= Math.round(media) ? "★" : "☆")
        .join("");

        card.innerHTML = `
            <div class="cabecalho-card">
                <div>
                    <h3>${escaparHTML(profissional.nome)}</h3>
                    <p class="servico">⚡ ${escaparHTML(profissional.servico)}</p>
                </div>

                <button
                    type="button"
                    class="botao-favorito ${eFavorito ? "favoritado" : ""}"
                    aria-label="${eFavorito ? "Remover dos" : "Adicionar aos"} favoritos"
                    aria-pressed="${eFavorito}"
                >${eFavorito ? "♥" : "♡"}</button>
            </div>

            <p class="categoria-profissional">
                🏷️ ${escaparHTML(profissional.categoria)}
            </p>

            <p class="local">
                📍 ${escaparHTML(profissional.cidadeNome)}
            </p>

            <p class="descricao">
                ${escaparHTML(profissional.descricao)}
            </p>

            <div class="avaliacao">
                <span class="estrelas">${estrelas}</span>
                <span class="media-avaliacao">
                ${media > 0 ? media.toFixed(1).replace(".", ",") : "Sem avaliações"}
            </span>
            ${quantidade > 0
                ? `<span class="quantidade-avaliacoes">(${quantidade})</span>`
                : ""}
            </div>

            <button type="button" class="ver-profissional">
                Ver perfil e contato
            </button>
        `;

        card.querySelector(".ver-profissional")
            .addEventListener("click", () => abrirPerfil(profissional));

        card.querySelector(".botao-favorito")
            .addEventListener("click", () => alternarFavorito(profissional));

        listaResultados.appendChild(card);
    });
}

// =============================
// FAVORITOS
// =============================
function alternarFavorito(profissional) {
    const chave = chaveProfissional(profissional);
    const favoritos = lerListaSalva(CHAVE_FAVORITOS);

    const atualizados = favoritos.includes(chave)
        ? favoritos.filter(item => item !== chave)
        : [...favoritos, chave];

    salvarLista(CHAVE_FAVORITOS, atualizados);
    mostrarResultados(ultimoResultado);
}

function atualizarBotaoFavoritos() {
    const botao = document.getElementById("filtro-favoritos");

    if (!botao) return;

    botao.classList.toggle("selecionado", mostrarSomenteFavoritos);

    botao.setAttribute(
        "aria-pressed",
        String(mostrarSomenteFavoritos)
    );

    botao.textContent = mostrarSomenteFavoritos
        ? "♥ Ver favoritos"
        : "♡ Favoritos";
}

// =============================
// LIMPAR FILTROS
// =============================
function limparFiltros() {
    servico.value = "";
    document.getElementById("cidade").value = "";

    categoriaSelecionada = "";
    mostrarSomenteFavoritos = false;

    document.querySelectorAll(".categoria").forEach(item => {
        item.classList.remove("ativa");
    });

    sugestoes.innerHTML = "";

    const ordenacao = document.getElementById("ordenar-resultados");

    if (ordenacao) {
        ordenacao.value = "relevancia";
    }

    atualizarBotaoFavoritos();
    mostrarResultadosFiltrados(false);
}

// =============================
// SEGURANÇA DE TEXTO HTML
// =============================
function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

// =============================
// EVENTOS DE BUSCA E CATEGORIAS
// =============================
formularioBusca.addEventListener("submit", event => {
    event.preventDefault();
    mostrarResultadosFiltrados();
});

document.getElementById("cidade")
    .addEventListener("change", () => mostrarResultadosFiltrados());

document.querySelectorAll(".categoria").forEach(botao => {
    botao.addEventListener("click", () => {
        const categoria = botao.dataset.categoria;

        if (!categoria) return;

        categoriaSelecionada =
            categoriaSelecionada === categoria ? "" : categoria;

        document.querySelectorAll(".categoria").forEach(item => {
            item.classList.toggle(
                "ativa",
                item.dataset.categoria === categoriaSelecionada
            );
        });

        mostrarResultadosFiltrados();
    });
});

// =============================
// PERFIL DO PROFISSIONAL
// =============================
function abrirPerfil(profissional) {
    perfilProfissional.innerHTML = `
        <div class="perfil">
            <h2>${escaparHTML(profissional.nome)}</h2>

            <p class="perfil-servico">
                ⚡ ${escaparHTML(profissional.servico)}
            </p>

            <p class="perfil-local">
                📍 ${escaparHTML(profissional.cidadeNome)}
                · ${escaparHTML(profissional.categoria)}
            </p>

            <p class="perfil-descricao">
                ${escaparHTML(profissional.descricao)}
            </p>

            <a
                class="contato"
                href="https://wa.me/55${profissional.telefone.replace(/\D/g, "")}"
                target="_blank"
                rel="noopener noreferrer"
                style="display:block;text-align:center;text-decoration:none"
            >
                Entrar em contato: ${escaparHTML(profissional.telefone)}
            </a>
        </div>
    `;

    modal.classList.add("ativo");
}

fecharModal.addEventListener("click", () => {
    modal.classList.remove("ativo");
});

modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.remove("ativo");
    }
});

// =============================
// MODAL DE CADASTRO
// =============================
abrirCadastro.addEventListener("click", () => {
    modalCadastro.classList.add("ativo");
});

fecharCadastro.addEventListener("click", () => {
    modalCadastro.classList.remove("ativo");
});


abrirLogin.addEventListener("click", event => {
    event.preventDefault();
    mensagemLogin.textContent = "";
    formularioLogin.reset();
    modalLogin.classList.add("ativo");
});

fecharLogin.addEventListener("click", () => {
    modalLogin.classList.remove("ativo");
});

modalLogin.addEventListener("click", event => {
    if (event.target === modalLogin) {
        modalLogin.classList.remove("ativo");
    }
});

modalCadastro.addEventListener("click", event => {
    if (event.target === modalCadastro) {
        modalCadastro.classList.remove("ativo");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        modalLogin.classList.remove("ativo");
        modal.classList.remove("ativo");
        modalCadastro.classList.remove("ativo");
    }
});


formularioLogin.addEventListener("submit", async event => {
    event.preventDefault();

    const usuario = document.getElementById("login-usuario").value.trim();
    const senha = document.getElementById("login-senha").value;

    mensagemLogin.textContent = "Conectando ao servidor...";

    try {
        const resposta = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                senha: senha
            })
        });

        const resultado = await resposta.json();

        mensagemLogin.textContent = resultado.mensagem;

    } catch (erro) {
        console.error("Erro ao conectar ao login:", erro);

        mensagemLogin.textContent =
            "Não foi possível conectar ao servidor AION.";
    }
});



// =============================
// CADASTRAR PROFISSIONAL
// =============================

formularioCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const servicoNovo = novoServico.value.trim();
    const categoria = document.getElementById("nova-categoria").value;
    const cidade = document.getElementById("nova-cidade").value;
    const cidadeNome =
        document.getElementById("nova-cidade").selectedOptions[0].textContent.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const telefone = document.getElementById("telefone").value.trim();

    if (!nome || !servicoNovo || !descricao || !telefone) return;

    const profissional = {
        nome,
        servico: servicoNovo,
        categoria,
        cidade,
        cidadeNome,
        descricao,
        telefone
    };

    try {
        const resposta = await fetch("http://localhost:8080/api/profissionais", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                servico: servicoNovo,
                cidade
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(resultado.mensagem || "Não foi possível cadastrar.");
            return;
        }

        profissionais.push(profissional);

        salvarLista(
            CHAVE_CADASTROS,
            lerListaSalva(CHAVE_CADASTROS).concat(profissional)
        );

        if (!servicos.some(item =>
            item.toLowerCase() === servicoNovo.toLowerCase()
        )) {
            servicos.push(servicoNovo);
        }

        modalCadastro.classList.remove("ativo");
        formularioCadastro.reset();
        sugestoesCadastro.innerHTML = "";
        servico.value = "";
        categoriaSelecionada = "";

        document.querySelectorAll(".categoria").forEach(item => {
            item.classList.remove("ativa");
        });

        tituloResultados.textContent = "Profissional cadastrado";
        mostrarResultados([profissional]);

        document.querySelector(".resultados").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (erro) {
        console.error("Erro ao cadastrar profissional:", erro);
        alert("Não foi possível conectar ao servidor AION.");
    }
});

// =============================
// VOLTAR AO TOPO
// =============================
const botaoVoltarTopo = document.getElementById("voltar-topo");

window.addEventListener("scroll", () => {
    botaoVoltarTopo.classList.toggle("visivel", window.scrollY > 300);
});

botaoVoltarTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// =============================
// TEMA CLARO/ESCURO
// =============================
const telaTema = document.getElementById("tela-tema");
const botoesEscolhaTema = document.querySelectorAll("[data-escolher-tema]");
const botaoAlternarTema = document.getElementById("alternar-tema");
const chaveTema = "aion-tema";

function aplicarTema(tema) {
    const escuro = tema === "escuro";

    document.body.classList.toggle("tema-escuro", escuro);

    document.documentElement.style.colorScheme =
        escuro ? "dark" : "light";

    if (botaoAlternarTema) {
        botaoAlternarTema.textContent = escuro ? "☀ Tema" : "☾ Tema";

        botaoAlternarTema.setAttribute(
            "aria-label",
            escuro ? "Ativar modo claro" : "Ativar modo escuro"
        );

        botaoAlternarTema.title =
            escuro ? "Mudar para tema claro" : "Mudar para tema escuro";
    }
}

function salvarTema(tema) {
    aplicarTema(tema);

    try {
        localStorage.setItem(chaveTema, tema);
    } catch (erro) {
        // O tema continua funcionando sem armazenamento.
    }
}

let temaSalvo = null;

try {
    temaSalvo = localStorage.getItem(chaveTema);
} catch (erro) {
    temaSalvo = null;
}

if (temaSalvo === "claro" || temaSalvo === "escuro") {
    aplicarTema(temaSalvo);

    if (telaTema) {
        telaTema.hidden = true;
    }
} else if (telaTema) {
    telaTema.hidden = false;
}

botoesEscolhaTema.forEach(botao => {
    botao.addEventListener("click", () => {
        salvarTema(botao.dataset.escolherTema);

        if (telaTema) {
            telaTema.classList.add("saindo");

            window.setTimeout(() => {
                telaTema.hidden = true;
                telaTema.classList.remove("saindo");
            }, 420);
        }
    });
});

if (botaoAlternarTema) {
    botaoAlternarTema.addEventListener("click", () => {
        const temaAtual = document.body.classList.contains("tema-escuro")
            ? "escuro"
            : "claro";

        salvarTema(temaAtual === "escuro" ? "claro" : "escuro");
    });
}

// =============================
// ORDENAÇÃO E FILTRO DE FAVORITOS
// =============================
document.getElementById("filtro-favoritos")
    .addEventListener("click", () => {
        mostrarSomenteFavoritos = !mostrarSomenteFavoritos;
        atualizarBotaoFavoritos();
        mostrarResultados(ultimoResultado);
    });

document.getElementById("ordenar-resultados")
    .addEventListener("change", () => {
        mostrarResultados(ultimoResultado);
    });

document.getElementById("limpar-filtros")
    .addEventListener("click", limparFiltros);

// =============================
// INICIALIZAÇÃO
// =============================
atualizarBotaoFavoritos();
mostrarResultadosFiltrados(false);
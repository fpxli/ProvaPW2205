document.addEventListener("DOMContentLoaded", () => {
    // LOGIN
    const loginForm = document.getElementById("formLogin");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const usuario = document.getElementById("txtUsuario").value.trim();
            const senha = document.getElementById("txtSenha").value.trim();
            const mensagemErro = document.getElementById("mensagemErro");

            if (mensagemErro) mensagemErro.textContent = "";

            if (usuario === "") {
                alert("Preencha o campo nome!");
                return;
            }
            if (senha === "") {
                alert("Preencha o campo senha!");
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const usuarioEncontrado = usuarios.find(
                (u) => u.usuario === usuario && u.senha === senha
            );

            if (usuarioEncontrado) {
                alert("Login realizado com sucesso!");
                localStorage.setItem("usuarioLogado", usuario); // salva usuário logado
                window.location.href = "paginaUser.html";
            } else {
                alert("Usuário ou senha inválidos!");
                if (mensagemErro) {
                    mensagemErro.textContent = "Usuário ou senha incorretos.";
                    mensagemErro.style.color = "red";
                }
            }
        });
    }

    // CADASTRO INICIAL
    const cadastroForm = document.getElementById("formCadastro");
    if (cadastroForm) {
        cadastroForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const usuario = document.getElementById("txtUsuario").value.trim();
            const senha = document.getElementById("txtSenha").value;
            const senhaConf = document.getElementById("txtSenhaConf").value;

            if (!usuario || !senha || !senhaConf) {
                alert("Preencha todos os campos.");
                return;
            }

            if (senha !== senhaConf) {
                alert("As senhas não coincidem.");
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const usuarioExistente = usuarios.find((u) => u.usuario === usuario);

            if (usuarioExistente) {
                alert("Usuário já cadastrado.");
                return;
            }

            usuarios.push({ usuario, senha });
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Cadastro realizado com sucesso!");
            cadastroForm.reset();
            window.location.href = "login.html";
        });
    }

    const formCliente = document.getElementById("formCliente");
    const tabela = document.getElementById("tabelaClientes");
    const cepInput = document.getElementById("cep");
    const enderecoInput = document.getElementById("endereco");

    if (cepInput && enderecoInput) {
        cepInput.addEventListener("blur", async () => {
            const cep = cepInput.value.replace(/\D/g, "");
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    if (data.erro) {
                        alert("CEP não encontrado.");
                        enderecoInput.value = "";
                    } else {
                        enderecoInput.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
                    }
                } catch (error) {
                    alert("Erro ao buscar o CEP.");
                }
            }
        });
    }

    function salvarCliente(novoCliente) {
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        clientes.push(novoCliente);
        localStorage.setItem("clientes", JSON.stringify(clientes));
    }

    function listarClientesTabela() {
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        if (tabela) {
            tabela.innerHTML = "";
            clientes.forEach((c, index) => {
                tabela.innerHTML += `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${c.nome}</td>
                      <td>${c.email}</td>
                      <td>${c.cep}</td>
                      <td>${c.endereco}</td>
                    </tr>`;
            });
        }
    }

    if (formCliente) {
        formCliente.addEventListener("submit", (e) => {
            e.preventDefault();
    
            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            const cep = cepInput.value.trim();
            const endereco = enderecoInput.value.trim();
    
            if (nome && email && cep && endereco) {
                salvarCliente({ nome, email, cep, endereco });
                formCliente.reset();
                enderecoInput.value = "";
                listarClientesTabela();  // atualizar tabela
                if (typeof listarClientes === "function") {
                    listarClientes(filtroNome ? filtroNome.value : ""); // atualizar cards
                }
            } else {
                alert("Preencha todos os campos corretamente.");
            }
        });
    }


    // Função para validar email
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // FORM VOLUNTÁRIO 
    const formVoluntario = document.getElementById("formVoluntario");
    const cepInputVol = document.getElementById("cep");
    const enderecoInputVol = document.getElementById("txtEndereco");
    const bairroInputVol = document.getElementById("txtBairro");

    if (formVoluntario && cepInputVol && enderecoInputVol && bairroInputVol) {
        async function buscarEnderecoPorCEP() {
            const cep = cepInputVol.value.replace(/\D/g, "");
            if (cep.length !== 8) {
                alert("CEP inválido. Digite 8 números.");
                enderecoInputVol.value = "";
                bairroInputVol.value = "";
                return;
            }
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (data.erro) {
                    alert("CEP não encontrado.");
                    enderecoInputVol.value = "";
                    bairroInputVol.value = "";
                } else {
                    enderecoInputVol.value = data.logradouro || "";
                    bairroInputVol.value = data.bairro || "";
                }
            } catch (error) {
                alert("Erro ao buscar o CEP.");
                enderecoInputVol.value = "";
                bairroInputVol.value = "";
            }
        }

        cepInputVol.addEventListener("blur", buscarEnderecoPorCEP);

        formVoluntario.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("txtNome").value.trim();
            const sobrenome = document.getElementById("txtSobrenome").value.trim();
            const email = document.getElementById("txtEmail").value.trim();
            const emailConf = document.getElementById("txtEmailconf").value.trim();
            const cep = cepInputVol.value.trim();
            const endereco = enderecoInputVol.value.trim();
            const bairro = bairroInputVol.value.trim();

            if (!nome) {
                alert("Por favor, preencha o nome.");
                return;
            }
            if (!sobrenome) {
                alert("Por favor, preencha o sobrenome.");
                return;
            }
            if (!validarEmail(email)) {
                alert("Por favor, insira um email válido.");
                return;
            }
            if (email !== emailConf) {
                alert("Os emails não coincidem.");
                return;
            }
            if (!cep || cep.replace(/\D/g, "").length !== 8) {
                alert("Digite um CEP válido.");
                return;
            }
            if (!endereco) {
                alert("Preencha um CEP válido para obter o endereço.");
                return;
            }
            if (!bairro) {
                alert("Preencha um CEP válido para obter o bairro.");
                return;
            }

            // Recupera usuário logado
            const usuarioLogado = localStorage.getItem("usuarioLogado");
            if (!usuarioLogado) {
                alert("Usuário não está logado. Faça login antes de cadastrar voluntário.");
                window.location.href = "login.html";
                return;
            }

            // Recupera lista de voluntários
            let voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];

            // Verifica se já existe um voluntário cadastrado para esse usuário com mesmo email
            const jaExiste = voluntarios.some(v => v.usuario === usuarioLogado && v.email === email);
            if (jaExiste) {
                alert("Você já cadastrou esse email como voluntário.");
                return;
            }

            // Adiciona voluntário vinculado ao usuário logado
            voluntarios.push({
                usuario: usuarioLogado,
                nome,
                sobrenome,
                email,
                cep,
                endereco,
                bairro,
            });

            localStorage.setItem("voluntarios", JSON.stringify(voluntarios));

            alert("Cadastro de voluntário realizado com sucesso!");

            formVoluntario.reset();
            enderecoInputVol.value = "";
            bairroInputVol.value = "";
        });
    }

    // Listagem em cards e exclusão
    const container = document.getElementById("containerClientes");
    const filtroNome = document.getElementById("filtroNome");
    const btnExcluirTodos = document.getElementById("btnExcluirTodos");

if (container && filtroNome && btnExcluirTodos && tabela) {

    function listarVoluntarios(filtro = "") {
        let voluntarios = JSON.parse(localStorage.getItem("voluntarios")) || [];

        container.innerHTML = "";
        tabela.innerHTML = "";

        const voluntariosFiltrados = voluntarios.filter(v =>
            v.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        if (voluntariosFiltrados.length === 0) {
            container.innerHTML = "<p>Nenhum voluntário cadastrado.</p>";
            return;
        }

        voluntariosFiltrados.forEach((voluntario) => {
            const index = voluntarios.indexOf(voluntario);
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h3>${voluntario.nome} ${voluntario.sobrenome}</h3>
                <p><strong>Email:</strong> ${voluntario.email}</p>
                <p><strong>CEP:</strong> ${voluntario.cep}</p>
                <p><strong>Endereço:</strong> ${voluntario.endereco}</p>
                <p><strong>Bairro:</strong> ${voluntario.bairro}</p>
                <button data-index="${index}" class="btnExcluir">Excluir</button>
            `;

            container.appendChild(card);

            tabela.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${voluntario.nome} ${voluntario.sobrenome}</td>
                    <td>${voluntario.email}</td>
                    <td>${voluntario.cep}</td>
                    <td>${voluntario.endereco}</td>
                    <td>${voluntario.bairro}</td>
                </tr>
            `;
        });

        container.querySelectorAll(".btnExcluir").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.getAttribute("data-index"), 10);
                voluntarios.splice(idx, 1);
                localStorage.setItem("voluntarios", JSON.stringify(voluntarios));
                listarVoluntarios(filtroNome.value);
            });
        });
    }

    btnExcluirTodos.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja excluir todos os voluntários?")) {
            localStorage.removeItem("voluntarios");
            listarVoluntarios(filtroNome.value);
        }
    });

    filtroNome.addEventListener("input", () => {
        listarVoluntarios(filtroNome.value);
    });

    listarVoluntarios();
}
});


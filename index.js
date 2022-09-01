var RichText = (id, handleChange, valorDefault) => {
  const container = document.getElementById(id);

  const input = document.createElement("div");
  input.innerHTML = valorDefault;
  const editor = criarEditor();

  input.setAttribute("contenteditable", "true");
  input.classList.add("rich-text");

  container.appendChild(editor);
  container.appendChild(input);

  input.onmouseup = onMouseUp;
  container.addEventListener("input", onChange);
  editor.onmousedown = (e) => e.preventDefault();
  container.style.position = "relative";

  function onMouseUp() {
    const { x, y } = window
      .getSelection()
      .getRangeAt(0)
      .getBoundingClientRect();

    const { x: xOffset, y: yOffset } = container.getBoundingClientRect();

    editor.style.top = `${parseInt(y + 20 - yOffset)}px`;
    editor.style.left = `${parseInt(x - xOffset)}px`;

    editor.style.display = window.getSelection().toString().length === 0 ? "none" : "flex";
  }

  function criarEditor() {
    function criarBotao(nomeIcone, comando) {
      const botao = document.createElement("button");
      const icone = document.createElement("i");
      icone.classList.add("fa-solid");
      icone.classList.add(nomeIcone);

      botao.classList.add("botao");
      botao.appendChild(icone);
      botao.onclick = () => {
        document.execCommand(comando);
      };
      return botao;
    }

    function criarDivider(){
      const divider = document.createElement("div");
      divider.classList.add("divider");
      
      return divider;
    }

    function criarSeletorTamanho(){
      const seletorTamanho = document.createElement("div");
      const botao = document.createElement("button");
      botao.classList.add("botao");
      botao.classList.add("botaoSeletorTamanho");

      const iconeFonte = document.createElement("i");
      iconeFonte.classList.add("fa-solid");
      iconeFonte.classList.add("fa-font");

      const iconeChevron = document.createElement("i");
      iconeChevron.classList.add("fa-solid");
      iconeChevron.classList.add("fa-chevron-down");
      iconeChevron.style.fontSize = "8px"
      iconeChevron.style.marginLeft = "2px"

      const menuOpcoes = document.createElement("div");
      menuOpcoes.classList.add("menuOpcoesTamanho");

      botao.appendChild(iconeFonte);
      botao.appendChild(iconeChevron);
      botao.addEventListener("click", () => menuOpcoes.style.display = menuOpcoes.style.display === "none" ? "flex" : "none")

      seletorTamanho.appendChild(botao);
      seletorTamanho.appendChild(menuOpcoes);

      return seletorTamanho;
    }

    function criarSeletorTamanhofgf() {

      function criarOpcao(descricao, comando){
        const opcao = document.createElement("option");
        opcao.setAttribute("value", descricao);
        opcao.innerHTML = descricao;
        return opcao;
      }

      const seletor = document.createElement("select");
      seletor.setAttribute("name", "tamanho");
      seletor.classList.add("seletorTamanho");

      seletor.appendChild(criarOpcao("H1", "asdasda"));
      seletor.appendChild(criarOpcao("H2", "asdasda"));

      return seletor;
    }

    const editor = document.createElement("div");
    editor.classList.add("editor");

    editor.hidden = true;

    editor.appendChild(criarSeletorTamanho());
    editor.appendChild(criarBotao("fa-bold", "bold"));
    editor.appendChild(criarBotao("fa-italic", "italic"));
    editor.appendChild(criarBotao("fa-underline", "underline"));
    editor.appendChild(criarBotao("fa-strikethrough", "strikethrough"));
    editor.appendChild(criarDivider());
    editor.appendChild(criarBotao("fa-list-ol", "insertOrderedList"));
    editor.appendChild(criarBotao("fa-list", "insertUnorderedList"));

    return editor;
  }

  function onChange() {
    if (handleChange) handleChange(input.innerHTML);
  }
};

window.onload = () => RichText("rich-text", () => {}, "bnanana");

var RichText = (id, handleChange, valorDefault) => {
  let penultimoCaractereDigitado = "";

  const container = document.getElementById(id);

  const input = document.createElement("div");
  input.innerHTML = valorDefault;
  const editor = criarEditor();

  input.setAttribute("contenteditable", "true");
  input.classList.add("rich-text");

  container.appendChild(editor);
  container.appendChild(input);

  input.onmouseup = onMouseUp;
  input.onkeyup = onKeyUp;
  container.addEventListener("input", onChange);
  editor.onmousedown = (e) => e.preventDefault();
  container.style.position = "relative";

  function onKeyUp(event) {
    function getCaretPosition(node) {
      // Stackoverflow <3
      var range = window.getSelection().getRangeAt(0),
        preCaretRange = range.cloneRange(),
        caretPosition,
        tmp = document.createElement("div");

      preCaretRange.selectNodeContents(node);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      tmp.appendChild(preCaretRange.cloneContents());
      caretPosition = tmp.innerHTML.length;
      return caretPosition;
    }
    const { code, key, keyCode, target } = event;

    const posicaoCursor = getCaretPosition(input);

    if (code === "Space" && penultimoCaractereDigitado === "Minus") {
      document.execCommand("insertUnorderedList");
      const indiceHifen = target.innerHTML
        .slice(0, posicaoCursor)
        .lastIndexOf("-");
      let conteudoTratado = target.innerHTML.split("");
      conteudoTratado.splice(indiceHifen, 1);
      conteudoTratado = conteudoTratado.join("");
      target.innerHTML = conteudoTratado;
    }

    if (code === "Period") {
      if (target.innerHTML.slice(posicaoCursor - 3, posicaoCursor) === "...") {
        document.execCommand("insertHorizontalRule");
      }
    }

    penultimoCaractereDigitado = code;
  }

  function onMouseUp() {
    const { x, y } = window
      .getSelection()
      .getRangeAt(0)
      .getBoundingClientRect();

    const { x: xOffset, y: yOffset } = container.getBoundingClientRect();

    editor.style.top = `${parseInt(y + 20 - yOffset)}px`;
    editor.style.left = `${parseInt(x - xOffset)}px`;

    editor.style.display =
      window.getSelection().toString().length === 0 ? "none" : "flex";
  }

  function criarEditor() {
    function clickLinkHandler() {
      let userLink = prompt("Enter a URL");
      //if link has http then pass directly else add https
      if (!/http/i.test(userLink)) userLink = "http://" + userLink;
      document.execCommand("createLink", false, userLink);

      const elementos = document.querySelectorAll(`[href="${userLink}"]`);
      elementos.forEach(e => e.setAttribute("contentEditable", false))
      console.log(elementos);
    }

    function criarBotao(nomeIcone, comando, customHandler) {
      const botao = document.createElement("button");
      const icone = document.createElement("i");
      icone.classList.add("fa-solid");
      icone.classList.add(nomeIcone);

      botao.classList.add("botao");
      botao.appendChild(icone);
      botao.onclick =
        customHandler ||
        (() => {
          document.execCommand(comando);
        });
      return botao;
    }

    function criarDivider() {
      const divider = document.createElement("div");
      divider.classList.add("divider");

      return divider;
    }

    function criarSeletorTamanho() {
      function gerarOpcaoTamanho(tamanho) {
        const opcao = document.createElement("div");
        opcao.innerHTML = `Tamanho ${tamanho}`;
        opcao.classList.add("opcaoTamanho");
        opcao.onclick = () => {
          document.execCommand("fontSize", false, tamanho);
        };

        return opcao;
      }

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
      iconeChevron.style.fontSize = "8px";
      iconeChevron.style.marginLeft = "2px";

      const menuOpcoes = document.createElement("div");
      menuOpcoes.classList.add("menuOpcoesTamanho");

      for (let i = 1; i <= 7; i++) {
        menuOpcoes.appendChild(gerarOpcaoTamanho(i));
      }

      botao.appendChild(iconeFonte);
      botao.appendChild(iconeChevron);
      botao.addEventListener(
        "click",
        () =>
          (menuOpcoes.style.display =
            menuOpcoes.style.display === "none" ? "flex" : "none")
      );

      seletorTamanho.appendChild(botao);
      seletorTamanho.appendChild(menuOpcoes);

      return seletorTamanho;
    }

    function criarSeletorCor(iconeFa, comando) {
      const container = document.createElement("div");
      container.classList.add("inputCor");

      const seletorCor = document.createElement("input");
      seletorCor.setAttribute("type", "color");
      seletorCor.style = "position: absolute";

      const icone = document.createElement("i");
      icone.classList.add("fa-solid");
      icone.classList.add(iconeFa);

      seletorCor.oninput = ({ target }) =>
        document.execCommand(comando, false, target.value);

      container.appendChild(seletorCor);
      container.appendChild(icone);

      return container;
    }

    const editor = document.createElement("div");
    editor.classList.add("editor");

    editor.hidden = true;

    editor.appendChild(criarSeletorTamanho());
    editor.appendChild(criarDivider());
    editor.appendChild(criarBotao("fa-bold", "bold"));
    editor.appendChild(criarBotao("fa-italic", "italic"));
    editor.appendChild(criarBotao("fa-underline", "underline"));
    editor.appendChild(criarBotao("fa-strikethrough", "strikethrough"));
    editor.appendChild(criarDivider());
    editor.appendChild(criarBotao("fa-list-ol", "insertOrderedList"));
    editor.appendChild(criarBotao("fa-list", "insertUnorderedList"));
    editor.appendChild(criarDivider());
    editor.appendChild(criarSeletorCor("fa-droplet", "foreColor"));
    editor.appendChild(criarSeletorCor("fa-brush", "backColor"));
    editor.appendChild(criarDivider());
    editor.appendChild(criarBotao("fa-link", "createLink", clickLinkHandler));

    return editor;
  }

  function onChange() {
    if (handleChange) handleChange(input.innerHTML);
  }
};

window.onload = () => RichText("rich-text", () => {}, "bnanana");

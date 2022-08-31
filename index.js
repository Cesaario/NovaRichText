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

    editor.hidden = window.getSelection().toString().length === 0;
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

    const editor = document.createElement("div");
    editor.classList.add("editor");

    editor.hidden = true;

    editor.appendChild(criarBotao("fa-bold", "bold"));
    editor.appendChild(criarBotao("fa-italic", "italic"));
    editor.appendChild(criarBotao("fa-underline", "underline"));
    editor.appendChild(criarBotao("fa-strikethrough", "strikethrough"));

    return editor;
  }

  function onChange() {
    if (handleChange) handleChange(input.innerHTML);
  }
};

window.onload = () => RichText("rich-text", () => {}, "bnanana");

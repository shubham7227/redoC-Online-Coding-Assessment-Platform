const editorDiv = document.getElementById("editor");
const langSelect = document.getElementById("lang");
const inputField = document.getElementById("input");
const outputField = document.getElementById("output");
const questionDiv = document.getElementById("question");

var editor = CodeMirror(editorDiv, {
  lineNumbers: true,
  lineWrapping: true,
  mode: "clike",
  theme: "dracula",
  lint: true,
  indentUnit: 4,
  tabSize: 4,
  smartIndent: true,
  closeBrackets: true,
  value: "",
});

langSelect.onchange = () => {
  var toLang = langSelect.value;
  if (toLang == "java")
    toLang = "text/x-java";
  if (toLang == "python")
    toLang = "text/x-python";
  editor.setOption("mode", toLang)
}

const langMap = {
  python: "py",
  cpp: "cpp",
  java: "java"
};

async function run() {
  try {
    outputField.value = "Running...";
    var code = editor.getValue();
    var language = langSelect.value;
    var input = inputField.value;

    // checking if user is logged on or not
    var token = localStorage.getitem("token");
    if (!token)
      location.href = "/login.html";
    
    var response = await fetch(/*domain*/ + "/run", {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'token': token,
      },
      body: JSON.stringify({
        code,
        language: langMap[language],
        input,
      }),
    });

    var output = await response.json();
    if (output.error) {
      showError(output.error);
      return;
    }
    if (output.status == "1"
    )
  }
}


const editorDiv = document.getElementById("editor")
const langSelect = document.getElementById("lang")
const inputField = document.getElementById("input")
const outputField = document.getElementById("output")
const questionDiv = document.getElementById("question")
const msg = document.getElementById("msg")
const params = new URL(location.href).searchParams
const question_id = params.get("qid")

var domain = "//localhost:5000"

window.onload = async () => {
  try {
    const response = await fetch(`${domain}/question/${question_id}`, {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    })
    const problem = await response.json()
    questionDiv.innerHTML = `
      <h1 class="title">${problem.title}</h1>
      <pre class="description">${problem.description}</pre>
      <div class="info">
      <span>Difficulty: ${problem.difficulty}</span>
      </div>
      `
  } catch (e) {
    console.log(e)
  }
}

var editor = CodeMirror(document.querySelector(".editor"), {
  lineNumbers: true,
  lineWraping: true,
  mode: "clike",
  theme: "darcula",
  lint: true,
  indentUnit: 4,
  tabSize: 4,
  smartIndent: true,
  closeBrackets: true,
  value: "",
})

langSelect.onchange = () => {
  var toLang = langSelect.value
  if (toLang == "java") toLang = "text/x-java"
  if (toLang == "clike") toLang = "text/x-c++src"
  if (toLang == "python") toLang = "text/x-python"
  editor.setOption("mode", toLang)
}

const langMap = {
  python: "py",
  clike: "cpp",
  java: "java",
}

async function run() {
  try {
    var code = editor.getValue()
    var language = langSelect.value
    var input = inputField.value

    var response = await fetch(domain + "/run", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        code,
        language: langMap[language],
        input,
      }),
    })

    var op = await response.json()
    if (op.error) {
      showError(op.error)
      return
    }
    outputField.value = op.output
  } catch (e) {
    console.log(e)
  }
}

async function submit() {
  try {
    var code = editor.getValue()
    var language = langSelect.value
    outputField.value = "Running..."
    var response = await fetch(domain + "/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_id,
        code,
        language: langMap[language],
      }),
    })
    var op = await response.json()
    if (op.error) {
      showError(op.error)
      return
    }
    outputField.value = ""
    if (op.status == "0") msg.style.backgroundColor = "#caca6e"
    else if (op.status == "1") msg.style.backgroundColor = "#63d475"
    else msg.style.backgroundColor = "red"

    msg.textContent = op.message
  } catch (e) {
    outputField.value = "Oops! Something went wrong"
    console.log(e)
  }
}

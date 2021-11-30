const editorDiv = document.getElementById("editor")
const langSelect = document.getElementById("lang")
const inputField = document.getElementById("input")
const outputField = document.getElementById("output")
const questionDiv = document.getElementById("question")
// const params = new URL(location.href).searchParams
// const question = params.get("qid")
const question_id = 1
var domain = "//localhost:5000"

window.onload = async () => {
  try {
    const response = await fetch(domain + "/question.json", {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
    })
    const problem = await response.json()
    console.log(problem)
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

// async function run() {
//   try {
//     outputField.value = "Running..."
//     var code = editor.getValue()
//     var language = langSelect.value
//     var input = inputField.value

//     var response = await fetch(domain + "/run", {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify({
//         code,
//         language: langMap[language],
//         input,
//       }),
//     })

//     var output = await response.json()
//     if (output.error) {
//       showError(output.error)
//       return
//     }
//     outputField.value = output.output
//   } catch (e) {
//     console.log(e)
//   }
// }

// async function submit() {
//   try {
//     outputField.value = "Running..."
//     var code = editor.getValue()
//     var language = langSelect.value
//     var input = inputField.value

//     var response = await fetch(domain + "/submit", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         question,
//         code,
//         language: langMap[language],
//       }),
//     })
//     var output = await response.json()
//     outputField.value = output
//   } catch (e) {
//     outputField.value = "Oops! Something went wrong"
//     console.log(e)
//   }
// }

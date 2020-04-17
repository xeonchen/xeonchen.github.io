function createWord(word) {
  const url = word
    ? `https://eword.ntpc.edu.tw/char/${word}.jpg`
    : "https://eword.ntpc.edu.tw/刊頭.jpg";
  const img = document.createElement("img");
  img.src = url;

  return img;
}

function createPage(words, reverse) {
  const page = document.createElement("page");
  page.className = "justify-content-center";
  if (!reverse) {
    page.classList.add("flex-row-reverse");
  }

  page.appendChild(createWord());
  for (const w of words) {
    page.append(createWord(w));
  }

  return page;
}

function doUpdate() {
  const strWordsPerPage = document.getElementById("wordsPerPage").value;
  const wordsPerPage = parseInt(strWordsPerPage);

  const board = document.getElementById("board");
  let words = document.getElementById("words").value;

  const reverse = localStorage.getItem("left2right") === "true";

  // save user preferences
  localStorage.setItem("wordsPerPage", strWordsPerPage);
  localStorage.setItem("words", words);

  board.innerHTML = "";
  while (words.length) {
    let page = createPage(words.substr(0, wordsPerPage), reverse);
    board.appendChild(page);
    words = words.substr(wordsPerPage, words.length);
  }
}

function init() {
  let timer;

  // words
  const words = document.getElementById("words");
  const urlParams = new URLSearchParams(window.location.search);
  words.value =
    urlParams.get("w") || localStorage.getItem("words") || "生字練習簿";
  words.select();
  words.focus();

  words.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(doUpdate, 500);
  });

  // wordsPerPage
  const wordsPerPage = document.getElementById("wordsPerPage");
  wordsPerPage.value = localStorage.getItem("wordsPerPage") || "5";
  wordsPerPage.addEventListener("change", doUpdate);

  // left-to-right
  const left2right = document.getElementById("left2right");
  left2right.checked = localStorage.getItem("left2right") === "true";
  left2right.addEventListener("change", (event) => {
    document.querySelectorAll("#board > page").forEach((page) => {
      page.classList.toggle("flex-row-reverse");
      localStorage.setItem("left2right", event.target.checked);
    });
  });

  doUpdate();
}
document.addEventListener("DOMContentLoaded", init, false);

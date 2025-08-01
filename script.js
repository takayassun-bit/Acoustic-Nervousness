// script.js
const soundFiles = [
  "sound1.mp3",
  "sound2.mp3",
  "sound3.mp3",
  "sound4.mp3",
  "sound5.mp3",
  "sound6.mp3"
];

// それぞれ2回ずつ追加（ペア用に）
let audioPool = soundFiles.concat(soundFiles); // 長さ12

let firstCard = null;
let secondCard = null;
let lock = false;
let matchCount = 0;
let currentAudio = null;
let stopTimer = null;

// ランダムシャッフル
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 音を混ぜる
shuffle(audioPool);

// 各カードに音を割り当て（data-soundとして保存）
const cards = document.querySelectorAll(".card");
cards.forEach((card, index) => {
  card.dataset.sound = audioPool[index];
});

// カードクリック処理
cards.forEach(card => {
  card.addEventListener("click", () => {
    if (lock || card.classList.contains("matched")) return;
    if (matchCount === 4) {
        showHorrorEffect();
        return;
    }    

    // 一時的にロックして他のクリックを防ぐ
    lock = true;

    // カードを一時的に色変化
    card.classList.add("active");

    // 音を再生（前の音は停止）
    playSound(card.dataset.sound, () => {
      // 音の再生完了後にロック解除（またはマッチ処理へ）
      if (!firstCard) {
        firstCard = card;
        lock = false;
      } else {
        secondCard = card;

        if (firstCard.dataset.sound === secondCard.dataset.sound) {
          // マッチした場合の処理
          firstCard.classList.remove("active");
          secondCard.classList.remove("active");
          firstCard.classList.add("matched");
          secondCard.classList.add("matched");
          matchCount++;

          resetTurn();
        } else {
          setTimeout(() => {
            firstCard.classList.remove("active");
            secondCard.classList.remove("active");
            resetTurn();
          }, 1000);
        }
      }
    });
  });
});


// 音を再生（完了時に callback を呼ぶ）
function playSound(src, callback) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    clearTimeout(stopTimer);
  }

  currentAudio = new Audio(src);
  currentAudio.volume = 0.5; // 通常の音の音量
  currentAudio.play();

  // 5秒後に自動停止
  stopTimer = setTimeout(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (callback) callback(); // 5秒後にロック解除
  }, 5000);

  // 音が終わったら早く解除（5秒待たなくても）
  currentAudio.addEventListener("ended", () => {
    clearTimeout(stopTimer);
    currentAudio = null;
    if (callback) callback();
  });
}

// ホラー演出
function showHorrorEffect() {
  const wrapper = document.getElementById("horrorWrapper");
  const scream = new Audio("scream.mp3");
  wrapper.style.display = "flex";
  scream.volume = 1.0; // ホラー音の音量を上げる
  scream.currentTime = 0;
  scream.play();

  setTimeout(() => {
    wrapper.style.display = "none";

    // 質問とボタン表示
    document.getElementById("questionArea").style.display = "block";
  }, 3000);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

document.getElementById("yesBtn").addEventListener("click", () => {
  alert("プッ、驚いちゃって");
  const laugh = document.getElementById("laughSound");
  laugh.currentTime = 0;
  laugh.play();
});

document.getElementById("noBtn").addEventListener("click", () => {
  alert("強がっちゃって、素直になれないんですね。やれやれ、、、");
});
/*
document.getElementById("testButton").addEventListener("click", () => {
  showHorrorEffect();
});
*/

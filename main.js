// 게임 설정
let gameManager;         //게임 관리 객체 생성을 위한 전역 변수
let gameState = "init";  //게임 상태

function setup() {
  let startButton;

  createCanvas(900, 600);  // 캔버스 크기 설정
  background(230);
  gameManager = new GameManager();  // 게임 관리 인스턴스 생성

  // 시작 버튼 생성
  startButton = createButton("START");
  startButton.position(width/2 - 90 , height/2);

  // 버튼 스타일 설정
  startButton.style("background-color", "transparent"); // 배경 없애기
  startButton.style("border", "none");                  // 테두리 없애기
  startButton.style("color", "white");                  // 글자 색
  startButton.style("font-size", "48px");               // 글자 크기
  startButton.style("font-weight", "bold");             // 글자 두껍게
  startButton.style("text-shadow", "0px 0px 20px red"); // 그림자 효과

  // 게임 제목 설정
  textSize(50);
  textStyle(BOLD);
  fill(14, 105, 126);
  text("SSU TOWER DEFENSE", width/2 - 280, height/2- 30);

  // START 버튼 클릭 시
  startButton.mousePressed(() => {
    startButton.hide();
    clear();
    background(200);  // 배경색 설정

    setTimeout(() => {
      gameState = "ready";
    }, 100);
  });

}

function draw() {
  let gameButton;

  // 게임 준비(타워 위치 설정)
  if (gameState == "ready") {
    background(200);

    gameManager.pathDraw();  // 경로 그리기
    gameButton = createButton("START");
    gameButton.position(700, 550);
    gameButton.style("width", "190px");
    gameButton.style("height", "50px");
    gameButton.style("margin-left", "13px");

    gameButton.mousePressed(() => {
      // 게임 제한시간 카운트 시작
      gameManager.startTime = millis();
      gameState = "play";

    });
  }
  // 게임 시작(적들이 나오기 시작) 
  else if (gameState == "play") {
    background(200);
    
    gameManager.update();  // 게임 상태 업데이트 (적 생성, 타워 업데이트 등)
    gameManager.draw();  // 게임 화면 그리기 (적, 타워, 총알, 경로 등)

    // 게임 종료 체크 (남은 시간이 0 이하일 경우 또는 목숨이 0개일 경우)
    if (millis() - gameManager.startTime > gameManager.timeLimit * 1000 || gameManager.lives == 0) {
      gameState = "end";
    }
  }
  // 게임 종료(시간 초과 or 목숨 0개)
  else if (gameState == "end") {
    textSize(32);
    fill(255, 0, 0);  // 빨간색
    text("Game Over!", width / 2 - 130, height / 2);
  }

  if (gameState != "init") {
    fill(0);
    noStroke();
    rect(700, 0, 900, 600);
  }
}

// 마우스 클릭 시 타워를 설치
function mousePressed() {
  if (gameState === "ready" || gameState === "play") {
    if (mouseX > 800) return;   // 게임맵을 벗어나면 타워 못그리게 막기
    gameManager.handleTowerPlacement(mouseX, mouseY);  // 마우스 클릭 위치에 타워 배치
  }
}

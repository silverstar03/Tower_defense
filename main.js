// 게임 설정
let gameManager;         //게임 관리 객체 생성을 위한 전역 변수
let gameState = "init";  //게임 상태
let selectedTower;       //타워 종류 선택
let result;
let trackingBtn;
let fixedBtn;
let gameButton;
let descButton;

// 이미지 관련 변수들
let trackingTowerImg;
let fixedGunTowerImg;
let enemyImg;
let mapImg;
let mainImg;
let failImg;
let clearImg;
let baseImg;

// 이미지 로드
function preload() {
  mapImg = loadImage('./asset/map.png');
  trackingTowerImg = loadImage('./asset/tower_1_default.png');
  fixedGunTowerImg = loadImage('./asset/tower_2_long_range.png');
  enemyImg = loadImage('./asset/enemy.png');
  mainImg = loadImage('./asset/main.png');
  // mainImg = loadImage('./asset/start.png');
  failImg = loadImage('./asset/fail.png');
  clearImg  = loadImage('./asset/clear.png');
  baseImg = loadImage('./asset/tower_ssu.png');
}

// 메인 게임 시작 버튼 생성 함수
function createStartButton() {
  let startButton = createButton("");
  startButton.position(width/2 - 210, height/2 - 220);
  startButton.style("padding", "0");
  startButton.style("border", "none");
  startButton.style("background", "none");

  let startIcon = createImg('./asset/startBtn.png');
  startIcon.size(380, 330);
  startIcon.parent(startButton);

  startButton.mousePressed(() => {
    startButton.hide();
    descButton.hide();
    
    clear();
    background(200);  // 배경색 설정

    setTimeout(() => {
      // 타워 선택 버튼 생성
      createTowerSelectBtn();
      // 게임 시작 버튼 생성
      createGameButton();

      // 게임상태 변경
      gameState = "ready";
    }, 100);
  });
}

// 게임 설명 버튼 생성 함수
function createDescButton() {
  descButton = createButton("");
  descButton.position(700, 500);
  descButton.style("padding", "0");
  descButton.style("border", "none");
  descButton.style("background", "none");

  let descIcon = createImg('./asset/descBtn.png');
  descIcon.size(80, 80);
  descIcon.parent(descButton);

  descButton.mousePressed(() => {
    // 설명 창 띄우기
    console.log('설명창')
  });
}

function setup() {

  createCanvas(900, 600);  // 캔버스 크기 설정
  background(230);
  gameManager = new GameManager();  // 게임 관리 인스턴스 생성

  // 메인 이미지 로드
  imageMode(CENTER);
  image(mainImg, width/2, height/2, 900, 600);

  // 게임 시작 버튼 생성
  createStartButton();
  // 게임 설명 버튼 생성
  createDescButton();

}

// 타워 선택 버튼 생성 함수
function createTowerSelectBtn() {
  trackingBtn = createButton("");
  trackingBtn.position(750, 200);
  trackingBtn.style("padding", "0");
  trackingBtn.style("border", "none");
  trackingBtn.style("background", "none");

  let trackingIcon = createImg('./asset/tower_1_logo.png');
  trackingIcon.size(50, 50);
  trackingIcon.parent(trackingBtn);

  trackingBtn.mousePressed(() => {
    selectedTower = "tracking";
  });

  fixedBtn = createButton("");
  fixedBtn.position(810, 200);
  fixedBtn.style("padding", "0");
  fixedBtn.style("border", "none");
  fixedBtn.style("background", "none");
  
  let fixedIcon = createImg('./asset/tower_2_logo.png');
  fixedIcon.size(50, 50);
  fixedIcon.parent(fixedBtn);

  fixedBtn.mousePressed(() => {
    selectedTower = "fixed";
  });

}

// 게임 시작 버튼 생성 함수
function createGameButton() {
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

function draw() {
  
  // 게임 준비(타워 위치 설정)
  if (gameState == "ready") {
    imageMode(CORNER);
    image(mapImg, 0 , 0, 700, 600);

    gameManager.pathDraw();  // 경로 그리기
    
  }
  // 게임 시작(적들이 나오기 시작) 
  else if (gameState == "play") {
    imageMode(CORNER);
    image(mapImg, 0 , 0, 700, 600);
    
    gameManager.update();  // 게임 상태 업데이트 (적 생성, 타워 업데이트 등)
    gameManager.draw();    // 게임 화면 그리기 (적, 타워, 총알, 경로 등)

    // 시간이 0이 됐을 때 목숨이 남아있으면 클리어
    if (millis() - gameManager.startTime > gameManager.timeLimit * 1000 && gameManager.lives > 0) {
      gameState = "end";
      result = "clear";
    }
    // 목숨이 0개가 되면 실패
    else if (gameManager.lives == 0) {
      gameState = "end";
      result = "fail";
    }

    let base;
    let path = new Path();

    let end = path.points[path.points.length - 1];
    base = new Base(end.x, end.y);

    base.draw();
  }
  // 게임 종료(시간 초과 or 목숨 0개)
  else if (gameState == "end") {
    trackingBtn.remove();
    fixedBtn.remove();
    gameButton.remove();

    if (result == "fail") {
      imageMode(CORNER);
      image(failImg, 0, 0, 900, 600);
    } else if (result == "clear") {
      imageMode(CORNER);
      image(clearImg, 0, 0, 900, 600);
    }
  }

  if (gameState != "init" && gameState != "end") {
    fill(0);
    noStroke();
    rectMode(CORNER);
    rect(700, 0, 900, 600);
  }

  if (selectedTower == "tracking") {
    imageMode(CENTER);
    image(trackingTowerImg , mouseX, mouseY, 50, 50);
  } else if (selectedTower == "fixed") {
    imageMode(CENTER);
    image(fixedGunTowerImg , mouseX, mouseY, 50, 50);
  }
}

// 마우스 클릭 시 타워를 설치
function mousePressed() {
  if (gameState === "ready" || gameState === "play") {
    if (mouseX > 700) return;   // 게임맵을 벗어나면 타워 못그리게 막기)
    if (selectedTower) {
      gameManager.handleTowerPlacement(mouseX, mouseY, selectedTower);  // 마우스 클릭 위치에 타워 배치
      selectedTower = null;  // 타워 선택 초기화
    }
  }
}

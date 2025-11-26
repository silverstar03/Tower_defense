// 게임 설정
let gameManager;         //게임 관리 객체 생성을 위한 전역 변수
let gameState = "init";  //게임 상태
let selectedTower = null;       //타워 종류 선택
let result;
let trackingBtn;
let fixedBtn;
let gameButton;
let descButton;
let onPath;

// 이미지 관련 변수들
let mapImg;
let trackingTowerImg;
let fixedGunTowerImg;
let enemyImg;
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
  mainImg = loadImage('./asset/start.png');
  failImg = loadImage('./asset/fail.png');
  clearImg  = loadImage('./asset/clear.png');
  baseImg = loadImage('./asset/tower_ssu.png');
}

// 우클릭 메뉴 막기
document.oncontextmenu = function () {
  return false;
};

// 메인 -> 게임 시작 버튼 생성 함수
function createStartButton() {
  let startButton = createButton("");
  startButton.position(width/2 - 210, height/2 - 225);
  startButton.style("padding", "0");
  startButton.style("border", "none");
  startButton.style("background", "none");

  let startIcon = createImg('./asset/startBtn.png');
  startIcon.size(380, 345);
  startIcon.parent(startButton);

  startButton.mousePressed(() => {
    if (mouseButton === RIGHT) return;
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
  descButton.position(635, 500);
  descButton.style("padding", "0");
  descButton.style("border", "none");
  descButton.style("background", "none");

  let descIcon = createImg('./asset/descBtn.png');
  descIcon.size(250, 100);
  descIcon.parent(descButton);

  descButton.mousePressed(() => {
    // 설명 창 띄우기
    console.log('설명창')
  });
}

function setup() {
  let canvas = createCanvas(900, 600);  // 캔버스 크기 설정
  canvas.background(230);

  // 우클릭 기본 메뉴 막기
  canvas.elt.oncontextmenu = () => false;

  // 게임 관리 인스턴스 생성
  gameManager = new GameManager();

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
  trackingBtn.position(730, 455);
  trackingBtn.style("padding", "0");
  trackingBtn.style("border", "none");
  trackingBtn.style("background", "none");

  let trackingIcon = createImg('./asset/tower_1_logo.png');
  trackingIcon.size(50, 50);
  trackingIcon.parent(trackingBtn);

  trackingBtn.mousePressed(() => {
    if (mouseButton === RIGHT) return;
    selectedTower = "tracking";
  });

  fixedBtn = createButton("");
  fixedBtn.position(815, 455);
  fixedBtn.style("padding", "0");
  fixedBtn.style("border", "none");
  fixedBtn.style("background", "none");
  
  let fixedIcon = createImg('./asset/tower_2_logo.png');
  fixedIcon.size(50, 50);
  fixedIcon.parent(fixedBtn);

  fixedBtn.mousePressed(() => {
    if (mouseButton === RIGHT) return;
    selectedTower = "fixed";
  });

}

// 게임 시작 버튼 생성 함수
function createGameButton() {
  gameButton = createButton("");
  gameButton.position(710, 520);
  gameButton.style("padding", "0");
  gameButton.style("border", "none");
  gameButton.style("background", "none");

  let gameButtonIcon = createImg('./asset/startEngBtn.png');
  gameButtonIcon.size(170, 65);
  gameButtonIcon.parent(gameButton);

  gameButton.mousePressed(() => {
    if (mouseButton === RIGHT) return;
      // 게임 제한시간 카운트 시작
    gameManager.startTime = millis();
    gameState = "play";

  });
}

function draw() {
  // 마우스 위치 경로 위인지 확인
  onPath = gameManager.path.isOnPath(mouseX, mouseY);

  // 게임 준비(타워 위치 설정)
  if (gameState == "ready") {
    imageMode(CORNER);
    image(mapImg, 0 , 0, 900, 600);

    rectMode(CORNER);
    stroke(129,103,31);
    strokeWeight(5);
    fill(114, 155, 88);
    rect(695, 420, 190, 170, 15);

    stroke(60, 34, 0);
    fill(163, 99, 23);
    rect(710, 435, 70, 70, 15);
    rect(795, 435, 70, 70, 15);

    gameManager.pathDraw();  // 경로 그리기

    // 타워 설치 가능할 때만 마우스 커서에 이미지 붙이기
    if ( gameManager.towerCount > 0 && selectedTower != null) {
      // 범위 테두리 그림자 생성
      noStroke();
      fill(255, 90);
      
      // 설치 불가 영역 표시
      if (mouseX > 680 || mouseX < 150 || mouseY > 520 || onPath) {
        fill(255, 0, 0, 90);
      }

      if (selectedTower == "tracking") {
        ellipse(mouseX, mouseY, 200, 200); // 사거리 원 그리기
        imageMode(CENTER);
        image(trackingTowerImg , mouseX, mouseY, 50, 50);
      } else if (selectedTower == "fixed") {
        ellipse(mouseX, mouseY, 160, 160); // 사거리 원 그리기
        imageMode(CENTER);
        image(fixedGunTowerImg , mouseX, mouseY, 50, 50);
      }
    }

  }
  // 게임 시작(적들이 나오기 시작) 
  else if (gameState == "play") {
    imageMode(CORNER);
    image(mapImg, 0 , 0, 900, 600);
    trackingBtn.remove();
    fixedBtn.remove();
    gameButton.remove();
    
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

  // 게임 시작 시 
  if (gameState != "init" && gameState != "end") {   
    let base;
    let path = new Path();

    // 경로 마지막 가져오기
    let end = path.points[path.points.length - 1];
    // 경로의 마지막에 숭실대 타워 설치
    base = new Base(end.x, end.y);
    base.draw();
  }
}

// 마우스 클릭 시 타워를 설치
function mousePressed() {
  if (gameState === "ready") {

    // 마우스 좌클릭
    if(mouseButton === LEFT) {
      if (mouseX > 700 || mouseX < 150 || mouseY > 520 || onPath) return;   // 게임맵을 벗어나면 타워 못그리게 막기)
      if (selectedTower) {
        gameManager.handleTowerPlacement(mouseX, mouseY, selectedTower);  // 마우스 클릭 위치에 타워 배치
        selectedTower = null;  // 타워 선택 초기화
      }
    }

    // 마우스 우클릭
    else if (mouseButton === RIGHT) {
      // 타워 배열을 마지막 요소부터 탐색
      for (let i = gameManager.towers.length -1; i >= 0; i--) {
          let t = gameManager.towers[i];

          if (dist(mouseX, mouseY, t.pos.x, t.pos.y) < 25) {
            gameManager.towers.splice(i, 1); // 타워 삭제
            gameManager.towerCount++;        // 설치 가능 개수 복구
            break;
          }
      }
    }
  }
  
}

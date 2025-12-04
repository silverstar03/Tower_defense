// 게임 설정
let gameManager;         //게임 관리 객체 생성을 위한 전역 변수
let gameState = "init";  //게임 상태
let selectedTower = null;       //타워 종류 선택
let result;
let resultSound = false;

// 메인 UI 버튼
let descButton;
let onPath;
let startButton;
let infoButton;
let xBtn;
let returnBtn = null;

// 이미지 관련 변수들
let mapImg;
let trackingTowerImg;
let fixedGunTowerImg;
let enemyImg;
let mainImg;
let failImg;
let clearImg;
let baseImg;
let descPopupImg;
let infoPopupImg;

// 사운드 관련 변수들
let bgm;    // 배경음악
let clickBgm;  // 클릭 
let deathBgm;  // 적 죽을 때
let clearBgm;  // clear
let failBgm;   // fail
let hitBgm;    // 공격
let baseBgm;   // 기지공격 당할 때

// 첫 화면에 필요한 이미지 및 사운드 로드
function preload() {
  // 이미지 로드
  mainImg = loadImage('./asset/images/start.png');
  mapImg = loadImage('./asset/images/map.png');
  descPopupImg = loadImage('./asset/images/descPopup.png');
  infoPopupImg = loadImage('./asset/images/infoPopup.png');
  dmLogoImg = loadImage('./asset/images/dmLogo.png');

  // 사운드 로드
  clickBgm = loadSound('./asset/sounds/click_sound.mp3');
  bgm = loadSound('./asset/sounds/background_bgm.mp3');
  failBgm = loadSound('./asset/sounds/game_over_bgm.mp3');
}

function setup() {
  let canvas = createCanvas(900, 600);  // 캔버스 크기 설정
  canvas.background(230);

  clickBgm.setVolume(1.0);

  // 우클릭 기본 메뉴 막기
  canvas.elt.oncontextmenu = () => false;

  //메인화면 로드
  mainLoad();
}

// 메인 로드
function mainLoad() {
  // 메인 이미지 로드
  imageMode(CENTER);
  image(mainImg, width/2, height/2, 900, 600);

  // 게임 관리 인스턴스 생성
  gameManager = new GameManager();

  // 게임 시작 버튼 생성
  createStartButton();
  // 게임 설명 버튼 생성
  createDescButton();
  // 인포 팝업 버튼 생성
  createInfoButton();
  // 학과 로고 이미지 띄우기
  drawLogoImage();
}

// 메인 버튼 제거
function removeMainBtn() {
  clear();
  startButton.remove();
  descButton.remove();
  infoButton.remove();
}

// 우클릭 메뉴 막기
document.oncontextmenu = function () {
  return false;
};

// 게임 시작 후 필요한 리소스 로드
function loadResources() {
  // 이미지 로드
  trackingTowerImg = loadImage('./asset/images/tower_1_default.png');
  fixedGunTowerImg = loadImage('./asset/images/tower_2_long_range.png');
  enemyImg = loadImage('./asset/images/enemy.png');
  baseImg = loadImage('./asset/images/tower_ssu.png');
  failImg = loadImage('./asset/images/fail.png');
  clearImg  = loadImage('./asset/images/clear.png');

  // 사운드 로드
  deathBgm = loadSound('./asset/sounds/death_enemy.mp3');
  clearBgm = loadSound('./asset/sounds/game_clear_bgm.mp3');
  hitBgm = loadSound('./asset/sounds/hit_sound.mp3');
  baseBgm = loadSound('./asset/sounds/tower_fire_sound.mp3');
}

// 메인 -> 게임 시작 버튼 생성 함수
function createStartButton() {
  startButton = createButton("");
  startButton.position(width/2 - 180, height/2 - 110);
  startButton.style("padding", "0");
  startButton.style("border", "none");
  startButton.style("background", "none");

  let startIcon = createImg('./asset/images/startBtn.png');
  startIcon.size(300, 110);
  startIcon.parent(startButton);

  startButton.mousePressed(() => {
    if (mouseButton === RIGHT) return;
    removeMainBtn();
    background(200);  // 배경색 설정
    gameState = "ready";
    loadResources();
  });
}

// 게임 설명 버튼 생성 함수
function createDescButton() {
  descButton = createButton("");
  descButton.position(655, 510);
  descButton.style("padding", "0");
  descButton.style("border", "none");
  descButton.style("background", "none");

  let descIcon = createImg('./asset/images/descBtn.png');
  descIcon.size(230, 90);
  descIcon.parent(descButton);

  descButton.mousePressed(() => {
    if (mouseButton === RIGHT) return;
    popupLoad(descPopupImg);
  });
}

// 인포 팝업 버튼 생성 함수
function createInfoButton() {
  infoButton = createButton("");
  infoButton.position(845, 20);
  infoButton.style("padding", "0");
  infoButton.style("border", "none");
  infoButton.style("background", "none");

  let infoIcon = createImg('./asset/images/info.png');
  infoIcon.size(50, 50);
  infoIcon.parent(infoButton);

  infoIcon.mousePressed(() => {
    if (mouseButton === RIGHT) return;
    popupLoad(infoPopupImg);
  });
}

// 팝업 로드 함수
function popupLoad(popupImg) {
  startButton.remove();
  imageMode(CENTER);
  image(popupImg, width/2, height/2, 700, 420);

  createXBtn();
}

// 팝업 닫는 버튼 생성 함수
function createXBtn() {
  xBtn = createButton("");
  xBtn.position(720, 430);
  xBtn.style("padding", "0");
  xBtn.style("border", "none");
  xBtn.style("background", "none");

  let xBtnIcon = createImg('./asset/images/xBtn.png');
  xBtnIcon.size(50, 50);
  xBtnIcon.parent(xBtn);

  xBtn.mousePressed(() => {
    if (mouseButton === RIGHT) return;
    xBtn.remove();
    removeMainBtn();
    mainLoad();
  });
}

function draw() {
  // 마우스 위치 경로 위인지 확인
  onPath = gameManager.path.isOnPath(mouseX, mouseY);

  // 게임 준비(타워 위치 설정)
  if (gameState == "ready") {
    gameManager.readyDraw();  // 경로 그리기

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
    gameManager.update();  // 게임 상태 업데이트 (적 생성, 타워 업데이트 등)
    gameManager.draw();    // 게임 화면 그리기 (적, 타워, 총알, 경로 등)

    // 시간이 0이 됐을 때 목숨이 남아있으면 클리어
    if (gameManager.getRemainingTime() <= 0 && gameManager.lives > 0) {
      gameState = "end";
      result = "clear";
    }
    // 목숨이 0개가 되면 실패
    if (gameManager.lives == 0) {
      gameState = "end";
      result = "fail";
    }
  }
  // 게임 종료(시간 초과 or 목숨 0개)
  else if (gameState == "end") {
    // 결과 화면 보여주는 함수 호출
    drawEndScreen();
  }

}

// 결과 화면 보여주는 함수
function drawEndScreen() {
  bgm.stop();
  imageMode(CORNER);
  if (!resultSound) {
    if (result == "fail") {
      image(failImg, 0, 0, 900, 600);
      failBgm.play();
    } else if (result == "clear") {
      image(clearImg, 0, 0, 900, 600);
      clearBgm.play();
    }
  }
  resultSound = true;

  // 메인으로 돌아가기 버튼
  createReturnButton();
  // 학과 로고 이미지
  drawLogoImage();
}

// 메인화면으로 돌아가기 버튼 생성 함수
function createReturnButton() {
  if (returnBtn) return;

  returnBtn = createButton("");
  returnBtn.position(710, 520);
  returnBtn.style("padding", "0");
  returnBtn.style("border", "none");
  returnBtn.style("background", "none");

  let returnBtnIcon = createImg('./asset/images/return_main.png');
  returnBtnIcon.size(170, 65);
  returnBtnIcon.parent(returnBtn);

  returnBtn.mousePressed(() => {
    if (mouseButton === RIGHT) return;

    failBgm.stop();
    clearBgm.stop();

    // 버튼 제거 및 null 처리
    if (returnBtn) {
      returnBtn.remove();
      returnBtn = null;
    }

    gameState = "init";

    clear();
    mainLoad();
  });
}

// 학과 로고 이미지 띄우기
function drawLogoImage() {
  imageMode(CORNER);
  image(dmLogoImg, 15, 15, 70, 34);
}

// 마우스 클릭 시 타워를 설치
function mousePressed() {
  clickBgm.play();

  if (gameState !== "ready") return;

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
        selectedTower = null;
        break;
      }
    }
  }
  
}

// 웹브라우저 비활성화 시 시간 정비 이벤트
document.addEventListener("visibilitychange", () => {
  if (!gameManager) return;

  if (document.hidden) {
    // 비활성화 시 경과 시간 누적
    gameManager.activeElapsed += (millis() - gameManager.lastActiveTime) / 1000;
    gameManager.gameActive = false;

  } else {
    // 다시 활성화 시 기준점 갱신
    gameManager.lastActiveTime = millis();
    gameManager.gameActive = true;
  }
});

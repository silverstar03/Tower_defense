// 게임의 전반적인 흐름과 상태를 관리하는 클래스
class GameManager {
  constructor() {
    // 플레이 타임 제한 - 1분 30초
    this.timeLimit = 90;  // 게임 시간 제한 (초 단위)

    this.lives = 5;     // 플레이어 목숨
    this.towerCount = 3;
    this.towerCount = constrain(this.towerCount, 0, 3); // 타워 개수 3개로 임의 지정

    this.gameBtn = null;

    this.trackingBtn = null;  // 타워 버튼
    this.fixedBtn = null;     // 타워 버튼

    this.enemies = [];  // 적들을 저장할 배열
    this.towers = [];   // 타워들을 저장할 배열
    this.bullets = [];  // 총알들을 저장할 배열

    this.spawnInterval = 1.3; // 적 생성 주기 (초 단위)
    this.lastSpawn = 0;        // 마지막 적 생성 시간 기록

    this.path = new Path();    // 적이 이동할 경로

    this.activeElapsed = 0;    // 게임창이 활성화 된 시간 누적 값
    this.lastActiveTime = 0;   // 마지막으로 창이 활성화 된 시간
    this.gameActive = true;    // 현재 웹브라우저 활성화 여부
  }

  // 제한 시간에서 웹브라우저 활성화 시간 뺀 값 측정
  getRemainingTime() {
    // 누적된 시간
    let currentElapsed = this.activeElapsed;

    // 현재 창이 활성화 상태면 추가 누적
    if (this.gameActive) {
      currentElapsed += (millis() - this.lastActiveTime) / 1000;
    }

    // 제한 시간에서 경과 시간 뺀 값이 0보다 작아지지 않게 하기
    return max(0, this.timeLimit - currentElapsed);
  }

  // 실제 게임 활성화 시간 반환
  getActiveElapsedTime() {
    // 누적된 시간
    let elapsed = this.activeElapsed;

    // 현재 창이 활성화 상태면 추가 누적
    if (this.gameActive) {
      elapsed += (millis() - this.lastActiveTime) / 1000;
    }

    // 실제 게임 활성화 시간 반환
    return elapsed;
  }

  // 게임 전체 상태를 업데이트하는 메서드
  update() {
    this.spawnEnemies();  // 주기적으로 적 생성
    this.updateEnemies(); // 적들의 상태 업데이트
    this.updateTowers();  // 타워들의 상태 업데이트
    this.updateBullets(); // 총알들의 상태 업데이트
    this.checkEnemies();  // 적이 경로 끝에 도달했는지 체크
  }

  // 게임 시작 전 타워 설정하는 메서드
  readyDraw() {
    this.path.draw();       // 경로 그리기
    this.drawTowers();      // 타워 그리기
    this.drawTowerCount();  // 설치 가능 타워 개수 화면에 그리기
    this.drawbase();        // 숭실대 타워 그리기
    this.drawBtnBg();
    this.drawTowersBtn();   // 타워 설치 버튼 그리기
    this.drawGameBtn();     // 게임 버튼 그리기
  }

  // 게임 전체를 화면에 그리는 메서드
  draw() {
    this.path.draw();
    this.drawTowers();  // 타워들을 화면에 그리기
    this.drawTimer();   // 남은 시간 표시
    this.drawLives();   // 남은 목숨 표시

    this.drawEnemies(); // 적들을 화면에 그리기
    this.drawBullets(); // 총알들을 화면에 그리기
    this.drawbase();    // 숭실대 타워 그리기
  }

  // 남은 시간 표시
  drawTimer() {
    noStroke();    // 글자 테두리 없애기
    fill(255);     // 글자 색을 흰색으로 설정
    textSize(30);  // 글자 크기 설정
    textFont('Nanum Gothic');
    let t = floor(this.getRemainingTime()); // 남은 시간 계산
    if (t < 0) {
        t = 0;
    }
    text(`⏱️: ${t}초`, 10, 40);  // 화면에 남은 시간 텍스트 표시
  }

  // 주기적으로 적을 생성하는 메서드
  spawnEnemies() {
    // 남은 시간 측정
    let remainingTime = this.getRemainingTime();
    // 제한시간이 끝나면 적 생성 안함
    if (remainingTime <= 0) return;

    // 실제 게임한 시간 측정
     let gameTime = this.getActiveElapsedTime();

    // 일정 주기마다 적을 생성
    if (gameTime - this.lastSpawn >= this.spawnInterval) {
      this.enemies.push(new Enemy(this.path));  // 적을 생성하고 경로를 할당
      this.lastSpawn = gameTime;  // 마지막 생성 시간을 갱신
    }
  }

  // 적들의 상태를 업데이트하는 메서드
  updateEnemies() {
    for (let e of this.enemies) {
      e.update();  // 각 적의 상태 업데이트 (이동, 데미지 등)
    }
    // 화면 밖으로 나가거나 죽은 적 제거
    this.enemies = this.enemies.filter(e => !e.dead);
  }

  // 화면에 적들을 그리는 메서드
  drawEnemies() {
    for (let e of this.enemies) {
      e.draw();  // 각 적을 화면에 그리기
    }
  }

  // 타워들의 상태를 업데이트하는 메서드
  updateTowers() {
    for (let t of this.towers) {
      t.update(this.enemies, this.bullets);  // 타워 상태 업데이트 (발사, 적 탐지 등)
    }
  }

  // 타워 설치 & 시작 버튼 밑에 도형 그리는 메서드
  drawBtnBg() {
    rectMode(CORNER);
    stroke(129,103,31);
    strokeWeight(5);
    fill(114, 155, 88);
    rect(695, 420, 190, 170, 15);

    stroke(60, 34, 0);
    fill(163, 99, 23);
    rect(712, 435, 70, 70, 15);
    rect(795, 435, 70, 70, 15);
  }

  // 게임 시작 버튼 생성 메서드
  drawGameBtn() {
    if(this.gameBtn) return;

    this.gameBtn = createButton("");
    this.gameBtn.position(710, 520);
    this.gameBtn.style("padding", "0");
    this.gameBtn.style("border", "none");
    this.gameBtn.style("background", "none");

    let gameBtnIcon = createImg('./asset/images/startEngBtn.png');
    gameBtnIcon.size(170, 65);
    gameBtnIcon.parent(this.gameBtn);

    this.gameBtn.mousePressed(() => {
      if (mouseButton === RIGHT) return;

      this.removeTowerBtn();
      this.gameBtn.remove();
      this.gameBtn = null;

      // 게임 시작
      gameState = "play";
      bgm.setVolume(0.3); //사운드 크기 지정
      bgm.loop(); // bgm 반복 재생
      this.startTime = millis();
      this.lastActiveTime = millis();
      this.activeElapsed = 0;
      this.gameActive = true;
    });
  }

  // 타워 설치 버튼 생성 메서드
  drawTowersBtn() {
    if(this.trackingBtn && this.fixedBtn) return;
    
    this.trackingBtn = createButton("");
    this.trackingBtn.position(730, 455);
    this.trackingBtn.style("padding", "0");
    this.trackingBtn.style("border", "none");
    this.trackingBtn.style("background", "none");

    let trackingIcon = createImg('./asset/images/tower_1_logo_new.png');
    trackingIcon.size(50, 50);
    trackingIcon.parent(this.trackingBtn);

    this.trackingBtn.mousePressed(() => {
      if (mouseButton === RIGHT) return;
      selectedTower = "tracking";
    });
    
    this.fixedBtn = createButton("");
    this.fixedBtn.position(813, 455);
    this.fixedBtn.style("padding", "0");
    this.fixedBtn.style("border", "none");
    this.fixedBtn.style("background", "none");
    
    let fixedIcon = createImg('./asset/images/tower_2_logo_new.png');
    fixedIcon.size(50, 50);
    fixedIcon.parent(this.fixedBtn);

    this.fixedBtn.mousePressed(() => {
      if (mouseButton === RIGHT) return;
      selectedTower = "fixed";
    });
  }

  removeTowerBtn() {
    if (this.trackingBtn) {
      this.trackingBtn.remove();
      this.trackingBtn = null;
    }

    if (this.fixedBtn) {
      this.fixedBtn.remove();
      this.fixedBtn = null;
    }    
  }

  // 화면에 타워들을 그리는 메서드
  drawTowers() {
    for (let t of this.towers) {
        t.draw();  // 각 타워를 화면에 그리기
    }
  }

  // 총알들의 상태를 업데이트하는 메서드
  updateBullets() {
    for (let b of this.bullets) {
      // FixedBullet이면 enemies 배열 전달
      if (b instanceof FixedBullet) {
        b.update(this.enemies);
      } else {
        b.update(); // TrackingBullet 등 기존 총알은 그대로
      }
    }
    // 죽은 총알 제거
    this.bullets = this.bullets.filter(b => !b.dead);
  }

  // 화면에 총알들을 그리는 메서드
  drawBullets() {
    for (let b of this.bullets) {
      b.draw();  // 각 총알을 화면에 그리기
    }
  }

  // 사용자가 클릭한 위치에 타워를 설치하는 메서드
  handleTowerPlacement(x, y, type) {
    this.towerCount--;

    // 남은 타워 없으면 설치 불가
    if (this.towerCount < 0) {
      return;
    }

        // type에 따라 다른 클래스 생성
    if (type === "tracking") {
        this.towers.push(new TrackingTower(x, y));
    } else if (type === "fixed") {
        this.towers.push(new FixedGunTower(x, y));
    }
  }

  // 적이 경로의 끝까지 갔는지 체크하는 메서드
  checkEnemies() {
    for (let e of this.enemies) {
        if (!e.dead && e.targetIndex >= this.path.points.length) {
            this.lives -= 1;
            e.dead = true;
            baseBgm.play();
        }
    }

    // 화면 밖으로 나간 적 제거
    this.enemies = this.enemies.filter(e => !e.dead);
  }

  // 화면에 남은 목숨 그려주는 메서드
  drawLives() {
    fill(255);
    textSize(30);
    text(`❤️ X ${this.lives}`, width - 120, 40);
  }

  // 화면에 설치 가능 타워 개수 그려주는 메서드
  drawTowerCount() {
    noStroke();
    imageMode(CORNER);
    image(trackingTowerImg, width - 135, 15, 30, 30);
    image(fixedGunTowerImg, width - 110, 15, 30, 30);
    fill(255);
    textFont('Spoqa Han Sans');
    textSize(30);
    text(`X ${this.towerCount}`, width - 70, 40);
  }
  
  // 숭실대 타워 설치 메서드
  drawbase () {
    let base;
    // 경로 마지막 가져오기
    let end = this.path.points[this.path.points.length - 1];
    // 경로의 마지막에 숭실대 타워 설치
    base = new Base(end.x, end.y);
    base.draw();
  }
}

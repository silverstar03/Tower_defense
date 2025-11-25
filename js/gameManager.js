// 게임의 전반적인 흐름과 상태를 관리하는 클래스
class GameManager {
  constructor() {
    // 플레이 타임 제한 - 1분 30초
    this.timeLimit = 90;  // 게임 시간 제한 (초 단위)

    this.lives = 5;     // 플레이어 목숨
    this.towerCount = 3; // 타워 개수 3개로 임의 지정

    this.enemies = [];  // 적들을 저장할 배열
    this.towers = [];   // 타워들을 저장할 배열
    this.bullets = [];  // 총알들을 저장할 배열

    this.spawnInterval = 1300; // 적 생성 주기 (밀리초 단위)
    this.lastSpawn = 0;        // 마지막 적 생성 시간 기록

    this.path = new Path();    // 적이 이동할 경로
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
  pathDraw() {
    this.path.draw();   // 경로를 화면에 그리기
    this.drawTowers();  // 타워들을 화면에 그리기
  }

  // 게임 전체를 화면에 그리는 메서드
  draw() {
    this.path.draw();
    this.drawTowers();  // 타워들을 화면에 그리기
    this.drawTimer();   // 남은 시간 표시
    this.drawLives();   // 남은 목숨 표시

    this.drawEnemies(); // 적들을 화면에 그리기
    this.drawBullets(); // 총알들을 화면에 그리기
  }

  // 남은 시간 표시
  drawTimer() {
    noStroke();    // 글자 테두리 없애기
    fill(255);     // 글자 색을 흰색으로 설정
    textSize(20);  // 글자 크기 설정
    let t = floor(this.timeLimit - (millis() - this.startTime) / 1000); // 남은 시간 계산
    if (t < 0) {
        t = 0;
    }
    text(`남은 시간: ${t}초`, 20, 30);  // 화면에 남은 시간 텍스트 표시
  }

  // 주기적으로 적을 생성하는 메서드
  spawnEnemies() {
    let remainingTime = this.timeLimit - (millis() - this.startTime) / 1000;

    // 제한시간이 끝나면 적 생성 안함
    if (remainingTime <= 0) return;

    // 일정 주기마다 적을 생성
    if (millis() - this.lastSpawn > this.spawnInterval) {
      this.enemies.push(new Enemy(this.path));  // 적을 생성하고 경로를 할당
      this.lastSpawn = millis();  // 마지막 생성 시간을 갱신
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
      this.towerCount = 0;
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
        }
    }

    // 화면 밖으로 나간 적 제거
    this.enemies = this.enemies.filter(e => !e.dead);
  }

  // 화면에 남은 목숨 그려주는 메서드
  drawLives() {
    fill(255);
    textSize(20);
    text(`목숨 : ${this.lives}`, width - 80, 30);
  }
}

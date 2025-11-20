class Tower {
  constructor(x, y) {
    this.pos = createVector(x, y);  // 타워 위치
    this.range = 100;               // 사거리
    this.fireRate = 1000;           // 발사 간격
    this.lastShot = 0;              // 마지막 발사 시간 기록
  }

  // 발사 가능한 상태인지 체크
  canShoot() {
    return millis() - this.lastShot > this.fireRate;
  }
}

// 적을 따라가는 타워
class TrackingTower extends Tower {
  constructor(x, y) {
    super(x, y);
    this.type = "tracking"; // 타입 구분
  }

  update(enemies, bullets) {
    let target = null;
    for (let e of enemies) {
      if (!e.dead) {
        let d = p5.Vector.dist(this.pos, e.pos);
        if (d < this.range) {
          target = e;
          break;
        }
      }
    }

    // 타겟이 있고 발사 가능하면 추적 총알 발사
    if (this.target && this.canShoot()) {
      bullets.push(new TrackingBullet(this.pos.x, this.pos.y, this.target)); 
      this.lastShot = millis(); // 발사 시간 갱신
    }
  }

  draw() {
    fill(0, 200, 255); // 파란색 원
    ellipse(this.pos.x, this.pos.y, 30, 30);
  }
}

// 적을 따라가지 않는 타워
class FixedGunTower extends Tower {
  constructor(x, y) {
    super(x, y);
    this.type = "fixed"; // 타입 식별용
  }

  update(enemies, bullets) {
    let target = null;

    // 사거리 내 적이 있는지 확인
    for (let e of enemies) {
      let d = p5.Vector.dist(this.pos, e.pos);
      if (!e.dead && d < this.range) {
        target = e; // 첫 번째로 발견된 적만 공격
        break;
      }
    }

    if (target && this.canShoot()) {
      // 8방향으로 총알 발사
      let angles = [0, 45, 90, 135, 180, 225, 270, 315]; // degree
      for (let a of angles) {
          let rad = radians(a);
          let dir = createVector(cos(rad), sin(rad)); // 단위 벡터
          bullets.push(new ShortBullet(this.pos.x, this.pos.y, dir));
      }
      this.lastShot = millis();
    }
  }

  draw() {
    fill(255, 150, 0); // 주황색 사각형
    rect(this.pos.x - 15, this.pos.y - 15, 30, 30);
  }
}
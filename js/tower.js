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
    if (target && this.canShoot()) {
      bullets.push(new TrackingBullet(this.pos.x, this.pos.y, target)); 
      this.lastShot = millis(); // 발사 시간 갱신
    }
  }

  draw() {
    imageMode(CENTER); // 중심 기준으로 그림
    image(trackingTowerImg, this.pos.x, this.pos.y, 50, 50);
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
        target = e;
        break;
      }
    }

    if (target && this.canShoot()) {
      let angles = [0, 45, 90, 135, 180, 225, 270, 315]; // 총알 8개

      for (let a of angles) {
          let rad = radians(a);
          let dir = createVector(cos(rad), sin(rad)); // 단위 벡터
          bullets.push(new FixedBullet(this.pos.x, this.pos.y, dir));
      }

      // 발사 시간 갱신
      this.lastShot = millis();
    }
  }

  draw() {
    imageMode(CENTER); // 중심 기준으로 그림
    image(fixedGunTowerImg, this.pos.x, this.pos.y, 50, 50);
  }
}
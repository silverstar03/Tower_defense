// 타워를 관리하는 클래스
class Tower {
  constructor(x, y) {
    this.x = x;  // 타워의 x 좌표
    this.y = y;  // 타워의 y 좌표
    this.fireRate = 1100;  // 발사 간격 (밀리초 단위)
    this.lastShot = 0;  // 마지막 발사 시간
    this.range = 130;   // 타워의 사거리
  }

  // 사거리 내 적을 확인하고 발사하는 메서드
  update(enemies, bullets) {
    // 발사 간격이 지나지 않았으면 리턴 (발사 주기 체크)
    if (millis() - this.lastShot < this.fireRate) return;

    // 사거리 내 가장 가까운 적 찾기
    let target = this.findTarget(enemies);
    if (target) {
      // 적을 타겟으로 총알 발사
      bullets.push(new Bullet(this.x, this.y, target));
      this.lastShot = millis();  // 마지막 발사 시간 갱신
    }
  }

  // 가장 가까운 적을 찾는 메서드
  findTarget(enemies) {
    let nearest = null;  // 가장 가까운 적
    let minD = Infinity;  // 최소 거리 (처음에는 매우 큰 값으로 설정)

    // 가장 가까운 적을 찾기
    for (let e of enemies) {
      let d = dist(this.x, this.y, e.pos.x, e.pos.y);  // 타워와 적의 거리 계산
      if (d < this.range && d < minD) {  // 범위 내에서 가장 가까운 적 찾기
        nearest = e;
        minD = d;  // 최소 거리 갱신
      }
    }
    return nearest;  // 가장 가까운 적 반환
  }

  // 타워를 화면에 그리는 메서드
  draw() {
    fill(120, 180, 255);  // 타워 색상 (밝은 파란색)
    rect(this.x - 15, this.y - 15, 30, 30);  // 사각형 형태로 타워 그리기
  }
}

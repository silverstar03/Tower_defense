// fixedBullet 관리 클래스
class FixedBullet {
  constructor(x, y, direction) {
    this.startPos = createVector(x, y);  // 시작 위치 기록
    this.pos = createVector(x, y);       // 총알 위치
    this.dir = direction.copy();         // 발사 방향 (고정)
    this.speed = 4;                      // 이동 속도 (작을수록 느려짐)
    this.dead = false;                   // 총알 제거 여부
    this.damage = 20;                    // 총알 데미지
    this.radius = 15;                    // 충돌 범위
    this.maxDistance = 80;               // 최대 이동 거리
  }

  // 총알 이동 및 적과 충돌 처리
  update(enemies) {
    // 방향 * 속도로 이동
    this.pos.add(p5.Vector.mult(this.dir, this.speed));

    // 시작 위치에서 얼마나 이동했는지 계산
    let traveled = p5.Vector.dist(this.startPos, this.pos);
    if (traveled >= this.maxDistance) {
      this.dead = true; // 최대 이동거리 도달하면 총알 소멸
      return;
    }

    // 적과 충돌 체크
    for (let e of enemies) {
      if (!e.dead && dist(this.pos.x, this.pos.y, e.pos.x, e.pos.y) < this.radius) {
        e.takeDamage(this.damage);  // 적에게 데미지 적용
        this.dead = true;           // 총알 소멸
        break;                      // 한 번 충돌 후 종료
      }
    }
  }

  // 총알 화면에 그리기
  draw() {
    fill(255, 200, 0);  // 색상
    circle(this.pos.x, this.pos.y, 8); // 원으로 표시
  }
}

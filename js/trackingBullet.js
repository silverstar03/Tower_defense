// trakingBullet 관리 클래스
class TrackingBullet {
  constructor(x, y, target) {
    this.startPos = createVector(x, y); // 시작 위치 기록
    this.pos = createVector(x, y);      // 총알 위치
    this.target = target;               // 타겟
    this.speed = 4;                     // 이동 속도
    this.dead = false;                  // 총알이 죽었는지 여부
    this.damage = 20;                   // 총알의 데미지
    this.radius = 10;                   // 충돌 범위
    this.maxDistance = 100;             // 최대 이동 거리
  }

  // 적을 향해 이동하고 타격하는 메서드
  update() {
    if (this.target.dead) {  // 타겟이 죽으면 총알도 죽음
      this.dead = true;
      return;
    }

    // 시작 위치에서 얼마나 이동했는지 계산
    let traveled = p5.Vector.dist(this.startPos, this.pos);
    if (traveled >= this.maxDistance) {
      this.dead = true; // 최대 이동거리 도달하면 총알 소멸
      return;
    }

    // 타겟 방향으로 이동
    let dir = p5.Vector.sub(this.target.pos, this.pos).normalize();  // 타겟과의 방향 벡터 계산
    this.pos.add(dir.mult(this.speed));  // 타겟 방향으로 총알 이동

    // 타겟에 도달하면 타격
    if (dist(this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y) < this.radius) {
      this.target.takeDamage(this.damage);  // 타겟에게 데미지 주기
      this.dead = true;  // 총알 사망 처리
    }
  }

  // 총알 화면에 그리기
  draw() {
    fill(255, 255, 0);  // 색상
    circle(this.pos.x, this.pos.y, 8);  // 총알 모양
  }
}

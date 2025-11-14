// 총알을 관리하는 클래스
class Bullet {
  constructor(x, y, target) {
    this.pos = createVector(x, y);  // 총알의 시작 위치
    this.target = target;           // 총알의 타겟 (적 객체)
    this.speed = 5;                 // 총알의 이동 속도
    this.dead = false;              // 총알이 죽었는지 여부
    this.damage = 20;               // 총알의 데미지
  }

  // 적을 향해 이동하고 타격하는 메서드
  update() {
    if (this.target.dead) {  // 타겟이 죽으면 총알도 죽음
      this.dead = true;
      return;
    }

    // 타겟 방향으로 이동
    let dir = p5.Vector.sub(this.target.pos, this.pos).normalize();  // 타겟과의 방향 벡터 계산
    this.pos.add(dir.mult(this.speed));  // 타겟 방향으로 총알 이동

    // 타겟에 도달하면 타격
    if (dist(this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y) < 10) {
      this.target.takeDamage(this.damage);  // 타겟에게 데미지 주기
      this.dead = true;  // 총알 사망 처리
    }
  }

  // 총알을 화면에 그리는 메서드
  draw() {
    fill(255, 255, 0);  // 총알의 색상을 노란색으로 설정
    circle(this.pos.x, this.pos.y, 8);  // 총알을 원 모양으로 그리기
  }
}

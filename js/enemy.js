// 적을 관리하는 클래스
class Enemy {
  constructor(path) {
    this.path = path;      // 적이 이동할 경로 (Path 클래스 인스턴스)
    this.pos = createVector(path.points[0].x, path.points[0].y);  // 경로의 첫 번째 지점에서 시작
    this.speed = 2.5;      // 적의 이동 속도
    this.maxHp = 50;       // 적의 처음 체력
    this.hp = this.maxHp;  // 적의 현재 체력
    this.targetIndex = 1;  // 경로에서 현재 목표 지점의 인덱스
    this.dead = false;     // 적이 죽었는지 여부 (초기값은 살아 있음)
  }

  // 경로를 따라 이동하는 메서드
  update() {
    if (this.dead) return;  // 적이 죽었으면 이동하지 않음

    // 현재 목표 지점
    let target = this.path.points[this.targetIndex];
    // 목표 지점 방향 계산 (현재 위치와 목표 지점의 차이 벡터)
    let dir = createVector(target.x - this.pos.x, target.y - this.pos.y).normalize();
    this.pos.add(dir.mult(this.speed));  // 목표 지점 방향으로 이동

    // 목표 지점에 도달하면 다음 포인트로 이동
    if (dist(this.pos.x, this.pos.y, target.x, target.y) < 5) {
      this.targetIndex++;
    }
  }

  // 적이 데미지를 입을 때 호출되는 메서드
  takeDamage(dmg) {
    this.hp -= dmg;  // 체력에서 데미지만큼 차감
    if (this.hp <= 0) this.dead = true;  // 체력이 0 이하가 되면 적이 죽음
  }

  // 적을 화면에 그리는 메서드
  draw() {
    imageMode(CENTER); // 중심 기준으로 그림
    image(enemyImg, this.pos.x, this.pos.y, 50, 50);

    // 게이지 바 그리기
    this.drawHpBar();
  }

  drawHpBar() {
    // HP 바 배경
    fill(255, 0, 0);
    rect(this.pos.x - 25, this.pos.y - 40, 50, 4);

    // HP 바 채워진 부분
    fill(0, 255, 0);
    let hpWidth = (this.hp / this.maxHp) * 50;
    rect(this.pos.x - 25, this.pos.y - 40, hpWidth, 4);
  }
}

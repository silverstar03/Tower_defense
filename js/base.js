// 최종 기지 클래스
class Base {
  constructor(x, y) {
    this.pos = createVector(x, y); // 기지의 중심 위치를 저장하는 벡터 (x, y)
    this.hp = 200;                 // 기지의 전체 체력(초기값)
    this.size = 130;                // 기지의 화면에 그릴 크기(정사각형의 한 변 길이)
  }

  draw() {
    fill(100, 200, 255);           // 기지의 배경 색상 설정 (청록 계열)
    imageMode(CENTER);              // 사각형을 중심 좌표 기준으로 그리도록 설정
    image(baseImg, this.pos.x, this.pos.y, this.size, this.size); // 기지 본체(정사각형) 그리기
  }
}
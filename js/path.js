// 적이 이동할 경로를 정의하는 클래스
class Path {
  constructor() {
    // 적이 이동할 경로의 포인트를 정의
    this.points = [
      { x: 0, y: 200 },   // 경로 시작점
      { x: 300, y: 200 }, // 두 번째 지점
      { x: 300, y: 500 }, // 세 번째 지점
      { x: 700, y: 500 }, // 경로 끝 지점
    ];
  }

  // 경로를 화면에 그리는 메서드
  draw() {
    stroke(100);
    strokeWeight(20);
    noFill(); 

    beginShape();  // 경로 시작
    for (let p of this.points) {  // 경로의 각 지점에 대해
      vertex(p.x, p.y);  // 해당 지점으로 선을 그음
    }
    endShape();  // 경로 끝
  }
}
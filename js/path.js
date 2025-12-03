// 적이 이동할 경로를 정의하는 클래스
class Path {
  constructor() {
    // 적이 이동할 경로의 포인트를 정의
    this.points = [
      { x: 0, y: 170 },   // 경로 시작점
      { x: 260, y: 170 }, // 두 번째 지점
      { x: 260, y: 80 },  // 세 번째 지점
      { x: 600, y: 80 },  // 네 번째 지점
      { x: 600, y: 300 }, // 다섯 번째 지점
      { x: 320, y: 300 }, // 여섯 번째 지점
      { x: 320, y: 430 }, // 일곱 번째 지점
      { x: 610, y: 430 }, // 여덟 번째 지점
      { x: 610, y: 530 }  // 경로 끝 지점
    ];
    this.pathThickness = 10; // 경로 두께
  }

  // (x, y)가 경로 위인지 확인
  isOnPath(x, y) {
    let towerRadius = 25; // 타워 반경
    for (let i = 0; i < this.points.length - 1; i++) {
      let p1 = this.points[i];
      let p2 = this.points[i + 1];

      // 점과 선분의 최소거리 계산
      let d = this.pointToSegmentDist(x, y, p1.x, p1.y, p2.x, p2.y);

      // 경로 두께 + 타워 반경 내에 들어오면 경로 위로 간주
      if (d < this.pathThickness + towerRadius) {
        return true;
      }
    }
    return false;
  }


  // 점과 선분 사이 거리 계산
  pointToSegmentDist(px, py, x1, y1, x2, y2) {
    let A = px - x1;
    let B = py - y1;
    let C = x2 - x1;
    let D = y2 - y1;

    let dot = A * C + B * D;
    let len = C * C + D * D;
    let t = Math.max(0, Math.min(1, dot / len));

    let cx = x1 + t * C;
    let cy = y1 + t * D;

    return dist(px, py, cx, cy);
  }

  // 경로를 화면에 그리는 메서드
  // draw() {
  //   imageMode(CORNER);
  //   image(mapImg, 0 , 0, 900, 600);

  //   stroke(200);
  //   strokeWeight(20);
  //   noFill(); 

  //   beginShape();  // 경로 시작
  //   for (let p of this.points) {  // 경로의 각 지점에 대해
  //     vertex(p.x, p.y);  // 해당 지점으로 선을 그음
  //   }
  //   endShape();  // 경로 끝
  // }

  // 경로를 점선으로 그리는 메서드
  draw() {
    imageMode(CORNER);
    image(mapImg, 0, 0, 900, 600);

    stroke(150);        // 회색 도로
    strokeWeight(25);   // 도로 두께
    noFill();

    beginShape();  // 경로 시작
    for (let p of this.points) {  // 경로의 각 지점에 대해
      vertex(p.x, p.y);  // 해당 지점으로 선을 그음
    }
    endShape();  // 경로 끝

    // 중앙선 그리기
    stroke(222, 222, 18);  // 노란색 중앙선
    strokeWeight(4);      // 중앙선 두께
    let dashLength = 20;  // 점선 길이
    let gapLength = 15;   // 점선 간격

    for (let i = 0; i < this.points.length - 1; i++) {
      let p1 = this.points[i];
      let p2 = this.points[i + 1];

      // 두 점 사이 거리와 단위 벡터 계산
      let totalDist = dist(p1.x, p1.y, p2.x, p2.y);
      let dx = (p2.x - p1.x) / totalDist;
      let dy = (p2.y - p1.y) / totalDist;

      let currentDist = 0;
      while (currentDist < totalDist) {
        let startX = p1.x + dx * currentDist;
        let startY = p1.y + dy * currentDist;

        let endDist = min(currentDist + dashLength, totalDist);
        let endX = p1.x + dx * endDist;
        let endY = p1.y + dy * endDist;

        line(startX, startY, endX, endY);

        currentDist += dashLength + gapLength;
      }
    }
  }


}
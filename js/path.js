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
    this.roadImg = null; // 도로 이미지
    this.roadCornerImg = null; // 코너 이미지
    this.roadHalfImg = null; // 절반 도로 이미지
    this.roadQuarterImg = null; // 1/4 도로 이미지
  }
  
  // 이미지 로드 메서드
  loadImages(roadImg, cornerImg, halfImg, quarterImg) {
    this.roadImg = roadImg;
    this.roadCornerImg = cornerImg;
    this.roadHalfImg = halfImg;
    this.roadQuarterImg = quarterImg;
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
  draw() {
    if (!this.roadImg) {
      // 이미지가 로드되지 않았으면 기본 선으로 그리기
      stroke(200);
      strokeWeight(20);
      noFill(); 

      beginShape();
      for (let p of this.points) {
        vertex(p.x, p.y);
      }
      endShape();
      return;
    }

    // 도로 타일 크기
    let tileSize = 40;

    // 먼저 모든 일반 도로 타일 그리기
    for (let i = 0; i < this.points.length - 1; i++) {
      let p1 = this.points[i];
      let p2 = this.points[i + 1];
      let nextP = this.points[i + 2];
      
      let dx = p2.x - p1.x;
      let dy = p2.y - p1.y;
      let segmentLength = dist(p1.x, p1.y, p2.x, p2.y);
      let angle = atan2(dy, dx);
      
      // 코너 감지
      let hasCorner = false;
      if (nextP && this.roadCornerImg) {
        let nextDx = nextP.x - p2.x;
        let nextDy = nextP.y - p2.y;
        let cross = dx * nextDy - dy * nextDx;
        
        if (Math.abs(cross) > 1) {
          hasCorner = true;
        }
      }
      
      push();
      translate(p1.x, p1.y);
      rotate(angle);
      
      // 세그먼트를 road_quarter 타일로 촘촘하게 채우기
      if (this.roadQuarterImg) {
        let quarterTileSize = tileSize / 4; // 10px
        // 코너가 있으면 코너 이미지 영역(20px)을 빼고 채우기
        let drawLength = hasCorner ? segmentLength - (tileSize / 2) : segmentLength;
        let numQuarterTiles = Math.floor(drawLength / quarterTileSize);
        
        for (let j = 0; j < numQuarterTiles; j++) {
          let x = j * quarterTileSize;
          imageMode(CORNER);
          image(this.roadQuarterImg, x, -tileSize / 2, quarterTileSize, tileSize);
        }
      } else if (this.roadHalfImg) {
        // road_quarter가 없으면 road_half 사용
        let halfTileSize = tileSize / 2;
        let drawLength = hasCorner ? segmentLength - halfTileSize : segmentLength;
        let numHalfTiles = Math.floor(drawLength / halfTileSize);
        
        for (let j = 0; j < numHalfTiles; j++) {
          let x = j * halfTileSize;
          imageMode(CORNER);
          image(this.roadHalfImg, x, -tileSize / 2, halfTileSize, tileSize);
        }
      } else {
        // 둘 다 없으면 기존 road 사용
        let numTiles = Math.ceil(segmentLength / tileSize);
        for (let j = 0; j < numTiles; j++) {
          let x = j * tileSize;
          imageMode(CORNER);
          image(this.roadImg, x, -tileSize / 2, tileSize, tileSize);
        }
      }
      
      pop();
    }
    
    // 그 다음 모든 코너 타일 그리기 (위에 표시되도록)
    for (let i = 0; i < this.points.length - 1; i++) {
      let p1 = this.points[i];
      let p2 = this.points[i + 1];
      let nextP = this.points[i + 2];
      
      let dx = p2.x - p1.x;
      let dy = p2.y - p1.y;
      let angle = atan2(dy, dx);
      
      // 코너 감지 및 그리기
      if (nextP && this.roadCornerImg) {
        let nextDx = nextP.x - p2.x;
        let nextDy = nextP.y - p2.y;
        let cross = dx * nextDy - dy * nextDx;
        
        if (Math.abs(cross) > 1) {
          let cornerAngle = angle;
          
          // 각 코너별 개별 회전 각도 설정
          if (i === 0) {
            // 첫 번째 코너 - 현재 상태에서 오른쪽 90도 회전
            cornerAngle += HALF_PI;
          } else if (i === 1) {
            // 두 번째 코너
            cornerAngle += 0;
          } else if (i === 4) {
            // 다섯 번째 코너 - 오른쪽 90도 회전
            cornerAngle += HALF_PI;
          } else if (i === 5) {
            // 여섯 번째 코너 - 오른쪽 90도 회전
            cornerAngle += HALF_PI;
          } else {
            // 나머지 코너들
            cornerAngle += 0;
          }
          
          push();
          translate(p2.x, p2.y);
          rotate(cornerAngle);
          imageMode(CORNER);
          image(this.roadCornerImg, -tileSize / 2, -tileSize / 2, tileSize, tileSize);
          pop();
        }
      }
    }
  }
}
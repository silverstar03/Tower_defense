// 최종 기지 클래스


class Base {
  constructor(x, y) {
    this.pos = createVector(x, y); // 기지의 중심 위치를 저장하는 벡터 (x, y)
    this.hp = 200;                 // 기지의 전체 체력(초기값)
    this.size = 100;                // 기지의 화면에 그릴 크기(정사각형의 한 변 길이)
  }

  draw() {
    fill(100, 200, 255);           // 기지의 배경 색상 설정 (청록 계열)
    imageMode(CENTER);              // 사각형을 중심 좌표 기준으로 그리도록 설정
    image(baseImg, this.pos.x, this.pos.y, this.size, this.size); // 기지 본체(정사각형) 그리기

    // HP 바(배경 빨간색)
    fill(255, 0, 0);               // HP 바 배경 색 설정(빨강)
    rectMode(CENTER);
    rect(this.pos.x, this.pos.y - 40, this.size, 8); // HP 바의 전체 틀(빨강) 그리기

    // HP 바(초록색: 남은 체력 비율에 따라 너비 조정)
    fill(0, 255, 0);               // HP 바 남은 부분 색 설정(초록)
    let w = map(this.hp, 0, 200, 0, this.size); // 현재 hp를 0~this.size 너비로 매핑
    rect(this.pos.x - (this.size - w) / 2, this.pos.y - 40, w, 8);
    // ↑ 왼쪽 정렬 맞추기: 전체 크기(this.size)에 대해 남은 너비(w)를
    //    중앙 기준으로 위치시키기 위해 x 위치를 보정해서 그림
  }

  takeDamage(dmg) {
    this.hp -= dmg;                // 기지가 받은 데미지만큼 체력을 감소
    if (this.hp <= 0) {            // 체력이 0 이하이면
      console.log("기지 파괴!");   // (예시) 콘솔에 기지 파괴 로그 출력
      // 여기에 기지 파괴 시의 추가 로직(게임오버 처리 등)을 넣을 수 있음
    }
  }
}

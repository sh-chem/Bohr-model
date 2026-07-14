/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ElementData {
  number: number;         // 원자 번호
  symbol: string;         // 원소 기호
  name: string;           // 한국어 이름
  englishName: string;    // 영어 이름
  period: number;         // 주기 (1~3)
  group: number;          // 족 (1, 2, 13~18)
  protons: number;        // 양성자 수
  neutrons: number;       // 중성자 수
  electrons: number;      // 전자 수 (중성 원자 기준)
  shells: number[];       // 각 껍질별 올바른 전자 배치 (예: [2, 8, 1])
  valenceElectrons: number;   // 원자가 전자 수 (18족의 경우 화학 반응에 참여하지 않으므로 0)
  description: string;    // 원소 설명
  usage: string;          // 실생활 쓰임새
}

export interface DraggingElectron {
  id: string;
  x: number;
  y: number;
  isDragging: boolean;
}

export interface ActiveElectron {
  id: string;
  shellIndex: number;     // 어느 껍질에 있는지 (0, 1, 2)
  angle: number;          // 공전 각도 (라디안)
  speed: number;          // 공전 속도
  distance: number;       // 원점으로부터의 거리
}

export interface QuizQuestion {
  id: number;
  question: string;       // 질문 내용
  options: string[];      // 4지선다 보기
  correctAnswerIndex: number; // 정답 인덱스
  explanation: string;    // 상세 해설
}

export interface SimulationStats {
  placedElectronsCount: number;
  isCorrect: boolean | null;
  errorMessage: string | null;
}

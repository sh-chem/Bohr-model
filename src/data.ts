/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ElementData, QuizQuestion } from './types';

export const ELEMENTS: ElementData[] = [
  {
    number: 1,
    symbol: 'H',
    name: '수소',
    englishName: 'Hydrogen',
    period: 1,
    group: 1,
    protons: 1,
    neutrons: 0,
    electrons: 1,
    shells: [1],
    valenceElectrons: 1,
    description: '우주에서 가장 흔하고 가벼운 원소입니다. 단 하나의 양성자와 전자로 구성되어 있어 가장 단순한 구조를 가집니다.',
    usage: '우주선 연료, 청정 수소 에너지원, 물(H₂O)의 구성 성분'
  },
  {
    number: 2,
    symbol: 'He',
    name: '헬륨',
    englishName: 'Helium',
    period: 1,
    group: 18,
    protons: 2,
    neutrons: 2,
    electrons: 2,
    shells: [2],
    valenceElectrons: 0, // 18족 비활성 기체이므로 화학 반응 참여 전자는 0개
    description: '1주기 18족 원소로, 첫 번째 전자 껍질(최대 2개)이 완전히 채워져 매우 안정합니다. 다른 원소와 반응하지 않는 비활성 기체입니다.',
    usage: '풍선/기구 충전 가스, 자기공명영상(MRI) 장치의 극저온 냉각제'
  },
  {
    number: 3,
    symbol: 'Li',
    name: '리튬',
    englishName: 'Lithium',
    period: 2,
    group: 1,
    protons: 3,
    neutrons: 4,
    electrons: 3,
    shells: [2, 1],
    valenceElectrons: 1,
    description: '2주기 1족 알칼리 금속입니다. 은백색의 매우 가벼운 금속으로, 물, 산소와 매우 격렬하게 반응하는 성질이 있습니다.',
    usage: '스마트폰, 전기차 등에 사용되는 리튬 이온 배터리'
  },
  {
    number: 4,
    symbol: 'Be',
    name: '베릴륨',
    englishName: 'Beryllium',
    period: 2,
    group: 2,
    protons: 4,
    neutrons: 5,
    electrons: 4,
    shells: [2, 2],
    valenceElectrons: 2,
    description: '2주기 2족 알칼리 토금속입니다. 가볍고 단단하며 열과 전기를 잘 전달하지만, 독성이 있어 다룰 때 주의가 필요합니다.',
    usage: '우주 항공 재료, 고성능 합금, 제임스 웹 우주망원경 반사경'
  },
  {
    number: 5,
    symbol: 'B',
    name: '붕소',
    englishName: 'Boron',
    period: 2,
    group: 13,
    protons: 5,
    neutrons: 6,
    electrons: 5,
    shells: [2, 3],
    valenceElectrons: 3,
    description: '2주기 13족 준금속 원소입니다. 금속과 비금속의 중간 성질을 띠며, 열에 강한 유리 등을 만드는 데 사용됩니다.',
    usage: '내열 유리기구(파이렉스), 반도체 첨가제, 세제 원료'
  },
  {
    number: 6,
    symbol: 'C',
    name: '탄소',
    englishName: 'Carbon',
    period: 2,
    group: 14,
    protons: 6,
    neutrons: 6,
    electrons: 6,
    shells: [2, 4],
    valenceElectrons: 4,
    description: '2주기 14족 비금속 원소입니다. 4개의 원자가 전자를 가져 최대 4개의 다른 원소와 다양한 형태로 결합할 수 있어, 지구상 생명체의 유기 화합물 뼈대를 이룹니다.',
    usage: '다이아몬드, 흑연, 탄소 섬유, 모든 생명체의 유기물'
  },
  {
    number: 7,
    symbol: 'N',
    name: '질소',
    englishName: 'Nitrogen',
    period: 2,
    group: 15,
    protons: 7,
    neutrons: 7,
    electrons: 7,
    shells: [2, 5],
    valenceElectrons: 5,
    description: '2주기 15족 비금속 원소입니다. 대기 부피의 약 78%를 차지하는 기체로, 질소 분자(N₂)는 삼중 결합을 하고 있어 매우 안정하고 반응성이 낮습니다.',
    usage: '식품 포장용 충전재, 액체 질소 냉매, 비료 제조'
  },
  {
    number: 8,
    symbol: 'O',
    name: '산소',
    englishName: 'Oxygen',
    period: 2,
    group: 16,
    protons: 8,
    neutrons: 8,
    electrons: 8,
    shells: [2, 6],
    valenceElectrons: 6,
    description: '2주기 16족 비금속 원소입니다. 지각과 대기에 풍부하며 생명체의 호흡과 물질의 연소에 필수적인 원소입니다.',
    usage: '의료용 산소 호흡기, 물(H₂O) 및 이산화탄소(CO₂) 형성'
  },
  {
    number: 9,
    symbol: 'F',
    name: '플루오린',
    englishName: 'Fluorine',
    period: 2,
    group: 17,
    protons: 9,
    neutrons: 10,
    electrons: 9,
    shells: [2, 7],
    valenceElectrons: 7,
    description: '2주기 17족 할로젠 원소입니다. 전자를 끌어당기는 성질(전기음성도)이 원소 중 가장 강해 반응성이 매우 크며, 다른 물질을 격렬하게 부식시킵니다.',
    usage: '치약 성분(충치 예방), 불소수지 코팅(테프론 프라이팬)'
  },
  {
    number: 10,
    symbol: 'Ne',
    name: '네온',
    englishName: 'Neon',
    period: 2,
    group: 18,
    protons: 10,
    neutrons: 10,
    electrons: 10,
    shells: [2, 8],
    valenceElectrons: 0, // 18족 비활성 기체
    description: '2주기 18족 비활성 기체입니다. 가장 바깥쪽 껍질에 8개의 전자가 꽉 차 있어 비활성 상태입니다. 전류가 흐르면 붉은색의 아름다운 빛을 냅니다.',
    usage: '네온사인 간판, 고전압 방전관, 레이저 기기'
  },
  {
    number: 11,
    symbol: 'Na',
    name: '나트륨',
    englishName: 'Sodium',
    period: 3,
    group: 1,
    protons: 11,
    neutrons: 12,
    electrons: 11,
    shells: [2, 8, 1],
    valenceElectrons: 1,
    description: '3주기 1족 알칼리 금속입니다. 칼로 쉽게 잘릴 정도로 무르며, 공기 중의 산소 및 물과 매우 빠르게 반응하므로 석유나 액체 파라핀 속에 보관해야 합니다.',
    usage: '소금(NaCl)의 구성 성분, 나트륨등, 생체 내 전해질 조절'
  },
  {
    number: 12,
    symbol: 'Mg',
    name: '마그네슘',
    englishName: 'Magnesium',
    period: 3,
    group: 2,
    protons: 12,
    neutrons: 12,
    electrons: 12,
    shells: [2, 8, 2],
    valenceElectrons: 2,
    description: '3주기 2족 알칼리 토금속입니다. 가볍고 은백색의 광택이 있는 금속으로, 연소할 때 강렬한 흰색 빛을 내며 탑니다.',
    usage: '노트북 및 스마트폰 경량 합금 외관, 카메라 플래시, 엽록소 핵심 원소'
  },
  {
    number: 13,
    symbol: 'Al',
    name: '알루미늄',
    englishName: 'Aluminum',
    period: 3,
    group: 13,
    protons: 13,
    neutrons: 14,
    electrons: 13,
    shells: [2, 8, 3],
    valenceElectrons: 3,
    description: '3주기 13족 금속 원소입니다. 가볍고 부식에 강하며 연성이 좋아 다양한 형태로 가공하기 쉬운 매우 실용적인 금속입니다.',
    usage: '알루미늄 호일, 음료 캔, 항공기 동체, 창틀 섀시'
  },
  {
    number: 14,
    symbol: 'Si',
    name: '규소',
    englishName: 'Silicon',
    period: 3,
    group: 14,
    protons: 14,
    neutrons: 14,
    electrons: 14,
    shells: [2, 8, 4],
    valenceElectrons: 4,
    description: '3주기 14족 준금속 원소입니다. 모래나 암석의 주성분이며, 전기 전도도를 정밀하게 제어할 수 있어 현대 전자공학 및 IT 산업의 핵심 소재입니다.',
    usage: '반도체 칩, 유리 제조, 실리콘 고무, 태양광 패널'
  },
  {
    number: 15,
    symbol: 'P',
    name: '인',
    englishName: 'Phosphorus',
    period: 3,
    group: 15,
    protons: 15,
    neutrons: 16,
    electrons: 15,
    shells: [2, 8, 5],
    valenceElectrons: 5,
    description: '3주기 15족 비금속 원소입니다. 뼈와 DNA의 핵심 성분으로 생명체에 필수적이며, 성냥이나 비료 등에 널리 쓰입니다.',
    usage: '생명체 DNA 구조 및 뼈 성분, 성냥 머리, 농업용 인산 비료'
  },
  {
    number: 16,
    symbol: 'S',
    name: '황',
    englishName: 'Sulfur',
    period: 3,
    group: 16,
    protons: 16,
    neutrons: 16,
    electrons: 16,
    shells: [2, 8, 6],
    valenceElectrons: 6,
    description: '3주기 16족 비금속 원소입니다. 상온에서 노란색 고체 상태이며, 화산 지대에서 주로 발견됩니다. 독특한 냄새가 있는 화합물을 잘 형성합니다.',
    usage: '화약 제조, 고무 황화 공정(경화), 황산 제조, 아미노산 필수 성분'
  },
  {
    number: 17,
    symbol: 'Cl',
    name: '염소',
    englishName: 'Chlorine',
    period: 3,
    group: 17,
    protons: 17,
    neutrons: 18,
    electrons: 17,
    shells: [2, 8, 7],
    valenceElectrons: 7,
    description: '3주기 17족 할로젠 원소입니다. 자극성이 강한 냄새를 가진 황록색 기체로, 반응성이 크며 살균 및 소독 작용이 매우 뛰어납니다.',
    usage: '수돗물 및 수영장 소독, 화학 표백제(락스), PVC 플라스틱 원료'
  },
  {
    number: 18,
    symbol: 'Ar',
    name: '아르곤',
    englishName: 'Argon',
    period: 3,
    group: 18,
    protons: 18,
    neutrons: 22,
    electrons: 18,
    shells: [2, 8, 8],
    valenceElectrons: 0, // 18족 비활성 기체
    description: '3주기 18족 비활성 기체입니다. 세 번째 전자 껍질까지 전자가 모두 차 있어 화학적으로 매우 안정합니다. 대기 중에 약 0.93% 함유되어 있습니다.',
    usage: '형광등 내 충전 기체, 용접용 보호 가스, 박물관 유물 보존 가스'
  },
  {
    number: 19,
    symbol: 'K',
    name: '칼륨',
    englishName: 'Potassium',
    period: 4,
    group: 1,
    protons: 19,
    neutrons: 20,
    electrons: 19,
    shells: [2, 8, 8, 1],
    valenceElectrons: 1,
    description: '4주기 1족 알칼리 금속입니다. 물과 매우 폭발적으로 반응하며, 세포의 전위 조절 및 신경 전달 등 생명 유지에 핵심적인 원소입니다.',
    usage: '비료 제조, 체내 나트륨 배출 및 삼투압 조절, 바나나 등의 음식에 풍부'
  },
  {
    number: 20,
    symbol: 'Ca',
    name: '칼슘',
    englishName: 'Calcium',
    period: 4,
    group: 2,
    protons: 20,
    neutrons: 20,
    electrons: 20,
    shells: [2, 8, 8, 2],
    valenceElectrons: 2,
    description: '4주기 2족 알칼리 토금속입니다. 인체의 뼈와 치아를 형성하는 주성분이며, 근육 수축과 혈액 응고 등에 중요한 생리 작용을 합니다.',
    usage: '뼈와 치아 강화(우유 등), 건축 자재(시멘트, 석회석), 겨울철 제설제'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '보어의 원자 모형에 대한 설명으로 옳은 것은 무엇인가요?',
    options: [
      '전자는 특정 에너지를 갖는 궤도(전자 껍질)에서만 돌고 있다.',
      '전자는 원자핵 내부에서 자유롭게 진동한다.',
      '양성자 수에 상관없이 모든 원소의 전자 껍질 구조는 동일하다.',
      '전자는 아무 곳에나 위치하며 에너지 수준이 연속적이다.'
    ],
    correctAnswerIndex: 0,
    explanation: '보어(Bohr) 모형에 따르면 전자는 원자핵 주변의 특정한 에너지를 갖는 궤도인 "전자 껍질"에만 위치하며, 안쪽 껍질부터 차례대로 배치됩니다.'
  },
  {
    id: 2,
    question: '각 전자 껍질에 최대로 들어갈 수 있는 전자 수가 올바르게 짝지어진 것은?',
    options: [
      '첫 번째: 8개, 두 번째: 2개, 세 번째: 8개',
      '첫 번째: 2개, 두 번째: 8개, 세 번째: 8개',
      '첫 번째: 2개, 두 번째: 2개, 세 번째: 8개',
      '첫 번째: 8개, 두 번째: 8개, 세 번째: 18개'
    ],
    correctAnswerIndex: 1,
    explanation: '첫 번째 전자 껍질은 최대 2개, 두 번째는 최대 8개, 세 번째 전자 껍질은 (통합과학 주기율표 범위 내에서) 최대 8개의 전자가 채워질 수 있습니다.'
  },
  {
    id: 3,
    question: '원자가 전자(Valence Electron)에 대한 정의로 가장 알맞은 것은?',
    options: [
      '원자가 가진 모든 전자의 합',
      '원자핵을 구성하는 양성자의 개수',
      '가장 바깥 전자 껍질에 채워져 있으면서 화학 반응에 참여하는 전자',
      '원자가 이온이 될 때 잃어버리는 양전하의 수'
    ],
    correctAnswerIndex: 2,
    explanation: '"원자가 전자"는 원자의 가장 바깥 전자 껍질에 채워져 있으면서 화학 결합이나 반응에 참여하는 전자를 뜻하므로, 화학적 성질을 결정하는 핵심 요소입니다.'
  },
  {
    id: 4,
    question: '원소들의 화학적 성질이 주기성을 나타내는 근본적인 이유는 무엇인가요?',
    options: [
      '원자량이 늘어남에 따라 중성자 수가 일정하게 증가하기 때문에',
      '원자 번호가 증가함에 따라 "원자가 전자 수"가 주기적으로 변하기 때문에',
      '원자의 모양이 무작위로 계속 변하기 때문에',
      '모든 원소가 같은 주기에서 동일한 수의 전자를 가지기 때문에'
    ],
    correctAnswerIndex: 1,
    explanation: '원자 번호(양성자 수 = 전자 수)가 늘어남에 따라, 가장 바깥 껍질의 "원자가 전자 수"가 1~7개, 그리고 0개(18족)로 주기적으로 되풀이됩니다. 화학 성질을 결정하는 원자가 전자 수가 주기적으로 변하기 때문에 원소들의 성질도 주기성을 가집니다.'
  },
  {
    id: 5,
    question: '마그네슘(Mg, 12번)과 같은 족에 속하며, 원자가 전자 수가 2개인 2주기 원소는 무엇인가요?',
    options: [
      '수소 (H)',
      '리튬 (Li)',
      '베릴륨 (Be)',
      '네온 (Ne)'
    ],
    correctAnswerIndex: 2,
    explanation: '마그네슘(Mg)은 3주기 2족 원소입니다. 베릴륨(Be)은 2주기 2족 원소로, 전자 배치가 [2, 2]이어서 원자가 전자 수가 2개입니다. 둘 다 2족(알칼리 토금속)에 속해 비슷한 화학적 성질을 보입니다.'
  }
];

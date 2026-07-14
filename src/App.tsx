/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ELEMENTS } from './data';
import { ElementData, SimulationStats } from './types';
import HelpModal from './components/HelpModal';
import PeriodicTable from './components/PeriodicTable';
import QuizSection from './components/QuizSection';
import InfoPanel from './components/InfoPanel';
import { SimulationCanvas, SimulationCanvasRef } from './components/SimulationCanvas';
import { 
  Atom, 
  BookOpen, 
  HelpCircle, 
  Trophy, 
  RefreshCw, 
  Layers, 
  Share2, 
  Sparkles,
  Award,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. 핵심 애플리케이션 상태 관리
  const [selectedElement, setSelectedElement] = useState<ElementData>(ELEMENTS[0]); // 기본 원소: 수소(H)
  const [placedCounts, setPlacedCounts] = useState<number[]>([0, 0, 0, 0]); // 첫 번째, 두 번째, 세 번째, 네 번째 전자 껍질에 수동 배치된 전자 개수
  const [activeTab, setActiveTab] = useState<'simulation' | 'quiz'>('simulation'); // 현재 활성 탭
  const [isOrbiting, setIsOrbiting] = useState<boolean>(true); // 공전 애니메이션 상태
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(true); // 도움말 모달 기본값: true (처음 온보딩 유도)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false); // 수집 내역 초기화 확인 모달 상태

  // 성공 수집 목록 (로컬스토리지 복구 지원)
  const [solvedNumbers, setSolvedNumbers] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('solved_elements');
    if (saved) {
      try {
        return new Set<number>(JSON.parse(saved));
      } catch (e) {
        return new Set<number>();
      }
    }
    return new Set<number>();
  });

  // 채점 검증 상태 기록
  const [simulationStats, setSimulationStats] = useState<SimulationStats>({
    placedElectronsCount: 0,
    isCorrect: null,
    errorMessage: null,
  });

  // 캔버스 효과 트리거를 위한 레퍼런스
  const canvasRef = useRef<SimulationCanvasRef>(null);

  // 2. 원소 변경 시 상태 리셋 효과 (완료된 원소라면 자동으로 전자를 배치하고 맞춤 처리)
  useEffect(() => {
    if (solvedNumbers.has(selectedElement.number)) {
      const targetShells = [...selectedElement.shells];
      while (targetShells.length < 4) {
        targetShells.push(0);
      }
      setPlacedCounts(targetShells);
      setSimulationStats({
        placedElectronsCount: selectedElement.electrons,
        isCorrect: true,
        errorMessage: null,
      });
    } else {
      setPlacedCounts([0, 0, 0, 0]);
      setSimulationStats({
        placedElectronsCount: 0,
        isCorrect: null,
        errorMessage: null,
      });
    }
  }, [selectedElement, solvedNumbers]);

  // 3. 키보드 방향키 단축키 바인딩 (이전/다음 원소 탐구)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 퀴즈 탭이 아닐 때만 작동
      if (activeTab !== 'simulation') return;

      if (e.key === 'ArrowLeft') {
        handlePrevElement();
      } else if (e.key === 'ArrowRight') {
        handleNextElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, activeTab]);

  // 4. 원소 탐색 핸들러
  const handlePrevElement = () => {
    const currentIndex = ELEMENTS.findIndex((el) => el.number === selectedElement.number);
    const prevIndex = currentIndex === 0 ? ELEMENTS.length - 1 : currentIndex - 1;
    setSelectedElement(ELEMENTS[prevIndex]);
  };

  const handleNextElement = () => {
    const currentIndex = ELEMENTS.findIndex((el) => el.number === selectedElement.number);
    const nextIndex = currentIndex === ELEMENTS.length - 1 ? 0 : currentIndex + 1;
    setSelectedElement(ELEMENTS[nextIndex]);
  };

  // 5. 시뮬레이션 제어 함수
  const handleClear = () => {
    setPlacedCounts([0, 0, 0, 0]);
    setSimulationStats({
      placedElectronsCount: 0,
      isCorrect: null,
      errorMessage: null,
    });
  };

  // 6. 자가 채점 완료 검증 (Bohr 모델 타당성 검사)
  const handleCheck = () => {
    const currentTotal = placedCounts.reduce((a, b) => a + b, 0);
    const targetTotal = selectedElement.electrons;

    // (A) 총 전자 개수 일치 체크
    if (currentTotal !== targetTotal) {
      setSimulationStats({
        placedElectronsCount: currentTotal,
        isCorrect: false,
        errorMessage: `${selectedElement.name}(은)는 양성자 수(${selectedElement.protons}개)와 총 전자 수가 동일해야 전기적으로 중성인 원자가 됩니다. 현재 배치된 총 전자는 ${currentTotal}개입니다.`
      });
      return;
    }

    // (B) 껍질별 순차 안착(Aufbau) 및 한계량 일치성 체크
    const targetShells = selectedElement.shells;
    
    // 첫 번째 껍질 수용성 체크
    if (placedCounts[0] !== targetShells[0]) {
      setSimulationStats({
        placedElectronsCount: currentTotal,
        isCorrect: false,
        errorMessage: `에너지 준위가 가장 낮은 첫 번째 전자 껍질부터 전자가 먼저 채워져야 합니다. (목표: ${targetShells[0]}개)`
      });
      return;
    }

    // 두 번째 껍질 수용성 체크
    if (targetShells.length >= 2 && placedCounts[1] !== targetShells[1]) {
      setSimulationStats({
        placedElectronsCount: currentTotal,
        isCorrect: false,
        errorMessage: `두 번째 전자 껍질에 정량 규칙을 맞추지 못했습니다. (목표: ${targetShells[1]}개)`
      });
      return;
    }

    // 세 번째 껍질 수용성 체크
    if (targetShells.length >= 3 && placedCounts[2] !== targetShells[2]) {
      setSimulationStats({
        placedElectronsCount: currentTotal,
        isCorrect: false,
        errorMessage: `세 번째 전자 껍질의 개수가 맞지 않습니다. (목표: ${targetShells[2]}개)`
      });
      return;
    }

    // 네 번째 껍질 수용성 체크
    if (targetShells.length >= 4 && placedCounts[3] !== targetShells[3]) {
      setSimulationStats({
        placedElectronsCount: currentTotal,
        isCorrect: false,
        errorMessage: `네 번째 전자 껍질의 개수가 맞지 않습니다. (목표: ${targetShells[3]}개)`
      });
      return;
    }

    // (C) 정답 통과
    setSimulationStats({
      placedElectronsCount: currentTotal,
      isCorrect: true,
      errorMessage: null
    });

    // 성공한 원소 번호 수집 목록에 추가
    setSolvedNumbers((prev) => {
      const next = new Set(prev);
      next.add(selectedElement.number);
      localStorage.setItem('solved_elements', JSON.stringify(Array.from(next)));
      return next;
    });

    // 캔버스 축하(파티클 파열) 트리거
    if (canvasRef.current) {
      canvasRef.current.triggerCelebration();
    }
  };

  // 성공 컬렉션 전체 초기화 (학습용 초기화)
  const handleResetCollection = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setSolvedNumbers(new Set<number>());
    localStorage.removeItem('solved_elements');
    setSelectedElement(ELEMENTS[0]); // 첫 번째 원소 수소(H)로 리셋
    setPlacedCounts([0, 0, 0, 0]); // 배치된 전자 0으로 리셋
    setSimulationStats({
      placedElectronsCount: 0,
      isCorrect: null,
      errorMessage: null,
    });
    setIsHelpOpen(true); // 처음 접속한 것처럼 온보딩 설명서도 다시 띄움
    setIsResetConfirmOpen(false); // 모달 닫기
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-x-hidden select-none">
      
      {/* 백그라운드 네온 오라 효과 (파스텔 톤) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/40 blur-[120px] pointer-events-none" />

      {/* 1. 최상단 헤더 영역 */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* 타이틀 로고 */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20">
              <Atom className="h-5 w-5 text-white animate-spin [animation-duration:8s]" />
              <div className="absolute inset-0 rounded-xl border border-white/20 animate-pulse" />
            </div>
            <div>
              <h1 className="font-display text-sm font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 uppercase">
                Atom Orbit
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">통합과학1 / 원자의 전자 배치와 원자가 전자 탐구</p>
            </div>
          </div>

          {/* 중앙 탭 스위처 */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold font-mono tracking-wider transition-all cursor-pointer ${
                activeTab === 'simulation'
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-simulation-trigger"
            >
              <Atom className="h-3.5 w-3.5" /> 01_BOHR_SANDBOX
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold font-mono tracking-wider transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-quiz-trigger"
            >
              <BookOpen className="h-3.5 w-3.5" /> 02_CONCEPT_QUIZ
            </button>
          </div>

          {/* 우측 공통 컨트롤 */}
          <div className="flex items-center gap-2">
            {/* 공전 정지/시작 버튼 */}
            {activeTab === 'simulation' && (
              <button
                onClick={() => setIsOrbiting(!isOrbiting)}
                className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-sm transition-all cursor-pointer"
                id="toggle-orbit-animation"
              >
                {isOrbiting ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-pink-600" />
                    <span>공전 정지</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-emerald-600" />
                    <span>공전 시작</span>
                  </>
                )}
              </button>
            )}

            {/* 업적 진행도 표시 */}
            <div className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-600 shadow-sm">
              <Trophy className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>수집: </span>
              <strong className="text-slate-900 font-bold">{solvedNumbers.size}/20</strong>
            </div>

            {/* 수집 초기화 버튼 */}
            <button
              onClick={handleResetCollection}
              className="flex items-center gap-1.5 rounded-lg bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 shadow-sm transition-all cursor-pointer"
              id="header-reset-collection-btn"
            >
              <RefreshCw className="h-3.5 w-3.5 text-red-500" />
              <span>수집 초기화</span>
            </button>

            {/* 도움말 가이드 */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-sm transition-all cursor-pointer"
              id="manual-trigger-btn"
            >
              <HelpCircle className="h-3.5 w-3.5 text-cyan-600" />
              <span>사용 설명서</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. 메인 바디 컨텍스트 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-5">
        
        {activeTab === 'simulation' ? (
          /* 시뮬레이션 탭 레이아웃 (데스크톱: 768px 이상에서 좌우 2열 분할) */
          <div className="space-y-5 flex-1 flex flex-col justify-between" id="simulation-tab-content">
            
            {/* 상단 시뮬레이션 & 정보제공 열 분할 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch flex-1">
              
              {/* 좌측 컨트롤 및 사양 대시보드 (폭 30~35%에 수렴하는 md:col-span-4) */}
              <div className="md:col-span-4 h-full">
                <InfoPanel
                  element={selectedElement}
                  onPrevElement={handlePrevElement}
                  onNextElement={handleNextElement}
                  simulationStats={simulationStats}
                  isSolved={solvedNumbers.has(selectedElement.number)}
                />
              </div>

              {/* 우측 메인 2D 캔버스 탐구 구역 (폭 65~70%에 수렴하는 md:col-span-8) */}
              <div className="md:col-span-8 h-full flex flex-col">
                <SimulationCanvas
                  ref={canvasRef}
                  element={selectedElement}
                  placedCounts={placedCounts}
                  setPlacedCounts={setPlacedCounts}
                  onClear={handleClear}
                  onCheck={handleCheck}
                  isCorrect={simulationStats.isCorrect}
                  isOrbiting={isOrbiting}
                  simulationStats={simulationStats}
                />
              </div>

            </div>

            {/* 하단 배치형 원소 주기율표 그리드 및 수집 패널 */}
            <div className="pt-2">
              <PeriodicTable
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                solvedNumbers={solvedNumbers}
              />
            </div>

          </div>
        ) : (
          /* 퀴즈 탭 레이아웃 */
          <div className="max-w-xl w-full mx-auto py-8" id="quiz-tab-content">
            <QuizSection />
          </div>
        )}

      </main>

      {/* 3. 푸터 영역 */}
      <footer className="border-t border-slate-200 bg-white/40 p-4 text-center font-mono text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>CREATE : chemistryjjang@gmail.com (with AI Studio)</span>
        </div>
      </footer>

      {/* 4. 시스템 보조 설명 도움말 모달 */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* 5. 수집 내역 초기화 확인 모달 */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 배후 배경 흐림 효과 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetConfirmOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* 모달 창 본체 */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-red-200 bg-white text-slate-800 shadow-2xl p-6"
              id="reset-confirm-modal-container"
            >
              {/* 상단 장식 헤더 */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />

              <div className="flex flex-col items-center text-center space-y-4 pt-2">
                {/* 경고 아이콘 */}
                <div className="rounded-full bg-red-50 p-3 border border-red-100">
                  <AlertTriangle className="h-8 w-8 text-red-600 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-950 font-sans tracking-tight">
                    수집 내역 데이터 초기화 경고
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    그동안 해결한 모든 원소 수집 내역({solvedNumbers.size}/20개 완료)을 삭제하고 처음부터 다시 도전하시겠습니까?
                  </p>
                  <p className="text-xs text-red-500 font-semibold">
                    ⚠️ 이 작업은 절대 되돌릴 수 없습니다.
                  </p>
                </div>

                {/* 하단 제어 버튼 */}
                <div className="flex items-center gap-2 w-full pt-4">
                  <button
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="flex-1 rounded-xl bg-slate-100 border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer shadow-sm"
                    id="reset-confirm-cancel-btn"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 py-3 text-sm font-bold text-white transition-all cursor-pointer shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
                    id="reset-confirm-ok-btn"
                  >
                    확인 (초기화)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

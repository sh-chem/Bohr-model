/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, HelpCircle, AlertCircle, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 배후 배경 흐림 효과 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* 모달 창 본체 */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl"
            id="help-modal-container"
          >
            {/* 상단 장식 헤더 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

            {/* 타이틀 및 닫기 버튼 */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-cyan-600 animate-pulse" />
                <h2 className="font-mono text-lg font-bold tracking-tight text-cyan-700">
                  SYSTEM MANUAL : 원자 전자 배치 규칙
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                id="close-help-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 본문 콘텐츠 (스크롤 가능) */}
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6 text-sm leading-relaxed text-slate-600">
              
              {/* 1. 보어 원자 모형 */}
              <div className="space-y-2 border-l-2 border-cyan-500/50 pl-3">
                <h3 className="font-mono font-bold text-cyan-700 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-cyan-600" /> 01. 보어(Bohr)의 원자 모형
                </h3>
                <p>
                  원자는 중심의 양성자(+)와 중성자로 이루어진 <strong>원자핵</strong>, 그리고 그 주위를 돌고 있는 <strong>전자(-)</strong>로 구성됩니다. 전자는 아무 데나 존재하는 것이 아니라, 특정한 에너지를 가진 궤도인 <strong>'전자 껍질'</strong>에만 존재할 수 있습니다.
                </p>
              </div>

              {/* 2. 전자 배치 규칙 */}
              <div className="space-y-3 border-l-2 border-purple-500/50 pl-3">
                <h3 className="font-mono font-bold text-purple-700 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-purple-600" /> 02. 전자 껍질별 최대 수용량 (원자번호 1~20번 기준)
                </h3>
                <p>전자는 원자핵과 가까운 안쪽 껍질부터 차례대로 채워지며, 각 껍질마다 최대로 들어갈 수 있는 전자의 수가 정해져 있습니다.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-center">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-cyan-700 font-bold mb-1">첫 번째 전자 껍질</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-1">최대 2개</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-purple-700 font-bold mb-1">두 번째 전자 껍질</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-1">최대 8개</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="text-pink-700 font-bold mb-1">세 번째 전자 껍질</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-1">최대 8개</div>
                  </div>
                </div>
              </div>

              {/* 3. 원자가 전자 */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-800 font-mono text-sm">
                      원자가 전자(Valence Electron)의 특징
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      원자 전자 배치 시뮬레이션의 핵심 개념입니다!
                    </p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1.5 pl-1 text-sm text-slate-600">
                  <li>
                    <strong>원자가 전자</strong>는 원자의 가장 바깥쪽 껍질에 배치되어 있으면서, <strong>실제 화학 반응이나 결합에 활발하게 참여하는 전자</strong>를 가리킵니다.
                  </li>
                  <li>
                    따라서 한 원소의 화학적인 성질(반응하는 상대, 결합 형태 등)을 결정하는 가장 중요한 요소가 바로 이 원자가 전자 수입니다.
                  </li>
                  <li>
                    <span className="text-amber-800 font-semibold">★ 18족 비활성 기체(He, Ne, Ar)의 특성:</span> 이 원소들은 가장 바깥 껍질이 이미 최대로 채워져 극도로 안정한 상태를 이룹니다. 화학 반응에 전혀 참여하지 않기 때문에, 가장 바깥에 전자가 가득 차 있어도 <strong>원자가 전자 수는 0개</strong>로 정의합니다!
                  </li>
                </ul>
              </div>

              {/* 4. 조작 방법 안내 */}
              <div className="space-y-2 border-l-2 border-emerald-500/50 pl-3">
                <h3 className="font-mono font-bold text-emerald-700">03. 시뮬레이터 조작 가이드</h3>
                <ul className="list-disc list-inside space-y-1 pl-1 text-sm text-slate-600">
                  <li><strong>원소 선택</strong>: 하단 주기율표나 상단의 이전/다음 버튼을 통해 탐구할 원소를 고릅니다.</li>
                  <li><strong>전자 배치 (드래그)</strong>: 우측 하단의 <span className="text-cyan-700 font-semibold">전자 공급소(-e)</span>에서 마우스나 손가락으로 전자를 드래그하여 원하는 궤도(껍질) 위에 올려 놓습니다.</li>
                  <li><strong>배치 검증</strong>: 배치 완료 후 <span className="text-cyan-700 font-semibold">자가 채점</span> 버튼을 눌러 정답 여부를 확인합니다. 통과 시 해당 원소가 주기율표에 수집됩니다!</li>
                </ul>
              </div>

            </div>

            {/* 하단 닫기 바 */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 text-center">
              <button
                onClick={onClose}
                className="rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 px-6 py-2 text-xs font-mono font-bold text-white shadow-lg hover:from-cyan-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                id="close-help-modal-footer"
              >
                학습 시작하기 (ENTER SYSTEM)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ElementData, SimulationStats } from '../types';
import { ChevronLeft, ChevronRight, Award, ShieldAlert } from 'lucide-react';

interface InfoPanelProps {
  element: ElementData;
  onPrevElement: () => void;
  onNextElement: () => void;
  simulationStats: SimulationStats;
  isSolved?: boolean;
}

export default function InfoPanel({
  element,
  onPrevElement,
  onNextElement,
  simulationStats,
  isSolved = false,
}: InfoPanelProps) {
  const { isCorrect, errorMessage, placedElectronsCount } = simulationStats;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur-md text-slate-800 space-y-5 flex flex-col justify-between h-full" id="info-panel-wrapper">
      
      {/* 1. 상단 원소 기본 헤더 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-cyan-700 tracking-wider bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
            ATOMIC NO. {element.number}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevElement}
              className="rounded-lg p-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
              title="이전 원소"
              id="prev-element-btn"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={onNextElement}
              className="rounded-lg p-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
              title="다음 원소"
              id="next-element-btn"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-3">
            <h2 className="font-arial text-3xl font-extrabold tracking-tight text-slate-900">
              {element.symbol}
            </h2>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold text-slate-800">
                {element.name}({element.englishName.charAt(0).toUpperCase() + element.englishName.slice(1).toLowerCase()})
              </span>
            </div>
          </div>

          {isSolved && (
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm select-none animate-pulse">
              <Award className="h-3.5 w-3.5 text-emerald-600" />
              <span>완료 배지</span>
            </div>
          )}
        </div>

        {/* 주기 및 족 */}
        <div className="grid grid-cols-2 gap-2 font-mono text-xs text-center">
          <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60 flex flex-col justify-center">
            <div className="text-xs text-slate-500">주기</div>
            <div className="text-sm font-bold text-purple-700 mt-1">
              <div>{element.period}주기</div>
              <div className="text-[11px] font-medium text-purple-500 mt-0.5">전자 껍질 {element.period}개</div>
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
            <div className="text-xs text-slate-500">족 (주기적 성질)</div>
            <div className="text-sm font-bold text-pink-700">{element.group}족</div>
          </div>
        </div>
      </div>

      {/* 2. 원자 상세 구조 정보 및 오중성 정보 */}
      <div className="space-y-3">
        <h3 className="font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">
          STRUCTURAL SPECS : 원자를 구성하는 입자수
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
            <div className="text-xs text-red-600 font-bold">양성자 (+)</div>
            <div className="font-mono text-lg font-bold text-slate-900 mt-0.5">{element.protons}개</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
            <div className="text-xs text-blue-600 font-bold">중성자 (0)</div>
            <div className="font-mono text-lg font-bold text-slate-900 mt-0.5">{element.neutrons}개</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/60">
            <div className="text-xs text-amber-600 font-bold">총 전자 (-)</div>
            <div className="font-mono text-lg font-bold text-slate-900 mt-0.5">{isCorrect ? `${element.electrons}개` : '?개'}</div>
          </div>
        </div>

        {/* 올바른 전자 배치 목표 구조 */}
        <div className="rounded-lg bg-slate-100 p-3 border border-slate-200 flex justify-between items-center text-sm">
          <span className="text-slate-600 font-medium">
            목표 배치 ({['첫 번째', '두 번째', '세 번째', '네 번째'].slice(0, element.shells.length).join(' → ')} 전자 껍질)
          </span>
          <div className="flex gap-1.5 font-mono">
            {element.shells.map((count, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-bold shadow-sm"
              >
                {isCorrect ? count : '?'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ★ 핵심 교육 영역: 원자가 전자 */}
      <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-3.5 border border-purple-200 space-y-2.5 shadow-sm">

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-purple-700 font-bold">원자가 전자 수</span>
            <p className="text-xs text-slate-500 leading-normal">실제 화학 반응/결합에 참여하는 전자의 개수</p>
          </div>
          <div className="flex items-baseline gap-1 bg-purple-100/50 px-3 py-1 rounded-md border border-purple-200">
            <span className="text-xl font-bold font-mono text-purple-700">
              {isCorrect ? element.valenceElectrons : '?'}
            </span>
            <span className="text-xs text-purple-500">개</span>
          </div>
        </div>

        {/* 18족 비활성 기체 예외 설명 노출 */}
        {element.group === 18 && isCorrect && (
          <div className="mt-1.5 rounded bg-purple-50 border border-purple-200 p-2.5 text-xs leading-relaxed text-purple-800 flex items-start gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-purple-600 mt-0.5" />
            <span>
              <strong>주의: 18족 비활성 기체!</strong> 가장 바깥 전자 껍질이 꽉 차 매우 안정하므로 화학 반응에 전혀 관여하지 않아 <strong>원자가 전자는 0개</strong>입니다.
            </span>
          </div>
        )}
      </div>

      {/* 4. 원소 상세 텍스트 설명 */}
      <div className="rounded-lg bg-slate-100/60 p-3 border border-slate-200 text-sm leading-relaxed text-slate-600 space-y-1.5">
        <p><strong className="text-slate-800">특징:</strong> {element.description}</p>
        <p><strong className="text-slate-800">주요 쓰임새:</strong> {element.usage}</p>
      </div>

    </div>
  );
}

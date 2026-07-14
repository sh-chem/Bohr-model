/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ElementData } from '../types';
import { ELEMENTS } from '../data';
import { Check, Lock } from 'lucide-react';

interface PeriodicTableProps {
  selectedElement: ElementData;
  onSelectElement: (element: ElementData) => void;
  solvedNumbers: Set<number>;
}

export default function PeriodicTable({
  selectedElement,
  onSelectElement,
  solvedNumbers,
}: PeriodicTableProps) {
  // 그룹 정보정의 (1, 2, 13, 14, 15, 16, 17, 18)
  const GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
  const PERIODS = [1, 2, 3, 4];

  // 특정 주기와 족에 맞는 원소 반환
  const getElementByPos = (period: number, group: number): ElementData | undefined => {
    return ELEMENTS.find((el) => el.period === period && el.group === group);
  };

  // 금속, 비금속, 준금속 분류 도우미 함수
  const getClassification = (num: number): 'metal' | 'metalloid' | 'nonmetal' => {
    const metals = [3, 4, 11, 12, 13, 19, 20]; // Li, Be, Na, Mg, Al, K, Ca
    const metalloids = [5, 14]; // B, Si
    if (metals.includes(num)) return 'metal';
    if (metalloids.includes(num)) return 'metalloid';
    return 'nonmetal';
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-lg backdrop-blur-md">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-mono text-sm font-semibold tracking-wider text-cyan-700">
          PERIODIC TABLE : 원소 주기율표 (1~4주기)
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-blue-100 border border-blue-300" />
            <span className="text-blue-800 font-bold">금속</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-amber-100 border border-amber-300" />
            <span className="text-amber-800 font-bold">준금속</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-purple-100 border border-purple-300" />
            <span className="text-purple-800 font-bold">비금속</span>
          </div>
          <div className="h-3.5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-cyan-50 border border-cyan-400" />
            <span>선택됨</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-emerald-50 border border-emerald-300" />
            <span>완료</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-600">
            <span>수집율: {solvedNumbers.size} / 20</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-1" id="periodic-table-scroll-container">
        <div className="min-w-[640px] space-y-1">
          {/* 족 헤더 */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-[10px] font-bold text-slate-400">
            <div></div> {/* 주기를 위한 공간 */}
            {GROUPS.map((g) => (
              <div key={g} className="py-1">
                {g}족
              </div>
            ))}
          </div>

          {/* 주기별 행 */}
          {PERIODS.map((period) => (
            <div key={period} className="grid grid-cols-9 gap-1 items-stretch">
              {/* 주기 라벨 */}
              <div className="flex items-center justify-center rounded-lg bg-slate-100/60 font-mono text-[11px] font-bold text-slate-500 border border-transparent">
                {period}주기
              </div>

              {/* 각 족의 칸 */}
              {GROUPS.map((group) => {
                const el = getElementByPos(period, group);
                if (!el) {
                  // 비어있는 칸 (예: 1주기 2족~17족)
                  return (
                    <div
                       key={`empty-${period}-${group}`}
                      className="rounded-lg bg-slate-50 border border-dashed border-slate-200/50 min-h-[58px]"
                    />
                  );
                }

                const isSelected = selectedElement.number === el.number;
                const isSolved = solvedNumbers.has(el.number);
                const classification = getClassification(el.number);

                // 분류별 파스텔 톤 색상 사전 정의
                const classColors = {
                  metal: {
                    bg: "bg-blue-100/80 border-blue-200/90 hover:bg-blue-200/70 hover:border-blue-300 text-blue-950",
                    selectedBg: "bg-blue-200 border-cyan-500 ring-2 ring-cyan-500/40 text-blue-950 font-bold",
                    solvedBg: "bg-blue-100 border-emerald-400 hover:bg-blue-200/60 hover:border-emerald-500 text-blue-950",
                    symbol: "text-blue-900",
                    name: "text-blue-700"
                  },
                  metalloid: {
                    bg: "bg-amber-100/80 border-amber-200/90 hover:bg-amber-200/70 hover:border-amber-300 text-amber-950",
                    selectedBg: "bg-amber-200 border-cyan-500 ring-2 ring-cyan-500/40 text-amber-950 font-bold",
                    solvedBg: "bg-amber-100 border-emerald-400 hover:bg-amber-200/60 hover:border-emerald-500 text-amber-950",
                    symbol: "text-amber-900",
                    name: "text-amber-700"
                  },
                  nonmetal: {
                    bg: "bg-purple-100/80 border-purple-200/90 hover:bg-purple-200/70 hover:border-purple-300 text-purple-950",
                    selectedBg: "bg-purple-200 border-cyan-500 ring-2 ring-cyan-500/40 text-purple-950 font-bold",
                    solvedBg: "bg-purple-100 border-emerald-400 hover:bg-purple-200/60 hover:border-emerald-500 text-purple-950",
                    symbol: "text-purple-900",
                    name: "text-purple-700"
                  }
                };

                const colors = classColors[classification];

                // 원소 카드 스타일링
                let cardClass = "relative flex flex-col justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 select-none min-h-[58px] border ";
                let symbolClass = "text-center font-arial text-base font-extrabold tracking-tight ";
                // 한글 원소 이름을 기존 text-[9px]에서 1.3배 확대하여 text-xs(12px)로 지정
                let nameClass = "text-center text-xs truncate ";

                if (isSelected) {
                  cardClass += colors.selectedBg + " shadow-md shadow-cyan-500/5";
                  symbolClass += colors.symbol + " font-black scale-105";
                  nameClass += colors.name + " font-bold";
                } else if (isSolved) {
                  cardClass += colors.solvedBg + " shadow-sm shadow-emerald-500/5";
                  symbolClass += colors.symbol;
                  nameClass += colors.name + " font-medium";
                } else {
                  cardClass += colors.bg;
                  symbolClass += colors.symbol;
                  nameClass += "text-slate-500";
                }

                return (
                  <div
                    key={el.number}
                    onClick={() => onSelectElement(el)}
                    className={cardClass}
                    id={`periodic-cell-${el.symbol}`}
                    title={`${el.name} (양성자: ${el.protons}개, 전자: ${el.electrons}개)`}
                  >
                    {/* 최상단 원자 번호 */}
                    <div className="flex justify-between items-center font-mono text-[9px] text-slate-400">
                      <span className={isSelected ? "text-cyan-700 font-bold" : "text-slate-400"}>{el.number}</span>
                      {isSolved && (
                        <span className="flex items-center text-[8px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold font-sans scale-[0.85] origin-right shadow-xs border border-emerald-200">
                          완료
                        </span>
                      )}
                    </div>

                    {/* 중심 기호 */}
                    <div className={symbolClass}>
                      {el.symbol}
                    </div>

                    {/* 하단 한글 이름 */}
                    <div className={nameClass}>
                      {el.name}
                    </div>

                    {/* 선택 인디케이터 (글로우 바) */}
                    {isSelected && (
                      <div className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full bg-cyan-500 shadow-sm shadow-cyan-500" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 모바일 횡스크롤 안내 */}
      <p className="mt-2 text-center text-[10px] text-slate-400 block md:hidden">
        ← 좌우로 드래그하면 전체 주기율표를 볼 수 있습니다 →
      </p>
    </div>
  );
}

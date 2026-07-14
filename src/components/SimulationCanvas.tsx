/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { ElementData, SimulationStats } from '../types';
import { Play, Pause, Zap, Trash2, HelpCircle, Award, CheckCircle, ShieldAlert } from 'lucide-react';

interface SimulationCanvasProps {
  element: ElementData;
  placedCounts: number[]; // [shell1, shell2, shell3]
  setPlacedCounts: React.Dispatch<React.SetStateAction<number[]>>;
  onClear: () => void;
  onCheck: () => void;
  isCorrect: boolean | null;
  isOrbiting: boolean;
  simulationStats: SimulationStats;
}

// 각 전자 껍질의 총 슬롯 수 N 중에서 E개의 전자를 최대한 균등 대칭 배치하기 위한 도우미 함수
function getDistributedIndices(N: number, E: number): boolean[] {
  const result = new Array(N).fill(false);
  if (E <= 0) return result;
  if (E >= N) {
    result.fill(true);
    return result;
  }
  for (let i = 0; i < E; i++) {
    const idx = Math.floor((i * N) / E);
    result[idx] = true;
  }
  return result;
}

export interface SimulationCanvasRef {
  triggerCelebration: () => void;
}

// forwardRef를 사용하여 App에서 직접 축하 효과(파티클 폭발)를 트리거할 수 있도록 구성
export const SimulationCanvas = forwardRef<SimulationCanvasRef, SimulationCanvasProps>(({
  element,
  placedCounts,
  setPlacedCounts,
  onClear,
  onCheck,
  isCorrect,
  isOrbiting,
  simulationStats
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const [hoveredShell, setHoveredShell] = useState<number | null>(null);

  // 드래그 상태 관리
  const [isDraggingNew, setIsDraggingNew] = useState<boolean>(false);
  const [isDraggingExisting, setIsDraggingExisting] = useState<boolean>(false);
  const [dragStartShellIdx, setDragStartShellIdx] = useState<number | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  // 공전 각도 보존
  const anglesRef = useRef<number[]>([0, 0, 0, 0]);
  // 파티클 시스템
  const particlesRef = useRef<any[]>([]);

  // 각 껍질의 수용량 초과 경고 상태 관리
  const [shellWarningActive, setShellWarningActive] = useState<boolean[]>([false, false, false, false]);

  const triggerShellWarning = (shellIdx: number) => {
    setShellWarningActive((prev) => {
      const next = [...prev];
      next[shellIdx] = true;
      return next;
    });
    setTimeout(() => {
      setShellWarningActive((prev) => {
        const next = [...prev];
        next[shellIdx] = false;
        return next;
      });
    }, 800);
  };

  // 경고 파티클 생성 함수 (초과 드롭 시 발생)
  const createWarningParticles = (x: number, y: number) => {
    const colors = ['#ef4444', '#f43f5e', '#b91c1c'];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      particlesRef.current.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02
      });
    }
  };

  // 부모 컴포넌트에 트리거 노출
  useImperativeHandle(ref, () => ({
    triggerCelebration() {
      createExplosion();
    }
  }));

  // 주기율표 껍질별 최대 개수 한계 정의
  const MAX_SHELL_CAPACITIES = [2, 8, 8, 8];

  // 창 리사이즈 및 컨테이너 반응형 크기 감지
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      // 가로세로 정비율 1:1 유지
      const size = Math.max(320, Math.min(width, height, 580));
      setDimensions({ width: size, height: size });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 캔버스 크기 반영
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
  }, [dimensions]);

  // 파티클 생성 함수 (성공 시 폭발)
  const createExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const colors = ['#00f2fe', '#9d4edd', '#ff007f', '#39ff14', '#ffff00'];

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02
      });
    }
  };

  // 주요 렌더링 루프 (Bohr 모델 그리기)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let nucleusVibeOffset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const minSize = Math.min(width, height);

      // 궤도(껍질) 반지름 계산 (화면 비율에 따라 동적 설정)
      // 최외각 껍질(R4)의 글자가 우측 캔버스를 벗어나지 않도록 배율을 조절합니다.
      const R1 = minSize * 0.12; // 첫 번째 전자 껍질
      const R2 = minSize * 0.22; // 두 번째 전자 껍질
      const R3 = minSize * 0.32; // 세 번째 전자 껍질
      const R4 = minSize * 0.41; // 네 번째 전자 껍질
      const shellRadii = [R1, R2, R3, R4];

      // 1. 배경 클리어 및 우주/사이버 그리드 그리기
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // 사이버 그리드 라인 그리기
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. 공전 각도 업데이트 (공전 궤도 회전 속도 설정)
      if (isOrbiting) {
        anglesRef.current[0] += 0.012; // 1주기 껍질은 빠르게
        anglesRef.current[1] += 0.007; // 2주기 껍질은 중간
        anglesRef.current[2] += 0.004; // 3주기 껍질은 느리게
        anglesRef.current[3] += 0.002; // 4주기 껍질은 아주 느리게
      }

      // 3. 껍질 개수(주기) 가이드 라인 그리기
      const activeShellCount = element.period; // 선택된 원소의 실제 주기 개수

      for (let i = 0; i < 4; i++) {
        let radius = shellRadii[i];
        const isCurrentActive = i < activeShellCount;
        const isWarning = shellWarningActive[i];

        if (isWarning) {
          // 최대 수용량 초과 시 일시적으로 크기를 빠르게 진동시키는 경고 애니메이션
          const vibration = Math.sin(Date.now() * 0.05) * 3.5;
          radius += vibration;
        }

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);

        // 드래그 마우스가 해당 껍질 근처에 호버되었는지 또는 수용량 초과 경고 상태인지에 따른 강조
        if (isWarning) {
          ctx.strokeStyle = '#ef4444'; // 붉은색 경고 피드백
          ctx.lineWidth = 3.5;
          ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
          ctx.shadowBlur = 18;
          ctx.setLineDash([4, 4]); // 촘촘한 경고용 대시 패턴
        } else if (hoveredShell === i) {
          ctx.strokeStyle = '#0ea5e9';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#0ea5e9';
          ctx.shadowBlur = 15;
        } else if (isCurrentActive) {
          ctx.strokeStyle = 'rgba(147, 51, 234, 0.35)'; // 활성화된 전자 껍질 (보라색 파스텔)
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 6]);
          ctx.shadowColor = 'rgba(147, 51, 234, 0.15)';
          ctx.shadowBlur = 5;
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'; // 미사용 껍질 비활성화 점선
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 8]);
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.setLineDash([]); // 대시 설정 초기화
        ctx.shadowBlur = 0;  // 글로우 해제

        // 껍질 텍스트 라벨 (전자 껍질 표시 - 가독성 향상을 위해 글씨 크기를 키우고 간격 미세 조정)
        ctx.font = 'bold 12px sans-serif';
        if (isWarning) {
          ctx.fillStyle = '#ef4444'; // 경고 시 붉은색 텍스트
        } else {
          ctx.fillStyle = isCurrentActive ? 'rgba(147, 51, 234, 0.9)' : 'rgba(148, 163, 184, 0.45)';
        }
        ctx.textAlign = 'left';
        const line1 = `${['첫 번째', '두 번째', '세 번째', '네 번째'][i]}`;
        const line2 = isWarning ? '수용량 초과!' : '전자 껍질';
        ctx.fillText(line1, cx + radius - 20, cy - 7);
        ctx.fillText(line2, cx + radius - 20, cy + 8);

        // 빈 배치 가이드 슬롯 점들 및 전자들을 통합해서 그리기 (전자가 슬롯 내부에 들어가도록 융합)
        if (isCurrentActive) {
          const maxCap = MAX_SHELL_CAPACITIES[i];
          const shellAngleOffset = anglesRef.current[i];
          const electronCount = placedCounts[i];
          // 기존 전자를 껍질에서 잡아서 드래그 중이라면, 그 껍질의 전자는 하나 적게 그려줍니다.
          const drawCount = isDraggingExisting && dragStartShellIdx === i ? Math.max(0, electronCount - 1) : electronCount;
          
          const distributed = getDistributedIndices(maxCap, drawCount);
          
          for (let s = 0; s < maxCap; s++) {
            const slotAngle = (s * (Math.PI * 2)) / maxCap + shellAngleOffset;
            const sx = cx + Math.cos(slotAngle) * radius;
            const sy = cy + Math.sin(slotAngle) * radius;

            if (distributed[s]) {
              // 전자 구체 그리기
              ctx.beginPath();
              ctx.arc(sx, sy, 7.5, 0, Math.PI * 2);
              
              // 전자의 음전하 색상 (형광 시안/네온 노랑)
              const eGrad = ctx.createRadialGradient(sx - 2, sy - 2, 1, sx, sy, 7.5);
              eGrad.addColorStop(0, '#ffffff');
              eGrad.addColorStop(0.3, '#0ea5e9'); // sky-500
              eGrad.addColorStop(1, '#0369a1'); // sky-700
              ctx.fillStyle = eGrad;
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1;
              ctx.shadowColor = 'rgba(14, 165, 233, 0.4)';
              ctx.shadowBlur = 8;
              ctx.fill();
              ctx.stroke();
              ctx.shadowBlur = 0;

              // 전자 내부 '-' 마이너스 기호 표시
              ctx.font = 'bold 9px monospace';
              ctx.fillStyle = '#ffffff';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('-', sx, sy - 0.5);
            } else {
              // 빈 가이드 슬롯 구멍 그리기
              ctx.beginPath();
              ctx.arc(sx, sy, 4, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
              ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)';
              ctx.lineWidth = 1;
              ctx.fill();
              ctx.stroke();
            }
          }
        }
      }

      // 4. 원자핵 그리기 (가운데 진동 효과 포함)
      nucleusVibeOffset += 0.05;
      const vibeX = Math.sin(nucleusVibeOffset) * 0.4;
      const vibeY = Math.cos(nucleusVibeOffset * 1.5) * 0.4;
      const ncx = cx + vibeX;
      const ncy = cy + vibeY;

      // 원자핵 배경 방사형 글로우
      const grad = ctx.createRadialGradient(ncx, ncy, 5, ncx, ncy, minSize * 0.09);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      grad.addColorStop(0.5, 'rgba(147, 51, 234, 0.2)');
      grad.addColorStop(1, 'rgba(248, 250, 252, 0)');
      ctx.beginPath();
      ctx.arc(ncx, ncy, minSize * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // 원자핵 중심 원형 바디
      ctx.beginPath();
      ctx.arc(ncx, ncy, minSize * 0.065, 0, Math.PI * 2);
      ctx.fillStyle = '#fff1f2';
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(225, 29, 72, 0.3)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 원자핵 내부 텍스트 표기 (양성자 수 p+)
      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#be123c';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${element.protons}+`, ncx, ncy - 2);

      ctx.font = '9px monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText(`p:${element.protons} n:${element.neutrons}`, ncx, ncy + 13);

      // 6. 전자 공급 장치 (Electron Source / Dispenser) 그리기
      const dispX = width - 60;
      const dispY = height - 60;
      const dispRadius = 24;
      const distToDisp = Math.hypot(dragPos.x - dispX, dragPos.y - dispY);
      const isHoveringDisp = isDraggingExisting && distToDisp < 45;

      // 전자 공급 장치 베이스 글로우
      ctx.beginPath();
      ctx.arc(dispX, dispY, isHoveringDisp ? dispRadius * 1.3 : dispRadius, 0, Math.PI * 2);
      ctx.fillStyle = isHoveringDisp ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.05)';
      ctx.strokeStyle = isHoveringDisp ? '#ef4444' : '#0ea5e9'; // 드래그 회수 중일 땐 붉은색 강조 피드백
      ctx.lineWidth = isHoveringDisp ? 3 : 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fill();

      // 공급소 내부 구형 대기 전자
      ctx.beginPath();
      ctx.arc(dispX, dispY, isHoveringDisp ? 12 : 9, 0, Math.PI * 2);
      const dispEGrad = ctx.createRadialGradient(dispX - 2, dispY - 2, 1, dispX, dispY, isHoveringDisp ? 12 : 9);
      dispEGrad.addColorStop(0, '#ffffff');
      dispEGrad.addColorStop(0.4, isHoveringDisp ? '#ef4444' : '#0ea5e9');
      dispEGrad.addColorStop(1, isHoveringDisp ? '#b91c1c' : '#0369a1');
      ctx.fillStyle = dispEGrad;
      ctx.strokeStyle = isHoveringDisp ? '#ef4444' : '#0ea5e9';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = isHoveringDisp ? 'rgba(239, 68, 68, 0.6)' : 'rgba(14, 165, 233, 0.5)';
      ctx.shadowBlur = isHoveringDisp ? 15 : 10;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = isHoveringDisp ? 'bold 12px monospace' : 'bold 10px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('-', dispX, dispY);

      // 공급 장치 텍스트 설명 (글자 크기를 이전 크기의 2/3인 12px, 9px로 조정 및 오프셋 복원)
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = isHoveringDisp ? '#dc2626' : '#0284c7';
      ctx.fillText(isHoveringDisp ? '여기에 드롭하여 회수' : '전자 공급소', dispX, dispY - (isHoveringDisp ? 38 : 33));
      ctx.font = '9px monospace';
      ctx.fillStyle = isHoveringDisp ? 'rgba(220, 38, 38, 0.7)' : 'rgba(2, 132, 199, 0.7)';
      ctx.fillText(isHoveringDisp ? 'RELEASE' : 'DRAG ME!', dispX, dispY + (isHoveringDisp ? 38 : 33));

      // 7. 새로 드래그 중인 전자 또는 회수 드래그 중인 전자 그리기
      if (isDraggingNew || isDraggingExisting) {
        ctx.beginPath();
        ctx.arc(dragPos.x, dragPos.y, 8, 0, Math.PI * 2);
        const dragGrad = ctx.createRadialGradient(dragPos.x - 2, dragPos.y - 2, 1, dragPos.x, dragPos.y, 8);
        dragGrad.addColorStop(0, '#ffffff');
        dragGrad.addColorStop(0.3, isDraggingExisting ? '#f43f5e' : '#22c55e'); // 회수 중일 땐 장미빛 네온, 새 전자는 초록색 네온
        dragGrad.addColorStop(1, isDraggingExisting ? '#be123c' : '#15803d');
        ctx.fillStyle = dragGrad;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.shadowColor = isDraggingExisting ? 'rgba(244, 63, 94, 0.5)' : 'rgba(34, 197, 94, 0.5)';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('-', dragPos.x, dragPos.y);

        // --- 툴팁 그리기 ---
        ctx.save();
        
        let title = '';
        let subtitle = '';
        
        if (hoveredShell !== null) {
          const shellNames = ['첫 번째', '두 번째', '세 번째', '네 번째'];
          title = `${shellNames[hoveredShell]} 전자 껍질`;
          subtitle = `최대 수용: ${MAX_SHELL_CAPACITIES[hoveredShell]}개`;
        } else {
          title = '전자를 전자 껍질';
          subtitle = '위에 올려놓으세요';
        }
        
        ctx.font = 'bold 11px sans-serif';
        const titleWidth = ctx.measureText(title).width;
        ctx.font = '10px sans-serif';
        const subtitleWidth = ctx.measureText(subtitle).width;
        
        const paddingX = 10;
        const paddingY = 8;
        const boxWidth = Math.max(titleWidth, subtitleWidth) + paddingX * 2;
        const boxHeight = 36;
        
        let tooltipX = dragPos.x + 15;
        let tooltipY = dragPos.y + 15;
        
        // 캔버스 밖으로 나가지 않도록 가두기
        if (tooltipX + boxWidth > width) {
          tooltipX = dragPos.x - boxWidth - 15;
        }
        if (tooltipY + boxHeight > height) {
          tooltipY = dragPos.y - boxHeight - 15;
        }
        
        ctx.beginPath();
        const rRadius = 6;
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(tooltipX, tooltipY, boxWidth, boxHeight, rRadius);
        } else {
          ctx.rect(tooltipX, tooltipY, boxWidth, boxHeight);
        }
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; // slate-900 반투명
        ctx.strokeStyle = hoveredShell !== null ? '#0ea5e9' : 'rgba(148, 163, 184, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = hoveredShell !== null ? 'rgba(14, 165, 233, 0.3)' : 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // 텍스트 렌더링
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = hoveredShell !== null ? '#ffffff' : '#f1f5f9';
        ctx.fillText(title, tooltipX + paddingX, tooltipY + paddingY);
        
        ctx.font = '10px sans-serif';
        ctx.fillStyle = hoveredShell !== null ? '#38bdf8' : '#94a3b8'; // sky-400 or slate-400
        ctx.fillText(subtitle, tooltipX + paddingX, tooltipY + paddingY + 14);
        
        ctx.restore();
      }

      // 8. 파티클 물리 업데이트 및 그리기 (축하 효과)
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98; // 공기 저항
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [element, placedCounts, isOrbiting, isDraggingNew, isDraggingExisting, dragPos, hoveredShell, dimensions, shellWarningActive]);

  // 마우스 및 터치 좌표 획득 도우미
  const getEventCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // 반응형 스케일 비율 계산
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    return { x, y };
  };

  // 마우스/터치 다운 이벤트 핸들러
  const handleDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getEventCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // 전자 공급소 위치 감지
    const dispX = width - 60;
    const dispY = height - 60;
    const distToDisp = Math.hypot(coords.x - dispX, coords.y - dispY);

    if (distToDisp < 30) {
      // 드래그 시작 (공급소에서 새 전자 가져옴)
      setIsDraggingNew(true);
      setDragPos(coords);
      if (e.cancelable) e.preventDefault();
    } else {
      // 껍질 근처 기존 전자 드래그 시작 (공급소로 회수용)
      const cx = width / 2;
      const cy = height / 2;
      const distToCenter = Math.hypot(coords.x - cx, coords.y - cy);
      const minSize = Math.min(width, height);

      const R1 = minSize * 0.12;
      const R2 = minSize * 0.22;
      const R3 = minSize * 0.32;
      const R4 = minSize * 0.41;
      const shellRadii = [R1, R2, R3, R4];
      const tolerance = 25; // 기존 전자를 드래그해서 잡을 수 있는 반경 감도

      let clickedShellIdx = -1;
      for (let i = 0; i < element.period; i++) {
        if (Math.abs(distToCenter - shellRadii[i]) < tolerance) {
          clickedShellIdx = i;
          break;
        }
      }

      // 유효한 껍질 범위이고 해당 껍질에 전자가 존재하면 드래그 시작
      if (clickedShellIdx !== -1 && placedCounts[clickedShellIdx] > 0) {
        setIsDraggingExisting(true);
        setDragStartShellIdx(clickedShellIdx);
        setDragPos(coords);
        if (e.cancelable) e.preventDefault();
      }
    }
  };

  // 마우스/터치 무브 이벤트 핸들러
  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingNew && !isDraggingExisting) return;

    const coords = getEventCoords(e);
    setDragPos(coords);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const distToCenter = Math.hypot(coords.x - cx, coords.y - cy);
    const minSize = Math.min(canvas.width, canvas.height);

    const R1 = minSize * 0.12;
    const R2 = minSize * 0.22;
    const R3 = minSize * 0.32;
    const R4 = minSize * 0.41;
    const snapTolerance = 25;

    // 공급소에서 가져오거나 기존 전자를 드래그할 때 껍질 가이드 강조
    if (isDraggingNew || isDraggingExisting) {
      if (Math.abs(distToCenter - R1) < snapTolerance && element.period >= 1) {
        setHoveredShell(0);
      } else if (Math.abs(distToCenter - R2) < snapTolerance && element.period >= 2) {
        setHoveredShell(1);
      } else if (Math.abs(distToCenter - R3) < snapTolerance && element.period >= 3) {
        setHoveredShell(2);
      } else if (Math.abs(distToCenter - R4) < snapTolerance && element.period >= 4) {
        setHoveredShell(3);
      } else {
        setHoveredShell(null);
      }
    }
  };

  // 드래그 종료 핸들러
  const handleUp = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsDraggingNew(false);
      setIsDraggingExisting(false);
      setDragStartShellIdx(null);
      setHoveredShell(null);
      return;
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const minSize = Math.min(canvas.width, canvas.height);

    const R1 = minSize * 0.12;
    const R2 = minSize * 0.22;
    const R3 = minSize * 0.32;
    const R4 = minSize * 0.41;
    const snapTolerance = 25;

    // 1. 새 전자를 껍질 위에 끌어다 드롭하여 배치하는 판정
    if (isDraggingNew) {
      setIsDraggingNew(false);
      setHoveredShell(null);

      const distToCenter = Math.hypot(dragPos.x - cx, dragPos.y - cy);
      let targetShellIdx = -1;

      if (Math.abs(distToCenter - R1) < snapTolerance && element.period >= 1) {
        targetShellIdx = 0;
      } else if (Math.abs(distToCenter - R2) < snapTolerance && element.period >= 2) {
        targetShellIdx = 1;
      } else if (Math.abs(distToCenter - R3) < snapTolerance && element.period >= 3) {
        targetShellIdx = 2;
      } else if (Math.abs(distToCenter - R4) < snapTolerance && element.period >= 4) {
        targetShellIdx = 3;
      }

      if (targetShellIdx !== -1) {
        const currentCount = placedCounts[targetShellIdx];
        const maxCap = MAX_SHELL_CAPACITIES[targetShellIdx];

        if (currentCount < maxCap) {
          setPlacedCounts((prev) => {
            const next = [...prev];
            next[targetShellIdx] += 1;
            return next;
          });
        } else {
          triggerShellWarning(targetShellIdx);
          createWarningParticles(dragPos.x, dragPos.y);
        }
      }
    }

    // 2. 기존 전자를 공급소 영역으로 끌어다 드롭하여 회수하는 판정
    if (isDraggingExisting) {
      setIsDraggingExisting(false);
      setHoveredShell(null);
      const sourceShellIdx = dragStartShellIdx;
      setDragStartShellIdx(null);

      if (sourceShellIdx !== null) {
        const dispX = canvas.width - 60;
        const dispY = canvas.height - 60;
        const distToDisp = Math.hypot(dragPos.x - dispX, dragPos.y - dispY);

        // 공급소 근처 45px 반경으로 끌어놓으면 회수 처리
        if (distToDisp < 45) {
          setPlacedCounts((prev) => {
            const next = [...prev];
            next[sourceShellIdx] = Math.max(0, next[sourceShellIdx] - 1);
            return next;
          });
        }
      }
    }
  };

  // 더블클릭 액션 비활성화
  const handleDoubleClick = () => {};

  // 개별 껍질 수동 증감 카운터 컨트롤바
  const handleShellCountChange = (shellIdx: number, increment: boolean) => {
    setPlacedCounts((prev) => {
      const next = [...prev];
      if (increment) {
        next[shellIdx] = Math.min(MAX_SHELL_CAPACITIES[shellIdx], next[shellIdx] + 1);
      } else {
        next[shellIdx] = Math.max(0, next[shellIdx] - 1);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4 h-full" ref={containerRef} id="canvas-simulation-container">
      
      {/* 시뮬레이터 상단 컨트롤러 및 안내 가이드 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm">
        {/* 안내 가이드 (왼쪽 배치, 앞에 점 표시) */}
        <div className="flex items-center gap-2 pl-1">
          <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
          <h4 className="font-sans font-extrabold text-slate-800 tracking-tight text-xs sm:text-sm">
            마우스로 전자를 드래그하여 배치하세요.
          </h4>
        </div>

        {/* 조작 버튼 영역 (오른쪽 배치) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold px-3 py-1.5 text-slate-700 hover:text-slate-900 shadow-sm transition-all cursor-pointer"
            id="clear-simulation-btn"
          >
            <Trash2 className="h-3.5 w-3.5 text-slate-500" /> 초기화
          </button>
          <button
            onClick={onCheck}
            className="rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 font-bold text-xs text-white px-3.5 py-1.5 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            id="check-simulation-btn"
          >
            <Award className="h-3.5 w-3.5" /> 자가 채점 완료
          </button>
        </div>
      </div>

      {/* 성공/실패 메시지 피드백 */}
      {isCorrect !== null && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`rounded-lg p-3 text-sm leading-relaxed border flex items-start gap-2 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <strong className="text-slate-900">성공! 완벽한 전자 배치입니다.</strong><br />
                  {element.name}(은)는 {element.period}주기 {element.group}족 원소로, 원자가 전자 수는 <strong className="text-amber-600 font-bold">{element.valenceElectrons}개</strong>입니다.
                </div>
              </>
            ) : (
              <>
                <ShieldAlert className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">배치 오류 발생!</strong><br />
                  {simulationStats.errorMessage || `현재 배치된 전자는 ${simulationStats.placedElectronsCount}개입니다. 안쪽 껍질부터 최대 수용량(첫 번째 전자 껍질: 2개, 두 번째 전자 껍질: 8개, 세 번째 전자 껍질: 8개, 네 번째 전자 껍질: 8개)을 고려하여 총 ${element.electrons}개를 채워보세요.`}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2D 캔버스 하우징 */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        


        <canvas
          ref={canvasRef}
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
          onMouseLeave={handleUp}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={handleUp}
          className="block touch-none cursor-crosshair rounded-xl max-w-full"
          id="bohr-simulation-canvas"
        />
      </div>

    </div>
  );
});

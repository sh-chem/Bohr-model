/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data';
import { Check, X, RotateCcw, Award, Lightbulb, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function QuizSection() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur-md text-slate-800" id="quiz-section-wrapper">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="font-mono text-sm font-bold tracking-wider text-purple-700 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-purple-600 animate-bounce" /> CONCEPT QUIZ : 개념 확인 평가
        </h3>
        {!quizFinished && (
          <span className="font-mono text-xs text-slate-500">
            문항: {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {quizFinished ? (
          /* 퀴즈 결과 화면 */
          <motion.div
            key="quiz-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-50 border border-purple-200">
              <Award className="h-10 w-10 text-purple-600" />
              <div className="absolute inset-0 rounded-full border border-purple-300 animate-ping opacity-30" />
            </div>

            <h4 className="font-mono text-lg font-bold text-purple-700">학습 평가 완료!</h4>
            <p className="mt-2 text-sm text-slate-600">
              총 {QUIZ_QUESTIONS.length}문제 중 <strong className="text-slate-900 text-base">{score}</strong>문제를 맞추셨습니다.
            </p>

            {/* 점수별 피드백 메시지 */}
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {score === QUIZ_QUESTIONS.length
                ? "완벽합니다! 원자의 전자 배치와 원자가 전자 개념을 마스터하셨습니다."
                : score >= QUIZ_QUESTIONS.length / 2
                ? "훌륭한 이해도를 가지고 계시네요! 조금만 더 학습하면 완벽해질 수 있습니다."
                : "시뮬레이터를 통해 전자 배치를 직접 연습하며 오답 해설을 다시 읽어보세요."}
            </p>

            <button
              onClick={handleRestartQuiz}
              className="mt-6 flex items-center gap-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-sm font-semibold px-4 py-2 text-slate-700 hover:text-slate-950 transition-all cursor-pointer shadow-sm"
              id="quiz-restart-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" /> 다시 풀어보기
            </button>
          </motion.div>
        ) : (
          /* 진행 중인 문제 화면 */
          <motion.div
            key={`quiz-question-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* 문제 발문 */}
            <h4 className="text-base font-semibold text-slate-800 min-h-[40px] leading-relaxed">
              Q{currentQuestionIndex + 1}. {currentQuestion.question}
            </h4>

            {/* 보기 리스트 */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;
                
                // 보기 버튼 스타일 정의
                let btnStyle = "w-full text-left p-3.5 rounded-lg text-sm transition-all duration-150 border flex items-center justify-between ";
                
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle += "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold";
                  } else if (isSelected) {
                    btnStyle += "bg-red-50 border-red-400 text-red-900 font-semibold";
                  } else {
                    btnStyle += "bg-slate-50 border-slate-100 text-slate-400";
                  }
                } else {
                  if (isSelected) {
                    btnStyle += "bg-purple-50 border-purple-400 text-purple-900 font-semibold";
                  } else {
                    btnStyle += "bg-white border-slate-200 hover:bg-slate-50 text-slate-700";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleOptionSelect(idx)}
                    className={btnStyle}
                    id={`quiz-option-${currentQuestionIndex}-${idx}`}
                  >
                    <span className="pr-4">{idx + 1}. {option}</span>
                    {isAnswerSubmitted && isCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <X className="h-4 w-4 shrink-0 text-red-600" />}
                  </button>
                );
              })}
            </div>

            {/* 하단 확인 / 다음 버튼 및 해설 */}
            <div className="pt-2">
              {!isAnswerSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className={`w-full py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all cursor-pointer ${
                    selectedOption !== null
                      ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/15"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50"
                  }`}
                  id="quiz-submit-btn"
                >
                  제출 및 정답 확인
                </button>
              ) : (
                <div className="space-y-4">
                  {/* 정답 해설 패널 */}
                  <div className="rounded-lg bg-amber-50/50 p-3.5 border border-amber-200 text-sm leading-relaxed text-slate-600 flex items-start gap-2.5">
                    <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-900">개념 해설: </strong>
                      {currentQuestion.explanation}
                    </div>
                  </div>

                  {/* 다음 문제로 버튼 */}
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    id="quiz-next-btn"
                  >
                    {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? (
                      <>다음 문제 풀기 <ArrowRight className="h-3.5 w-3.5" /></>
                    ) : (
                      <>퀴즈 결과 보기 <Check className="h-3.5 w-3.5 text-purple-600" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

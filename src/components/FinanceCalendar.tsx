import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';

interface FinanceCalendarProps {
  transactions: Transaction[];
  onAddTransactionClick: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const FinanceCalendar: React.FC<FinanceCalendarProps> = ({
  transactions,
  onAddTransactionClick,
  onDeleteTransaction,
}) => {
  // Calendar state: default to Nov 2024 (matching screenshot), but allow navigation
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [currentMonth, setCurrentMonth] = useState<number>(11); // 1-indexed (11 = Nov)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2024-11-15');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 is Sunday

  // Previous Month
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Next Month
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Date dot status lookup: map date string "YYYY-MM-DD" to { hasIncome, hasExpense }
  const dateStatusMap = useMemo(() => {
    const map = new Map<string, { hasIncome: boolean; hasExpense: boolean }>();
    transactions.forEach((tx) => {
      const existing = map.get(tx.date) || { hasIncome: false, hasExpense: false };
      if (tx.type === 'income') existing.hasIncome = true;
      if (tx.type === 'expense') existing.hasExpense = true;
      map.set(tx.date, existing);
    });
    return map;
  }, [transactions]);

  // Selected date transactions
  const selectedDateTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchDate = tx.date === selectedDateStr;
      if (!matchDate) return false;
      if (filterType === 'income') return tx.type === 'income';
      if (filterType === 'expense') return tx.type === 'expense';
      return true;
    });
  }, [transactions, selectedDateStr, filterType]);

  // Selected date summary
  const dailySummary = useMemo(() => {
    const forDay = transactions.filter((tx) => tx.date === selectedDateStr);
    const income = forDay.filter((tx) => tx.type === 'income').reduce((acc, cur) => acc + cur.amount, 0);
    const expense = forDay.filter((tx) => tx.type === 'expense').reduce((acc, cur) => acc + cur.amount, 0);
    return {
      income,
      expense,
      net: income - expense,
    };
  }, [transactions, selectedDateStr]);

  // Formatted date label (e.g. 11월 15일 요약)
  const selectedDayLabel = useMemo(() => {
    const parts = selectedDateStr.split('-');
    if (parts.length === 3) {
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      return `${m}월 ${d}일 요약`;
    }
    return '일별 요약';
  }, [selectedDateStr]);

  // Helper for icon based on category
  const getCategoryIcon = (category: string, type: TransactionType) => {
    if (category.includes('카드') || category.includes('결제')) return 'credit_card';
    if (category.includes('배달') || category.includes('매출')) return 'storefront';
    if (category.includes('식자재') || category.includes('음식')) return 'restaurant_menu';
    if (category.includes('소모품') || category.includes('비품')) return 'shopping_bag';
    if (category.includes('임대') || category.includes('공과금')) return 'receipt_long';
    if (category.includes('인건비') || category.includes('급여')) return 'badge';
    return type === 'income' ? 'payments' : 'shopping_cart';
  };

  return (
    <main className="px-4 lg:px-8 py-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Calendar Section */}
      <section 
        id="finance-calendar-card"
        className="bg-[#ffffff] rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-5 border border-[#eceef0]"
      >
        {/* Month Header */}
        <div className="flex justify-between items-center px-2 mb-4">
          <button
            id="btn-calendar-prev"
            onClick={handlePrevMonth}
            className="p-2 text-[#41474e] hover:text-[#21638d] rounded-full hover:bg-[#f2f4f6] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">chevron_left</span>
          </button>
          
          <h2 className="text-xl font-bold text-[#191c1e] tracking-tight">
            {currentYear}년 {currentMonth}월
          </h2>

          <button
            id="btn-calendar-next"
            onClick={handleNextMonth}
            className="p-2 text-[#41474e] hover:text-[#21638d] rounded-full hover:bg-[#f2f4f6] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">chevron_right</span>
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#71787f] mb-3">
          <div className="text-[#ba1a1a]">일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div className="text-[#ba1a1a]">토</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4 text-center text-sm font-medium">
          {/* Empty slots for first day offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-10" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayOfWeek = (firstDayOfWeek + idx) % 7;
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;
            const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = selectedDateStr === dateStr;
            const status = dateStatusMap.get(dateStr);

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => setSelectedDateStr(dateStr)}
                className="flex flex-col items-center justify-center gap-1 cursor-pointer group py-1"
              >
                {isSelected ? (
                  <div className="w-8 h-8 flex items-center justify-center bg-[#21638d] text-white font-bold rounded-full shadow-[0px_4px_10px_rgba(33,99,141,0.35)] scale-105 transition-transform">
                    {dayNum}
                  </div>
                ) : (
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors group-hover:bg-[#f2f4f6] ${
                      isSunday || isSaturday ? 'text-[#ba1a1a] font-medium' : 'text-[#191c1e]'
                    }`}
                  >
                    {dayNum}
                  </span>
                )}

                {/* Income / Expense Status Dots */}
                <div className="flex gap-1 h-1.5 items-center">
                  {status?.hasIncome && (
                    <div className="w-1.5 h-1.5 bg-[#00629d] rounded-full" title="수입 있음" />
                  )}
                  {status?.hasExpense && (
                    <div className="w-1.5 h-1.5 bg-[#ba1a1a] rounded-full" title="지출 있음" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Summary Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm sm:text-base font-bold text-[#41474e]">
            {selectedDayLabel}
          </h3>
          <span className="text-xs text-[#71787f] font-mono">{selectedDateStr}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Income Card */}
          <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-[#00629d] border-y border-r border-[#eceef0]">
            <span className="text-xs sm:text-sm font-semibold text-[#71787f] block mb-1">
              총 수입
            </span>
            <span className="text-lg sm:text-2xl font-bold text-[#00629d]">
              +{dailySummary.income.toLocaleString('ko-KR')}원
            </span>
          </div>

          {/* Expense Card */}
          <div className="bg-[#ffffff] rounded-2xl p-4 sm:p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-[#ba1a1a] border-y border-r border-[#eceef0]">
            <span className="text-xs sm:text-sm font-semibold text-[#71787f] block mb-1">
              총 지출
            </span>
            <span className="text-lg sm:text-2xl font-bold text-[#ba1a1a]">
              -{dailySummary.expense.toLocaleString('ko-KR')}원
            </span>
          </div>
        </div>
      </section>

      {/* Transaction List Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm sm:text-base font-bold text-[#41474e] flex items-center gap-2">
            <span>거래 내역</span>
            <span className="text-xs font-semibold text-[#71787f] bg-[#eceef0] px-2 py-0.5 rounded-full">
              {selectedDateTransactions.length}건
            </span>
          </h3>

          {/* Filter button */}
          <div className="relative">
            <button
              id="btn-filter-transactions"
              onClick={() => setShowFilterModal(!showFilterModal)}
              className="text-xs sm:text-sm font-semibold text-[#21638d] hover:bg-[#cfe5ff] px-2.5 py-1 rounded-lg flex items-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>
                {filterType === 'all' ? '전체 필터' : filterType === 'income' ? '수입만' : '지출만'}
              </span>
            </button>

            {showFilterModal && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-[#eceef0] rounded-xl shadow-lg py-1 z-30 animate-in fade-in">
                <button
                  onClick={() => { setFilterType('all'); setShowFilterModal(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${filterType === 'all' ? 'text-[#21638d] bg-[#f2f4f6]' : 'text-[#41474e]'}`}
                >
                  전체 보기
                </button>
                <button
                  onClick={() => { setFilterType('income'); setShowFilterModal(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${filterType === 'income' ? 'text-[#00629d] bg-[#f2f4f6]' : 'text-[#41474e]'}`}
                >
                  수입만 (+내역)
                </button>
                <button
                  onClick={() => { setFilterType('expense'); setShowFilterModal(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${filterType === 'expense' ? 'text-[#ba1a1a] bg-[#f2f4f6]' : 'text-[#41474e]'}`}
                >
                  지출만 (-내역)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Items */}
        <div className="bg-[#ffffff] rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#eceef0] flex flex-col overflow-hidden divide-y divide-[#eceef0]">
          {selectedDateTransactions.length === 0 ? (
            <div className="p-8 text-center text-[#71787f]">
              <span className="material-symbols-outlined text-[36px] text-[#c1c7cf] mb-2 block">
                receipt_long
              </span>
              <p className="text-sm font-medium">선택하신 일자에 기록된 거래 내역이 없습니다.</p>
              <p className="text-xs text-[#999] mt-1">하단의 '내역 수동 추가' 버튼을 눌러 새 거래를 등록해보세요.</p>
            </div>
          ) : (
            selectedDateTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const iconName = getCategoryIcon(tx.category, tx.type);

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-[#f8f9fb] transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isIncome ? 'bg-[#cfe5ff] text-[#00629d]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {iconName}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base font-semibold text-[#191c1e]">
                        {tx.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[#71787f]">
                        <span>{tx.time}</span>
                        {tx.paymentMethod && (
                          <>
                            <span>·</span>
                            <span>{tx.paymentMethod}</span>
                          </>
                        )}
                        {tx.memo && (
                          <span className="hidden sm:inline text-[#999]">({tx.memo})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        isIncome ? 'text-[#00629d]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{tx.amount.toLocaleString('ko-KR')}원
                    </span>

                    {/* Delete item button */}
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      title="내역 삭제"
                      className="opacity-0 group-hover:opacity-100 text-[#71787f] hover:text-[#ba1a1a] p-1 rounded-md transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Transaction Button */}
        <button
          id="btn-add-transaction-manual"
          onClick={onAddTransactionClick}
          className="mt-2 w-full h-12 bg-[#90caf9] hover:bg-[#93cdfc] text-[#08557e] rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-98 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>내역 수동 추가</span>
        </button>
      </section>
    </main>
  );
};

import React, { useState } from 'react';
import { Transaction, TransactionCategory, TransactionType } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES_INCOME: TransactionCategory[] = [
  '현장 결제 (카드)',
  '배달 플랫폼 매출',
  '모바일 간편결제',
  '현금 결제',
  '기타 수입',
];

const CATEGORIES_EXPENSE: TransactionCategory[] = [
  '식자재 구매',
  '소모품 구매',
  '임대료/공과금',
  '인건비 지급',
  '기타 지출',
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('income');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory>('현장 결제 (카드)');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('2024-11-15');
  const [time, setTime] = useState<string>('15:00');
  const [paymentMethod, setPaymentMethod] = useState<string>('신용카드');
  const [memo, setMemo] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!numAmount || numAmount <= 0) return;

    onAddTransaction({
      date,
      time,
      title: title.trim() || category,
      category,
      type,
      amount: numAmount,
      paymentMethod,
      memo: memo.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setMemo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#eceef0] space-y-4 animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-2 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#21638d] text-[22px]">receipt_long</span>
            <h3 className="text-lg font-bold text-[#191c1e]">거래 내역 수동 등록</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#71787f] hover:text-[#191c1e] p-1 rounded-full hover:bg-[#f2f4f6]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Type Toggle: Income vs Expense */}
          <div className="grid grid-cols-2 gap-2 bg-[#f2f4f6] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('현장 결제 (카드)');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-[#00629d] text-white shadow-xs'
                  : 'text-[#41474e] hover:text-[#191c1e]'
              }`}
            >
              + 수입 (매출)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('식자재 구매');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-[#ba1a1a] text-white shadow-xs'
                  : 'text-[#41474e] hover:text-[#191c1e]'
              }`}
            >
              - 지출 (비용)
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-[#41474e] mb-1">금액 (원)</label>
            <div className="relative">
              <input
                type="number"
                required
                min="100"
                step="100"
                placeholder="예: 120000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-base font-bold text-[#191c1e] focus:border-[#21638d] outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71787f]">
                KRW
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#41474e] mb-1">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#191c1e] focus:border-[#21638d] outline-none font-medium"
            >
              {(type === 'income' ? CATEGORIES_INCOME : CATEGORIES_EXPENSE).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#41474e] mb-1">거래 항목명 (선택)</label>
            <input
              type="text"
              placeholder={`예: ${category}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-xs text-[#191c1e] focus:border-[#21638d] outline-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#41474e] mb-1">일자</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-xs text-[#191c1e] focus:border-[#21638d] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#41474e] mb-1">시간</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-xs text-[#191c1e] focus:border-[#21638d] outline-none"
              />
            </div>
          </div>

          {/* Memo */}
          <div>
            <label className="block text-xs font-bold text-[#41474e] mb-1">메모</label>
            <input
              type="text"
              placeholder="특이사항 및 고객 정보"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-xs text-[#191c1e] focus:border-[#21638d] outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#f2f4f6] text-[#41474e] rounded-xl text-xs font-bold"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!amount}
              className="flex-1 py-2.5 bg-[#21638d] hover:bg-[#00629d] disabled:bg-[#c1c7cf] text-white rounded-xl text-xs font-bold transition-colors"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

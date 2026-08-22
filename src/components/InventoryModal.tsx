import React from 'react';
import { InventoryItem } from '../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onRestockItem: (itemId: string, amount: number) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onRestockItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#eceef0] space-y-4 animate-in zoom-in-95 max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[24px]">inventory_2</span>
            <div>
              <h3 className="text-lg font-bold text-[#191c1e]">재고 현황 및 긴급 발주</h3>
              <p className="text-xs text-[#71787f]">최소 권장 재고 미만 품목을 확인하고 즉시 입고 처리하세요.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#71787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#f2f4f6]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Inventory List */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
          {inventory.map((item) => {
            const isCritical = item.status === 'critical';
            const isWarning = item.status === 'warning';
            return (
              <div
                key={item.id}
                className="bg-[#f8f9fb] p-4 rounded-xl border border-[#e0e3e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#191c1e]">{item.name}</span>
                    <span className="text-[10px] bg-[#eceef0] text-[#526069] px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    {isCritical && (
                      <span className="text-[10px] bg-[#ffdad6] text-[#ba1a1a] font-bold px-2 py-0.5 rounded-md">
                        위험
                      </span>
                    )}
                    {isWarning && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                        부족 주의
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#41474e] mt-1">
                    현재 수량: <span className="font-bold text-[#191c1e]">{item.currentStock} {item.unit}</span> / 최소 권장: {item.minRequiredStock} {item.unit}
                  </p>
                  <p className="text-[10px] text-[#71787f]">
                    최근 입고일: {item.lastRestocked}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => onRestockItem(item.id, 5)}
                    className="bg-[#cfe5ff] hover:bg-[#99cbff] text-[#004069] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    +5 입고
                  </button>
                  <button
                    onClick={() => onRestockItem(item.id, 10)}
                    className="bg-[#21638d] hover:bg-[#00629d] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    +10 입고
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#eceef0]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#41474e] rounded-xl text-xs sm:text-sm font-bold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AreaStatus, InventoryItem, NavigationTab, WeeklyRevenueData } from '../types';

interface HomeDashboardProps {
  areas: AreaStatus[];
  inventory: InventoryItem[];
  weeklyData: WeeklyRevenueData[];
  onSelectTab: (tab: NavigationTab) => void;
  onOpenInventory: () => void;
  waitlistCount: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  areas,
  inventory,
  weeklyData,
  onSelectTab,
  onOpenInventory,
  waitlistCount,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('목');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'KRW'>('KRW');

  const lowStockCount = inventory.filter((item) => item.status !== 'normal').length;

  const activeDayData = weeklyData.find((d) => d.day === selectedDay) || weeklyData[3];
  const todayData = weeklyData.find((d) => d.isToday) || weeklyData[3];

  const formatAmount = (amountUSD: number) => {
    if (currencyMode === 'USD') {
      return `$${amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₩${(amountUSD * 1350).toLocaleString('ko-KR')}원`;
  };

  // Compact form for the chart axis / floating badges, respects the same currency toggle
  const formatAmountCompact = (amountUSD: number) => {
    if (amountUSD === 0) return '0';
    if (currencyMode === 'USD') {
      return amountUSD >= 1000
        ? `$${(amountUSD / 1000).toFixed(amountUSD % 1000 === 0 ? 0 : 1)}k`
        : `$${amountUSD.toLocaleString('en-US')}`;
    }
    const krw = amountUSD * 1350;
    return krw >= 10000 ? `₩${Math.round(krw / 10000).toLocaleString('ko-KR')}만` : `₩${krw.toLocaleString('ko-KR')}`;
  };

  return (
    <main className="px-4 lg:px-8 py-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Greeting Header */}
      <section className="bg-gradient-to-r from-[#ffffff] to-[#f2f4f6] p-6 rounded-2xl border border-[#e0e3e5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#08557e] bg-[#cfe5ff] px-2.5 py-0.5 rounded-full">
                실시간 매장 운영 중
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191c1e] tracking-tight">
              좋은 아침입니다, 사장님!
            </h2>
            <p className="text-sm sm:text-base text-[#41474e] mt-1">
              오늘도 활기찬 하루 되세요. 현재 매장 현황입니다.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Currency toggle */}
            <div className="bg-[#e6e8ea] p-1 rounded-xl flex items-center text-xs font-semibold text-[#41474e]">
              <button
                id="btn-currency-usd"
                onClick={() => setCurrencyMode('USD')}
                className={`px-3 py-1 rounded-lg transition-all ${currencyMode === 'USD' ? 'bg-white text-[#21638d] shadow-xs' : ''}`}
              >
                USD ($)
              </button>
              <button
                id="btn-currency-krw"
                onClick={() => setCurrencyMode('KRW')}
                className={`px-3 py-1 rounded-lg transition-all ${currencyMode === 'KRW' ? 'bg-white text-[#21638d] shadow-xs' : ''}`}
              >
                KRW (₩)
              </button>
            </div>

            <button
              id="btn-quick-finance"
              onClick={() => onSelectTab('finance')}
              className="bg-[#21638d] hover:bg-[#00629d] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
              <span>가계부 바로가기</span>
            </button>
          </div>
        </div>
      </section>

      {/* Summary Cards Grid (2x2) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div 
          onClick={() => onSelectTab('finance')}
          className="bg-[#ffffff] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(144,202,249,0.2)] transition-all cursor-pointer border border-[#f2f4f6] group"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#cfe5ff] flex items-center justify-center text-[#21638d] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#41474e]">오늘 매출</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#191c1e]">
            {formatAmount(todayData.amount)}
          </div>
          <div className="text-xs font-semibold text-[#00629d] mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] font-bold">trending_up</span>
            <span>어제 대비 +12%</span>
          </div>
        </div>

        {/* Visitors */}
        <div 
          onClick={() => onSelectTab('store')}
          className="bg-[#ffffff] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(144,202,249,0.2)] transition-all cursor-pointer border border-[#f2f4f6] group"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#e0e3e5] flex items-center justify-center text-[#526069] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#41474e]">방문객 수</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#191c1e]">
            142 <span className="text-sm font-normal text-[#71787f]">명</span>
          </div>
          <div className="text-xs font-medium text-[#71787f] mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            <span>방금 전 업데이트</span>
          </div>
        </div>

        {/* Stock Alerts */}
        <div 
          onClick={onOpenInventory}
          className="bg-[#ffffff] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(255,180,180,0.25)] transition-all cursor-pointer border border-[#f2f4f6] group relative overflow-hidden"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#41474e]">재고 알림</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#191c1e]">
            {lowStockCount} <span className="text-sm font-normal text-[#41474e]">품목</span>
          </div>
          <div className="text-xs font-bold text-[#ba1a1a] mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">warning</span>
            <span>부족 주의 (발주 필요)</span>
          </div>
        </div>

        {/* Coupons */}
        <div 
          onClick={() => onSelectTab('store')}
          className="bg-[#ffffff] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(144,202,249,0.2)] transition-all cursor-pointer border border-[#f2f4f6] group"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#cfe5ff] flex items-center justify-center text-[#00629d] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">local_activity</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#41474e]">쿠폰 사용</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#191c1e]">
            12 <span className="text-sm font-normal text-[#41474e]">건</span>
          </div>
          <div className="text-xs font-medium text-[#41474e] mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
            <span>활성 캠페인 중</span>
          </div>
        </div>
      </section>

      {/* Weekly Revenue Chart Section */}
      <section className="bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#f2f4f6]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#191c1e]">주간 매출 추이</h3>
            <p className="text-xs text-[#71787f]">각 요일 막대를 클릭하여 상세 일일 매출을 확인할 수 있습니다.</p>
          </div>
          <div className="bg-[#f2f4f6] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#21638d] flex items-center gap-2 self-start">
            <span>선택 요일:</span>
            <span className="font-bold text-[#001e30]">{activeDayData.fullDay} ({activeDayData.date})</span>
            <span className="bg-white px-2 py-0.5 rounded-md text-[#00629d] font-bold">
              {formatAmount(activeDayData.amount)}
            </span>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="h-56 flex items-end gap-2 sm:gap-4 justify-between px-2 pt-8">
          {/* Y Axis Labels */}
          <div className="flex flex-col justify-between h-full text-xs text-[#71787f] pr-3 border-r border-[#e0e3e5]/60 pb-6">
            <span>{formatAmountCompact(1500)}</span>
            <span>{formatAmountCompact(1000)}</span>
            <span>{formatAmountCompact(500)}</span>
            <span>{formatAmountCompact(0)}</span>
          </div>

          {/* Bars Area */}
          <div className="flex-1 flex items-end gap-2 sm:gap-4 justify-between px-2 sm:px-4 relative h-full pb-6">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
              <div className="border-t border-[#eceef0] w-full" />
              <div className="border-t border-[#eceef0] w-full" />
              <div className="border-t border-[#eceef0] w-full" />
              <div className="border-t border-[#c1c7cf] w-full" />
            </div>

            {/* Bars */}
            {weeklyData.map((item) => {
              const isSelected = selectedDay === item.day;
              return (
                <div
                  key={item.day}
                  onClick={() => setSelectedDay(item.day)}
                  className="flex flex-col items-center gap-2 group flex-1 z-10 cursor-pointer h-full justify-end"
                >
                  <div className="w-full max-w-[48px] h-full flex items-end justify-center relative">
                    {/* Tooltip / Badge for selected/hovered */}
                    {(isSelected || item.isToday) && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2d3133] text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-md whitespace-nowrap z-20 animate-in fade-in slide-in-from-bottom-1">
                        {formatAmountCompact(item.amount)}
                      </div>
                    )}

                    {/* Bar visual */}
                    <div
                      style={{ height: `${item.percentage}%` }}
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#90caf9] ring-2 ring-[#21638d]'
                          : item.isToday
                          ? 'bg-[#90caf9]'
                          : 'bg-[#e0e3e5] hover:bg-[#b7c6d0]'
                      }`}
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={`text-xs sm:text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'text-[#21638d] font-bold scale-110'
                        : item.isToday
                        ? 'text-[#08557e] font-bold'
                        : 'text-[#41474e]'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Store Status Live Section */}
      <section className="bg-[#ffffff] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#f2f4f6]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg sm:text-xl font-bold text-[#191c1e] flex items-center gap-2.5">
            <span>매장 실시간 현황</span>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ba1a1a] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ba1a1a]" />
            </span>
          </h3>

          <button
            id="btn-manage-tables"
            onClick={() => onSelectTab('store')}
            className="text-xs font-bold text-[#21638d] hover:text-[#00629d] flex items-center gap-1 hover:underline"
          >
            <span>테이블 및 대기 관리</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="space-y-3">
          {areas.map((area) => {
            const percentage = Math.round((area.occupied / area.total) * 100);
            const isHigh = percentage >= 80;
            const barColor = isHigh ? 'bg-[#ba1a1a]' : area.id === 'area-patio' ? 'bg-[#00629d]' : 'bg-[#4fafff]';

            return (
              <div
                key={area.id}
                onClick={() => onSelectTab('store')}
                className="bg-[#f8f9fb] hover:bg-[#f2f4f6] rounded-xl p-4 transition-all flex items-center justify-between border border-[#eceef0] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#21638d]">
                    <span className="material-symbols-outlined text-[22px]">{area.icon}</span>
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-semibold text-[#191c1e] block">
                      {area.name}
                    </span>
                    <span className="text-xs text-[#71787f]">
                      점유율 {percentage}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 sm:w-36 bg-[#e0e3e5] rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-[#41474e] w-14 text-right">
                    {area.occupied} / {area.total}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Waitlist Card */}
          <div
            id="card-waitlist-status"
            onClick={() => onSelectTab('store')}
            className="bg-[#f8f9fb] hover:bg-[#cfe5ff]/40 rounded-xl p-4 transition-all flex items-center justify-between border border-transparent hover:border-[#90caf9] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#526069]">
                <span className="material-symbols-outlined text-[22px]">list_alt</span>
              </div>
              <div>
                <span className="text-sm sm:text-base font-semibold text-[#191c1e] block">
                  대기 명단 (Waitlist)
                </span>
                <span className="text-xs text-[#71787f]">현장 방문 대기 고객</span>
              </div>
            </div>

            <div className="bg-[#eceef0] text-[#191c1e] px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-xs sm:text-sm">
              <span className="material-symbols-outlined text-[16px] text-[#21638d]">person_pin</span>
              <span>{waitlistCount} 팀 대기 중</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

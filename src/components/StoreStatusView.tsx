import React, { useState } from 'react';
import { AreaStatus, CouponItem, InventoryItem, WaitlistCustomer } from '../types';

interface StoreStatusViewProps {
  areas: AreaStatus[];
  waitlist: WaitlistCustomer[];
  inventory: InventoryItem[];
  coupons: CouponItem[];
  onToggleTableOccupancy: (areaId: string, tableId: string) => void;
  onAddWaitlistCustomer: (name: string, phone: string, partySize: number) => void;
  onUpdateWaitlistStatus: (id: string, status: 'waiting' | 'called' | 'seated' | 'cancelled') => void;
  onRestockItem: (itemId: string, amount: number) => void;
}

export const StoreStatusView: React.FC<StoreStatusViewProps> = ({
  areas,
  waitlist,
  inventory,
  coupons,
  onToggleTableOccupancy,
  onAddWaitlistCustomer,
  onUpdateWaitlistStatus,
  onRestockItem,
}) => {
  const [activeAreaTab, setActiveAreaTab] = useState<string>('all');
  const [showAddWaitlistModal, setShowAddWaitlistModal] = useState<boolean>(false);
  const [waitlistName, setWaitlistName] = useState<string>('');
  const [waitlistPhone, setWaitlistPhone] = useState<string>('');
  const [waitlistPartySize, setWaitlistPartySize] = useState<number>(2);

  const activeWaitlist = waitlist.filter((w) => w.status === 'waiting' || w.status === 'called');

  const handleAddWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistName.trim()) return;
    onAddWaitlistCustomer(waitlistName.trim(), waitlistPhone.trim() || '010-0000-0000', waitlistPartySize);
    setWaitlistName('');
    setWaitlistPhone('');
    setWaitlistPartySize(2);
    setShowAddWaitlistModal(false);
  };

  return (
    <main className="px-4 lg:px-8 py-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Store Header Status */}
      <section className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#eceef0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#191c1e]">
                매장 좌석 및 대기열 실시간 관리
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#41474e]">
              테이블 카드를 터치하여 즉시 착석/퇴석을 처리하고 대기 손님을 호출할 수 있습니다.
            </p>
          </div>

          <button
            id="btn-open-add-waitlist"
            onClick={() => setShowAddWaitlistModal(true)}
            className="bg-[#21638d] hover:bg-[#00629d] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>대기 손님 등록</span>
          </button>
        </div>
      </section>

      {/* Area Table Zones */}
      <section className="space-y-4">
        {/* Area Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveAreaTab('all')}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
              activeAreaTab === 'all'
                ? 'bg-[#21638d] text-white shadow-xs'
                : 'bg-white border border-[#e0e3e5] text-[#41474e] hover:bg-[#f2f4f6]'
            }`}
          >
            전체 구역 ({areas.reduce((acc, a) => acc + a.occupied, 0)}/{areas.reduce((acc, a) => acc + a.total, 0)}석)
          </button>

          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setActiveAreaTab(area.id)}
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeAreaTab === area.id
                  ? 'bg-[#21638d] text-white shadow-xs'
                  : 'bg-white border border-[#e0e3e5] text-[#41474e] hover:bg-[#f2f4f6]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{area.icon}</span>
              <span>{area.name} ({area.occupied}/{area.total})</span>
            </button>
          ))}
        </div>

        {/* Areas & Tables Grid */}
        <div className="space-y-6">
          {areas
            .filter((area) => activeAreaTab === 'all' || activeAreaTab === area.id)
            .map((area) => {
              const occRate = Math.round((area.occupied / area.total) * 100);
              return (
                <div
                  key={area.id}
                  className="bg-[#ffffff] rounded-2xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#eceef0] space-y-4"
                >
                  {/* Area Title */}
                  <div className="flex items-center justify-between border-b border-[#eceef0] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#cfe5ff] text-[#004069] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">{area.icon}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#191c1e]">{area.name}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#41474e]">
                        점유율 {occRate}%
                      </span>
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-[#21638d]">
                      {area.occupied} / {area.total} 인 착석 중
                    </span>
                  </div>

                  {/* Tables in this Area */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {area.tables.map((table) => {
                      return (
                        <div
                          key={table.id}
                          onClick={() => onToggleTableOccupancy(area.id, table.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative group ${
                            table.isOccupied
                              ? 'bg-[#cfe5ff]/30 border-[#90caf9] hover:bg-[#cfe5ff]/50'
                              : 'bg-[#f8f9fb] border-[#e0e3e5] hover:border-[#90caf9] hover:bg-[#f2f4f6]'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-sm text-[#191c1e]">
                              {table.tableNumber}번 테이블
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                table.isOccupied
                                  ? 'bg-[#00629d] text-white'
                                  : 'bg-[#e0e3e5] text-[#41474e]'
                              }`}
                            >
                              {table.isOccupied ? '사용 중' : '비어 있음'}
                            </span>
                          </div>

                          <div className="text-xs text-[#41474e] space-y-1">
                            <div className="flex items-center gap-1 text-[#71787f]">
                              <span className="material-symbols-outlined text-[14px]">group</span>
                              <span>최대 {table.seats}인석</span>
                            </div>
                            {table.isOccupied && (
                              <>
                                <div className="font-medium text-[#004069]">
                                  착석 인원: {table.guestCount || table.seats}명
                                </div>
                                <div className="text-[11px] text-[#71787f]">
                                  이용 시간: {table.seatedTime || '30분 전'}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#c1c7cf]/40 flex justify-between items-center text-[11px] font-semibold">
                            <span className={table.isOccupied ? 'text-[#ba1a1a]' : 'text-[#21638d]'}>
                              {table.isOccupied ? '터치 시 퇴석' : '터치 시 착석'}
                            </span>
                            <span className="material-symbols-outlined text-[14px] text-[#71787f]">
                              swap_horiz
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#eceef0] space-y-4">
        <div className="flex items-center justify-between border-b border-[#eceef0] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#21638d] text-[22px]">list_alt</span>
            <h3 className="text-base sm:text-lg font-bold text-[#191c1e]">
              대기 명단 (Waitlist) - {activeWaitlist.length}팀 대기 중
            </h3>
          </div>
          <button
            onClick={() => setShowAddWaitlistModal(true)}
            className="text-xs font-bold text-[#21638d] hover:bg-[#cfe5ff] px-2.5 py-1 rounded-lg transition-colors"
          >
            + 추가
          </button>
        </div>

        {activeWaitlist.length === 0 ? (
          <div className="py-8 text-center text-[#71787f]">
            <span className="material-symbols-outlined text-[32px] text-[#c1c7cf] mb-1 block">
              person_check
            </span>
            <p className="text-sm font-semibold">현재 대기 중인 고객이 없습니다.</p>
            <p className="text-xs text-[#999] mt-0.5">매장 좌석이 가득 찼을 때 대기 손님을 등록하세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeWaitlist.map((cust) => (
              <div
                key={cust.id}
                className="bg-[#f8f9fb] rounded-xl p-4 border border-[#e0e3e5] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#191c1e]">{cust.name}</span>
                    <span className="text-xs bg-[#cfe5ff] text-[#004069] font-bold px-2 py-0.5 rounded-full">
                      {cust.partySize}명
                    </span>
                    {cust.status === 'called' && (
                      <span className="text-[10px] bg-[#ffdad6] text-[#93000a] font-bold px-2 py-0.5 rounded-full animate-bounce">
                        호출됨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#71787f] mt-1">
                    {cust.phone} · 대기 {cust.waitTimeMin}분째 ({cust.registeredAt} 등록)
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {cust.status === 'waiting' && (
                    <button
                      onClick={() => onUpdateWaitlistStatus(cust.id, 'called')}
                      className="bg-[#90caf9] text-[#08557e] hover:bg-[#93cdfc] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      호출
                    </button>
                  )}
                  <button
                    onClick={() => onUpdateWaitlistStatus(cust.id, 'seated')}
                    className="bg-[#21638d] text-white hover:bg-[#00629d] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    입장
                  </button>
                  <button
                    onClick={() => onUpdateWaitlistStatus(cust.id, 'cancelled')}
                    className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors"
                    title="취소"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inventory Alerts & Coupons Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Stock Alerts */}
        <section className="bg-[#ffffff] rounded-2xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#eceef0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#eceef0] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
                inventory_2
              </span>
              <h3 className="text-base font-bold text-[#191c1e]">재고 현황 및 부족 알림</h3>
            </div>
            <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
              부족 3건
            </span>
          </div>

          <div className="space-y-2">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-[#f8f9fb] rounded-xl border border-[#e0e3e5]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#191c1e]">
                      {item.name}
                    </span>
                    {item.status === 'critical' && (
                      <span className="text-[10px] bg-[#ffdad6] text-[#ba1a1a] font-bold px-1.5 py-0.5 rounded-md">
                        위험
                      </span>
                    )}
                    {item.status === 'warning' && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">
                        부족
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#71787f] mt-0.5">
                    현재: <span className="font-bold text-[#191c1e]">{item.currentStock}{item.unit}</span> / 최소 권장: {item.minRequiredStock}{item.unit}
                  </p>
                </div>

                <button
                  onClick={() => onRestockItem(item.id, 5)}
                  className="bg-[#cfe5ff] text-[#004069] hover:bg-[#99cbff] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                >
                  +5 {item.unit} 입고
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Coupons & Promotions */}
        <section className="bg-[#ffffff] rounded-2xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#eceef0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#eceef0] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00629d] text-[20px]">
                local_activity
              </span>
              <h3 className="text-base font-bold text-[#191c1e]">활성 쿠폰 및 이벤트 캠페인</h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              3개 진행중
            </span>
          </div>

          <div className="space-y-2">
            {coupons.map((cp) => (
              <div
                key={cp.id}
                className="p-3 bg-[#f8f9fb] rounded-xl border border-[#e0e3e5] flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#191c1e]">{cp.title}</h4>
                  <p className="text-[11px] text-[#71787f] mt-0.5">
                    혜택: <span className="text-[#00629d] font-semibold">{cp.discount}</span> · 사용 {cp.usedCount}/{cp.totalLimit}건
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#71787f] block font-mono">
                    ~{cp.expiry}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    사용가능
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Add Waitlist Customer Modal */}
      {showAddWaitlistModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#eceef0]">
              <h3 className="text-lg font-bold text-[#191c1e]">대기 손님 등록</h3>
              <button
                onClick={() => setShowAddWaitlistModal(false)}
                className="text-[#71787f] hover:text-[#191c1e] p-1 rounded-full"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddWaitlistSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#41474e] mb-1">고객명 / 닉네임</label>
                <input
                  type="text"
                  required
                  placeholder="예: 김민수"
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-sm text-[#191c1e] focus:border-[#21638d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#41474e] mb-1">연락처</label>
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={waitlistPhone}
                  onChange={(e) => setWaitlistPhone(e.target.value)}
                  className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-sm text-[#191c1e] focus:border-[#21638d] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#41474e] mb-1">방문 인원수</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setWaitlistPartySize(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        waitlistPartySize === num
                          ? 'bg-[#21638d] text-white border-[#21638d]'
                          : 'bg-[#f8f9fb] border-[#c1c7cf] text-[#41474e]'
                      }`}
                    >
                      {num}명
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWaitlistModal(false)}
                  className="flex-1 py-2.5 bg-[#f2f4f6] text-[#41474e] rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#21638d] text-white rounded-xl text-xs font-bold hover:bg-[#00629d]"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

import React from 'react';
import { NavigationTab } from '../types';

interface BottomNavBarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  return (
    <nav 
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-20 px-2 pb-safe bg-[#ffffff] shadow-[0px_-4px_20px_rgba(0,0,0,0.06)] border-t border-[#eceef0] rounded-t-2xl md:hidden"
    >
      {/* 홈 */}
      <button
        id="btn-tab-home"
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 active:scale-90 ${
          currentTab === 'home'
            ? 'bg-[#90caf9] text-[#08557e] rounded-2xl px-5 font-bold shadow-xs'
            : 'text-[#41474e] hover:bg-[#f2f4f6] rounded-xl'
        }`}
      >
        <span 
          className={`material-symbols-outlined mb-0.5 text-[22px] ${currentTab === 'home' ? 'fill' : ''}`}
        >
          home
        </span>
        <span className="text-[12px] font-medium leading-none">홈</span>
      </button>

      {/* 재무 현황 */}
      <button
        id="btn-tab-finance"
        onClick={() => onSelectTab('finance')}
        className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 active:scale-90 ${
          currentTab === 'finance'
            ? 'bg-[#cfe5ff] text-[#001d34] rounded-2xl px-5 font-bold shadow-xs'
            : 'text-[#41474e] hover:bg-[#f2f4f6] rounded-xl'
        }`}
      >
        <span 
          className={`material-symbols-outlined mb-0.5 text-[22px] ${currentTab === 'finance' ? 'fill' : ''}`}
        >
          account_balance_wallet
        </span>
        <span className="text-[12px] font-medium leading-none">재무 현황</span>
      </button>

      {/* 매장 상태 */}
      <button
        id="btn-tab-store"
        onClick={() => onSelectTab('store')}
        className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 active:scale-90 ${
          currentTab === 'store'
            ? 'bg-[#90caf9] text-[#08557e] rounded-2xl px-5 font-bold shadow-xs'
            : 'text-[#41474e] hover:bg-[#f2f4f6] rounded-xl'
        }`}
      >
        <span 
          className={`material-symbols-outlined mb-0.5 text-[22px] ${currentTab === 'store' ? 'fill' : ''}`}
        >
          storefront
        </span>
        <span className="text-[12px] font-medium leading-none">매장 상태</span>
      </button>

      {/* 커뮤니티 */}
      <button
        id="btn-tab-community"
        onClick={() => onSelectTab('community')}
        className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all duration-200 active:scale-90 ${
          currentTab === 'community'
            ? 'bg-[#90caf9] text-[#08557e] rounded-2xl px-5 font-bold shadow-xs'
            : 'text-[#41474e] hover:bg-[#f2f4f6] rounded-xl'
        }`}
      >
        <span 
          className={`material-symbols-outlined mb-0.5 text-[22px] ${currentTab === 'community' ? 'fill' : ''}`}
        >
          forum
        </span>
        <span className="text-[12px] font-medium leading-none">커뮤니티</span>
      </button>
    </nav>
  );
};

import React from 'react';
import { CategoryType, NavigationTab } from '../types';

interface SideNavBarProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenCreatePost: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeCategory,
  onSelectCategory,
  currentTab,
  onSelectTab,
  onOpenCreatePost,
}) => {
  const categoryItems: { label: CategoryType; icon: string }[] = [
    { label: '전체', icon: 'newspaper' },
    { label: '우리 동네 소식', icon: 'storefront' },
    { label: '나눔/장터', icon: 'shopping_bag' },
    { label: '구인구직', icon: 'work' },
    { label: '질문/답변', icon: 'forum' },
    { label: '일상 공유', icon: 'diversity_3' },
  ];

  return (
    <aside 
      id="desktop-sidebar"
      className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 p-4 flex flex-col hidden lg:flex bg-[#f8f9fb] border-r border-[#eceef0] z-30"
    >
      {/* Category Section */}
      <div className="mb-4 px-3 py-2">
        <h2 className="text-xl font-bold text-[#21638d]">Categories</h2>
        <p className="text-xs text-[#71787f]">Community Board</p>
      </div>

      <nav className="flex flex-col gap-1.5 flex-grow overflow-y-auto no-scrollbar">
        {categoryItems.map((item) => {
          const isSelected = currentTab === 'community' && activeCategory === item.label;
          return (
            <button
              key={item.label}
              id={`side-cat-${item.label}`}
              onClick={() => {
                onSelectTab('community');
                onSelectCategory(item.label);
              }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl transition-all duration-150 active:translate-x-1 ${
                isSelected
                  ? 'bg-[#cfe5ff] text-[#004069] font-bold shadow-xs'
                  : 'text-[#41474e] hover:bg-[#e6e8ea] font-medium'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'fill text-[#004069]' : 'text-[#71787f]'}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.label === '전체' ? '전체 게시글' : item.label}</span>
            </button>
          );
        })}

        <div className="my-3 border-t border-[#e0e3e5]" />

        {/* Quick App Views shortcuts */}
        <div className="px-3 py-1">
          <p className="text-xs font-bold text-[#71787f] uppercase tracking-wider mb-2">매장 관리 도구</p>
          <div className="space-y-1">
            <button
              id="side-quick-dashboard"
              onClick={() => onSelectTab('home')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                currentTab === 'home' ? 'bg-[#90caf9] text-[#08557e]' : 'text-[#41474e] hover:bg-[#e6e8ea]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>홈 대시보드</span>
            </button>
            <button
              id="side-quick-finance"
              onClick={() => onSelectTab('finance')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                currentTab === 'finance' ? 'bg-[#cfe5ff] text-[#001d34]' : 'text-[#41474e] hover:bg-[#e6e8ea]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>재무 캘린더 / 가계부</span>
            </button>
            <button
              id="side-quick-store"
              onClick={() => onSelectTab('store')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                currentTab === 'store' ? 'bg-[#90caf9] text-[#08557e]' : 'text-[#41474e] hover:bg-[#e6e8ea]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">table_bar</span>
              <span>좌석 및 대기열 관리</span>
            </button>
          </div>
        </div>
      </nav>

      {/* New Post Button */}
      <div className="mt-auto pt-4 border-t border-[#eceef0]">
        <button
          id="btn-sidebar-new-post"
          onClick={onOpenCreatePost}
          className="w-full bg-[#90caf9] text-[#08557e] font-bold text-sm py-3 rounded-xl h-[48px] hover:bg-[#93cdfc] transition-colors shadow-xs active:scale-98 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>New Post</span>
        </button>
      </div>
    </aside>
  );
};

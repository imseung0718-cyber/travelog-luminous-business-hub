import React, { useState } from 'react';
import { NavigationTab } from '../types';

interface TopNavBarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenCreatePost: () => void;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  isDesktopView: boolean;
  onToggleViewMode?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreatePost,
  unreadNotificationCount,
  onOpenNotifications,
  isDesktopView,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-[#ffffff] shadow-xs fixed top-0 left-0 w-full z-40 h-16 border-b border-[#eceef0] flex items-center justify-between px-4 lg:px-8">
      {/* Left Logo / Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger if applicable */}
        <button
          id="btn-mobile-menu"
          aria-label="메뉴"
          onClick={() => onSelectTab(currentTab === 'home' ? 'community' : 'home')}
          className="lg:hidden p-2 text-[#21638d] hover:bg-[#f2f4f6] rounded-full transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Profile Avatar in mobile top */}
        <div 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-8 h-8 rounded-full bg-[#cfe5ff] flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            alt="사장님 프로필"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCN_jg3l-9Gin67RZLcTCLXGxSzlhiwwk5AUh4pQhDEOSq36wHxGC2GzyIEleZiN0EJI68PLoF5-NfG790y-ZFctTADBh9N9uJxvrb8zlSbPj5F9iL0KvOmzb5fzb-dTVpZINxtYemKnIurK0XB18aLvk3ZLyPQwYYCeWACmG31affAx0NavoHg1F6QdFCOfjNCXtW-2IRanBaNq51RXftQhTaveIdWTqwSTxT5rfPkcWVr_2ggUO1EEA"
          />
        </div>

        <button 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 text-left group"
        >
          <span className="font-bold text-xl lg:text-2xl text-[#21638d] tracking-tight group-hover:text-[#00629d] transition-colors">
            {currentTab === 'community' ? 'Luminous Business Hub' : 'Travelog'}
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#cfe5ff] text-[#004069] rounded-full">
            사장님 모드
          </span>
        </button>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-[#f2f4f6] p-1 rounded-xl">
        <button
          id="nav-desktop-home"
          onClick={() => onSelectTab('home')}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            currentTab === 'home'
              ? 'bg-[#ffffff] text-[#21638d] shadow-xs'
              : 'text-[#41474e] hover:text-[#191c1e]'
          }`}
        >
          홈 대시보드
        </button>
        <button
          id="nav-desktop-finance"
          onClick={() => onSelectTab('finance')}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            currentTab === 'finance'
              ? 'bg-[#ffffff] text-[#21638d] shadow-xs'
              : 'text-[#41474e] hover:text-[#191c1e]'
          }`}
        >
          재무 현황
        </button>
        <button
          id="nav-desktop-store"
          onClick={() => onSelectTab('store')}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            currentTab === 'store'
              ? 'bg-[#ffffff] text-[#21638d] shadow-xs'
              : 'text-[#41474e] hover:text-[#191c1e]'
          }`}
        >
          매장 상태
        </button>
        <button
          id="nav-desktop-community"
          onClick={() => onSelectTab('community')}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            currentTab === 'community'
              ? 'bg-[#ffffff] text-[#21638d] shadow-xs'
              : 'text-[#41474e] hover:text-[#191c1e]'
          }`}
        >
          소상공인 커뮤니티
        </button>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification button */}
        <button
          id="btn-notifications"
          aria-label="알림"
          onClick={onOpenNotifications}
          className="relative text-[#41474e] hover:text-[#21638d] hover:bg-[#f2f4f6] p-2 rounded-full transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Profile Avatar / Account menu button on desktop */}
        <div className="relative">
          <button
            id="btn-account"
            aria-label="계정 관리"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="hidden sm:flex items-center gap-2 text-[#41474e] hover:bg-[#f2f4f6] px-2.5 py-1.5 rounded-full transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
            <span className="text-xs font-semibold text-[#191c1e]">카페 아라 사장님</span>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div 
              id="profile-dropdown-menu"
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#eceef0] py-3 px-4 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-[#eceef0]">
                <div className="w-10 h-10 rounded-full bg-[#cfe5ff] flex items-center justify-center font-bold text-[#004069]">
                  카
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#191c1e]">카페 아라</h4>
                  <p className="text-xs text-[#71787f]">cafe.ara@travelog.shop</p>
                </div>
              </div>
              <div className="py-2 space-y-1 text-sm text-[#41474e]">
                <div className="flex justify-between py-1.5 px-2 hover:bg-[#f2f4f6] rounded-lg cursor-pointer">
                  <span>매장 영업 상태</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">영업중 (ON)</span>
                </div>
                <div className="flex justify-between py-1.5 px-2 hover:bg-[#f2f4f6] rounded-lg cursor-pointer">
                  <span>가맹점 번호</span>
                  <span className="text-xs font-mono text-[#71787f]">#KR-82910</span>
                </div>
              </div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full mt-1 text-center py-2 text-xs font-semibold text-[#21638d] bg-[#cfe5ff] hover:bg-[#99cbff] rounded-xl transition-colors"
              >
                닫기
              </button>
            </div>
          )}
        </div>

        {/* Create Post Action Button */}
        <button
          id="btn-top-create-post"
          onClick={onOpenCreatePost}
          className="bg-[#90caf9] text-[#08557e] hover:bg-[#93cdfc] font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">edit_square</span>
          <span className="hidden sm:inline">Create Post</span>
          <span className="sm:hidden">글쓰기</span>
        </button>
      </div>
    </header>
  );
};

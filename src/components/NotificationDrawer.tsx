import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  timeAgo: string;
  type: 'order' | 'community' | 'inventory' | 'waitlist';
  unread: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNotificationAction?: (type: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: '새로운 댓글이 달렸습니다',
    desc: '바다 횟집 사장님이 "수박 빙수" 글에 댓글을 남겼습니다.',
    timeAgo: '2분 전',
    type: 'community',
    unread: true,
  },
  {
    id: 'n-2',
    title: '재고 부족 경고',
    desc: '국내산 수박 (특상) 재고가 2통 남았습니다. 발주를 권장합니다.',
    timeAgo: '15분 전',
    type: 'inventory',
    unread: true,
  },
  {
    id: 'n-3',
    title: '배달 플랫폼 정산 완료',
    desc: '배달 플랫폼 매출 +220,000원이 가계부에 자동 반영되었습니다.',
    timeAgo: '1시간 전',
    type: 'order',
    unread: false,
  },
  {
    id: 'n-4',
    title: '신규 대기 고객 접수',
    desc: '김서연 고객님 외 2명이 대기 명단에 등록되었습니다.',
    timeAgo: '2시간 전',
    type: 'waitlist',
    unread: false,
  },
];

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectNotificationAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-in fade-in">
      <div 
        className="w-full max-w-sm bg-white h-full shadow-2xl p-5 flex flex-col space-y-4 animate-in slide-in-from-right duration-200 border-l border-[#eceef0]"
      >
        <div className="flex justify-between items-center pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#21638d] text-[22px]">notifications</span>
            <h3 className="text-lg font-bold text-[#191c1e]">알림 센터</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#71787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#f2f4f6]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
          {INITIAL_NOTIFICATIONS.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectNotificationAction?.(item.type);
                onClose();
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                item.unread
                  ? 'bg-[#cfe5ff]/20 border-[#90caf9] hover:bg-[#cfe5ff]/35'
                  : 'bg-[#f8f9fb] border-[#e0e3e5] hover:bg-[#f2f4f6]'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#191c1e] flex items-center gap-1.5">
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                  )}
                  {item.title}
                </h4>
                <span className="text-[10px] text-[#71787f]">{item.timeAgo}</span>
              </div>
              <p className="text-xs text-[#41474e] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#eceef0]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#f2f4f6] text-[#41474e] rounded-xl text-xs font-bold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

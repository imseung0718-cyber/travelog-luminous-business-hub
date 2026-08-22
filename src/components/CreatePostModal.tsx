import React, { useState } from 'react';
import { CategoryType, Post } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newPost: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'userLiked' | 'comments'>) => void;
}

const PRESET_IMAGES = [
  { label: '방울토마토 나눔', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5MLSsSYPyvYVSre72xBGksjVQoaLEhmC67PsDGsRbOM_M_kBzNEe1sPJnx0Gt1z3MKJs2lTZtfUGUw-HW2eOXSB5-hrGkEbT0xjhx7Nzo9gEKbAtJokTyfthjlPd9v7LcIyWUy0sXyNKK1VdiIBK3ghr-RdII2LkZzlmkbCPnL6Vo_5X5yAxAVfdCxPw_V-tKUNJjoa85Ix-eObXPoaSM1IykZAvoLXAfuBMu8KcIp_TpGq4BeH6Jlg' },
  { label: '이미지 없음', url: '' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmitPost,
}) => {
  const [authorName, setAuthorName] = useState<string>('카페 아라');
  const [category, setCategory] = useState<CategoryType>('우리 동네 소식');
  const [content, setContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const finalImage = customImageUrl.trim() || imageUrl;

    onSubmitPost({
      authorName: authorName.trim() || '카페 아라',
      authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJwpGwwBP0Um7xpc7GQ0ncXSPxaw4yGtlFCKoAjjHUyQ47uzFMn4wntwFFCWDc_ngBbl-V2_yDAjlS7r8xDoX0lsT4JZFPtviJ4sOtul2gKp5EedSQPgCG1gPoFsEPmS1zYGq5DjwjjzkvuY7MkOlK64rkyF0VgZ-ouRWWQI-VJXcqDwcLqVeTpqBapQ1bLKRYJtyViKJpsChTIbhcmwXfQTJ1SNbWsINkjvq0L1hU6dVgzNebwn-5fA',
      authorInitial: authorName.slice(0, 1),
      authorColorClass: 'bg-[#cfe5ff] text-[#004069]',
      timeAgo: '방금 전',
      category,
      content: content.trim(),
      imageUrl: finalImage ? finalImage : undefined,
    });

    setContent('');
    setImageUrl('');
    setCustomImageUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#eceef0] space-y-5 animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#21638d] text-[24px]">edit_square</span>
            <h3 className="text-lg font-bold text-[#191c1e]">새 커뮤니티 글쓰기</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#71787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#f2f4f6] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#41474e] mb-1">작성자 (상호명)</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="예: 카페 아라"
                className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#191c1e] focus:border-[#21638d] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#41474e] mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#191c1e] focus:border-[#21638d] outline-none font-medium"
              >
                <option value="우리 동네 소식">우리 동네 소식</option>
                <option value="나눔/장터">나눔/장터</option>
                <option value="구인구직">구인구직</option>
                <option value="질문/답변">질문/답변</option>
                <option value="일상 공유">일상 공유</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#41474e] mb-1">게시글 내용</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="동네 소상공인 이웃들과 나누고 싶은 소식이나 꿀팁, 나눔, 구인 정보를 작성해주세요..."
              className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl p-3 text-xs sm:text-sm text-[#191c1e] focus:border-[#21638d] focus:ring-2 focus:ring-[#90caf9]/30 outline-none resize-none"
            />
          </div>

          {/* Image Selection / URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#41474e]">사진 첨부 (선택)</label>
            <div className="flex gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => {
                    setImageUrl(preset.url);
                    setCustomImageUrl('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    imageUrl === preset.url && !customImageUrl
                      ? 'bg-[#cfe5ff] text-[#004069] border-[#90caf9]'
                      : 'bg-[#f8f9fb] border-[#e0e3e5] text-[#41474e]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => {
                setCustomImageUrl(e.target.value);
                setImageUrl('');
              }}
              placeholder="또는 이미지 URL 직접 입력 (https://...)"
              className="w-full bg-[#f8f9fb] border border-[#c1c7cf] rounded-xl px-3 py-2 text-xs text-[#191c1e] focus:border-[#21638d] outline-none"
            />

            {(customImageUrl || imageUrl) && (
              <div className="w-full h-24 rounded-lg overflow-hidden border border-[#e0e3e5] bg-gray-50">
                <img
                  src={customImageUrl || imageUrl}
                  alt="미리보기"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#f2f4f6] text-[#41474e] hover:bg-[#e6e8ea] rounded-xl text-xs sm:text-sm font-bold transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex-1 py-3 bg-[#90caf9] hover:bg-[#93cdfc] disabled:bg-[#c1c7cf] text-[#08557e] rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              게시글 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

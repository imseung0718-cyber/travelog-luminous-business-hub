import React, { useState, useMemo } from 'react';
import { CategoryType, Post, PostComment } from '../types';

interface CommunityFeedProps {
  posts: Post[];
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentContent: string) => void;
  onOpenCreatePost: () => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  activeCategory,
  onSelectCategory,
  onToggleLike,
  onAddComment,
  onOpenCreatePost,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputMap, setCommentInputMap] = useState<{ [postId: string]: string }>({});
  const [selectedImageForLightbox, setSelectedImageForLightbox] = useState<string | null>(null);

  const categories: CategoryType[] = [
    '전체',
    '우리 동네 소식',
    '나눔/장터',
    '구인구직',
    '질문/답변',
    '일상 공유',
  ];

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory = activeCategory === '전체' || post.category === activeCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [posts, activeCategory, searchQuery]);

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const content = commentInputMap[postId]?.trim();
    if (!content) return;
    onAddComment(postId, content);
    setCommentInputMap((prev) => ({ ...prev, [postId]: '' }));
  };

  const getCategoryBadgeColor = (category: CategoryType) => {
    switch (category) {
      case '우리 동네 소식':
        return 'bg-[#e0e3e5] text-[#41474e]';
      case '나눔/장터':
        return 'bg-[#cfe5ff] text-[#004069]';
      case '구인구직':
        return 'bg-[#d6e5ef] text-[#0f1d25]';
      case '질문/답변':
        return 'bg-[#ffdad6] text-[#93000a]';
      default:
        return 'bg-[#f2f4f6] text-[#526069]';
    }
  };

  return (
    <main className="px-4 lg:px-8 py-6 max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#71787f] text-[20px]">
            search
          </span>
          <input
            id="input-community-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="커뮤니티 검색... (가게명, 키워드)"
            className="w-full bg-[#ffffff] border border-[#c1c7cf] focus:border-[#21638d] focus:ring-2 focus:ring-[#90caf9]/40 rounded-full sm:rounded-xl pl-11 pr-10 py-3 text-sm text-[#191c1e] placeholder-[#71787f] shadow-xs outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71787f] hover:text-[#191c1e] p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        <button
          id="btn-feed-create-post"
          onClick={onOpenCreatePost}
          className="hidden sm:flex bg-[#90caf9] hover:bg-[#93cdfc] text-[#08557e] font-bold text-sm px-6 py-3 rounded-xl h-[48px] items-center gap-2 transition-colors shadow-xs whitespace-nowrap active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
          <span>글쓰기</span>
        </button>
      </div>

      {/* Categories Chip Bar (Horizontal scroll on mobile) */}
      <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 w-max pb-1">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`chip-cat-${cat}`}
                onClick={() => onSelectCategory(cat)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#21638d] text-white shadow-xs scale-105'
                    : 'bg-[#ffffff] border border-[#e0e3e5] text-[#41474e] hover:bg-[#eceef0]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-[#71787f] border border-[#eceef0] shadow-xs">
            <span className="material-symbols-outlined text-[48px] text-[#c1c7cf] mb-2 block">
              speaker_notes_off
            </span>
            <p className="text-base font-bold text-[#191c1e]">해당하는 게시글이 없습니다.</p>
            <p className="text-xs text-[#71787f] mt-1">검색어를 변경하거나 새로운 글을 작성해 보세요!</p>
            <button
              onClick={onOpenCreatePost}
              className="mt-4 bg-[#90caf9] text-[#08557e] px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-[#93cdfc]"
            >
              새 글 작성하기
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsOpen = expandedCommentsPostId === post.id;
            return (
              <article
                key={post.id}
                id={`post-card-${post.id}`}
                className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0px_8px_30px_rgba(144,202,249,0.18)] transition-all border border-[#f2f4f6]"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    {post.authorAvatar ? (
                      <div className="w-10 h-10 rounded-full bg-[#f2f4f6] overflow-hidden flex-shrink-0 border border-[#e0e3e5]">
                        <img
                          alt={post.authorName}
                          src={post.authorAvatar}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 ${
                          post.authorColorClass || 'bg-[#cfe5ff] text-[#004069]'
                        }`}
                      >
                        {post.authorInitial || post.authorName.slice(0, 1)}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-[#191c1e]">
                          {post.authorName}
                        </h3>
                        <span className="text-xs text-[#71787f] font-normal">
                          · {post.timeAgo}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block mt-1 ${getCategoryBadgeColor(
                          post.category
                        )}`}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Body Content */}
                <div className="mb-3.5">
                  <p className="text-sm sm:text-base text-[#191c1e] leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Post Image Attachment (if any) */}
                {post.imageUrl && (
                  <div
                    onClick={() => setSelectedImageForLightbox(post.imageUrl!)}
                    className="rounded-xl overflow-hidden mb-3.5 h-48 sm:h-64 w-full bg-[#f2f4f6] cursor-pointer group relative border border-[#e0e3e5]"
                  >
                    <img
                      alt="게시글 첨부 사진"
                      src={post.imageUrl}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                      <span>확대 보기</span>
                    </div>
                  </div>
                )}

                {/* Post Action Buttons */}
                <div className="flex items-center gap-6 border-t border-[#eceef0] pt-3.5 text-[#41474e]">
                  {/* Like Button */}
                  <button
                    id={`btn-like-${post.id}`}
                    onClick={() => onToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors group ${
                      post.userLiked ? 'text-[#ba1a1a] font-bold' : 'hover:text-[#21638d]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] transition-transform active:scale-125 ${
                        post.userLiked ? 'fill text-[#ba1a1a]' : ''
                      }`}
                    >
                      favorite
                    </span>
                    <span className="text-xs sm:text-sm">{post.likes}</span>
                  </button>

                  {/* Comment Toggle Button */}
                  <button
                    id={`btn-comments-toggle-${post.id}`}
                    onClick={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      isCommentsOpen ? 'text-[#21638d] font-bold' : 'hover:text-[#21638d]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      chat_bubble
                    </span>
                    <span className="text-xs sm:text-sm">
                      {post.comments.length || post.commentsCount}
                    </span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      alert('게시글 링크가 클립보드에 복사되었습니다.');
                    }}
                    className="flex items-center gap-1 text-xs text-[#71787f] hover:text-[#21638d] ml-auto transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    <span className="hidden sm:inline">공유</span>
                  </button>
                </div>

                {/* Expanded Comments Section */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-3 border-t border-[#eceef0] space-y-3 bg-[#f8f9fb] p-3.5 rounded-xl animate-in fade-in">
                    <h4 className="text-xs font-bold text-[#41474e]">
                      댓글 ({post.comments.length})
                    </h4>

                    {/* Comments List */}
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {post.comments.length === 0 ? (
                        <p className="text-xs text-[#71787f] py-2">
                          아직 작성된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                        </p>
                      ) : (
                        post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-white p-2.5 rounded-lg border border-[#e0e3e5] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#191c1e] text-[13px]">
                                {comment.authorName}
                              </span>
                              <span className="text-[10px] text-[#71787f]">
                                {comment.timeAgo}
                              </span>
                            </div>
                            <p className="text-[#41474e] leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Write Comment Form */}
                    <form
                      onSubmit={(e) => handleCommentSubmit(post.id, e)}
                      className="flex gap-2 pt-1"
                    >
                      <input
                        type="text"
                        placeholder="따뜻한 댓글을 남겨보세요..."
                        value={commentInputMap[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputMap((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        className="flex-1 bg-white border border-[#c1c7cf] rounded-lg px-3 py-2 text-xs text-[#191c1e] focus:outline-none focus:border-[#21638d]"
                      />
                      <button
                        type="submit"
                        disabled={!commentInputMap[post.id]?.trim()}
                        className="bg-[#21638d] disabled:bg-[#c1c7cf] text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        등록
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Floating Action Button (FAB) on mobile */}
      <button
        id="btn-fab-create-post"
        onClick={onOpenCreatePost}
        aria-label="새 글 작성"
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#21638d] text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-[#00629d] transition-transform z-30 active:scale-95 sm:hidden"
      >
        <span className="material-symbols-outlined text-[26px] fill">edit</span>
      </button>

      {/* Lightbox Modal for Image Viewing */}
      {selectedImageForLightbox && (
        <div
          onClick={() => setSelectedImageForLightbox(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-2xl w-full max-h-[85vh] bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => setSelectedImageForLightbox(null)}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <img
              src={selectedImageForLightbox}
              alt="확대 이미지"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
};

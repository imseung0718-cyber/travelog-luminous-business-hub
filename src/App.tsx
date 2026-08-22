/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  CategoryType,
  Post,
  Transaction,
  AreaStatus,
  WaitlistCustomer,
  InventoryItem,
  CouponItem,
  WeeklyRevenueData,
} from './types';
import {
  INITIAL_POSTS,
  INITIAL_TRANSACTIONS,
  INITIAL_AREAS,
  INITIAL_WAITLIST,
  INITIAL_INVENTORY,
  INITIAL_COUPONS,
  WEEKLY_REVENUE_DATA,
} from './data/mockData';

import { TopNavBar } from './components/TopNavBar';
import { SideNavBar } from './components/SideNavBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeDashboard } from './components/HomeDashboard';
import { FinanceCalendar } from './components/FinanceCalendar';
import { StoreStatusView } from './components/StoreStatusView';
import { CommunityFeed } from './components/CommunityFeed';
import { CreatePostModal } from './components/CreatePostModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { InventoryModal } from './components/InventoryModal';
import { NotificationDrawer } from './components/NotificationDrawer';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('전체');

  // Core Data States (with localStorage persistence)
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('travelog_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_POSTS;
      }
    }
    return INITIAL_POSTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('travelog_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [areas, setAreas] = useState<AreaStatus[]>(() => {
    const saved = localStorage.getItem('travelog_areas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_AREAS;
      }
    }
    return INITIAL_AREAS;
  });

  const [waitlist, setWaitlist] = useState<WaitlistCustomer[]>(() => {
    const saved = localStorage.getItem('travelog_waitlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WAITLIST;
      }
    }
    return INITIAL_WAITLIST;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('travelog_inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_INVENTORY;
      }
    }
    return INITIAL_INVENTORY;
  });

  const [coupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [weeklyData] = useState<WeeklyRevenueData[]>(WEEKLY_REVENUE_DATA);

  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('travelog_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('travelog_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('travelog_areas', JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem('travelog_waitlist', JSON.stringify(waitlist));
  }, [waitlist]);

  useEffect(() => {
    localStorage.setItem('travelog_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Post Actions
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = p.userLiked;
          return {
            ...p,
            userLiked: !isLiked,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, commentContent: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: '카페 아라 사장님',
      content: commentContent,
      timeAgo: '방금 전',
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [newComment, ...p.comments],
            commentsCount: p.commentsCount + 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddPost = (
    newPostData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'userLiked' | 'comments'>
  ) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likes: 0,
      commentsCount: 0,
      userLiked: false,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setCurrentTab('community');
  };

  // Transaction Actions
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Area & Table Actions
  const handleToggleTableOccupancy = (areaId: string, tableId: string) => {
    setAreas((prev) =>
      prev.map((area) => {
        if (area.id !== areaId) return area;
        let deltaOccupancy = 0;
        const newTables = area.tables.map((table) => {
          if (table.id === tableId) {
            const nextOccupied = !table.isOccupied;
            deltaOccupancy = nextOccupied ? table.seats : -table.seats;
            return {
              ...table,
              isOccupied: nextOccupied,
              guestCount: nextOccupied ? table.seats : undefined,
              seatedTime: nextOccupied ? '방금 전' : undefined,
            };
          }
          return table;
        });

        const newOcc = Math.max(0, Math.min(area.total, area.occupied + deltaOccupancy));
        return {
          ...area,
          occupied: newOcc,
          tables: newTables,
        };
      })
    );
  };

  // Waitlist Actions
  const handleAddWaitlistCustomer = (name: string, phone: string, partySize: number) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newCustomer: WaitlistCustomer = {
      id: `w-${Date.now()}`,
      name,
      phone,
      partySize,
      waitTimeMin: 1,
      registeredAt: timeStr,
      status: 'waiting',
    };
    setWaitlist((prev) => [newCustomer, ...prev]);
  };

  const handleUpdateWaitlistStatus = (
    id: string,
    status: 'waiting' | 'called' | 'seated' | 'cancelled'
  ) => {
    setWaitlist((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, status };
        }
        return w;
      })
    );
  };

  // Restock Inventory Action
  const handleRestockItem = (itemId: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = item.currentStock + amount;
          const nextStatus =
            newQty < item.minRequiredStock * 0.5
              ? 'critical'
              : newQty < item.minRequiredStock
              ? 'warning'
              : 'normal';
          return {
            ...item,
            currentStock: newQty,
            status: nextStatus,
            lastRestocked: '2024-11-15',
          };
        }
        return item;
      })
    );
  };

  const activeWaitlistCount = waitlist.filter(
    (w) => w.status === 'waiting' || w.status === 'called'
  ).length;

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] flex flex-col antialiased selection:bg-[#90caf9] selection:text-[#08557e]">
      {/* Top Navigation Bar */}
      <TopNavBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        unreadNotificationCount={2}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        isDesktopView={true}
      />

      {/* Main Layout Container */}
      <div className="pt-16 pb-24 md:pb-8 flex-1 flex w-full">
        {/* Desktop Sidebar (visible on community tab and expandable on large screens) */}
        {currentTab === 'community' && (
          <SideNavBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
          />
        )}

        {/* Content Container */}
        <div className={`flex-1 w-full ${currentTab === 'community' ? 'lg:ml-64' : ''}`}>
          {currentTab === 'home' && (
            <HomeDashboard
              areas={areas}
              inventory={inventory}
              weeklyData={weeklyData}
              onSelectTab={setCurrentTab}
              onOpenInventory={() => setIsInventoryOpen(true)}
              waitlistCount={activeWaitlistCount}
            />
          )}

          {currentTab === 'finance' && (
            <FinanceCalendar
              transactions={transactions}
              onAddTransactionClick={() => setIsAddTransactionOpen(true)}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {currentTab === 'store' && (
            <StoreStatusView
              areas={areas}
              waitlist={waitlist}
              inventory={inventory}
              coupons={coupons}
              onToggleTableOccupancy={handleToggleTableOccupancy}
              onAddWaitlistCustomer={handleAddWaitlistCustomer}
              onUpdateWaitlistStatus={handleUpdateWaitlistStatus}
              onRestockItem={handleRestockItem}
            />
          )}

          {currentTab === 'community' && (
            <CommunityFeed
              posts={posts}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Modals & Drawers */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmitPost={handleAddPost}
      />

      <AddTransactionModal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventory={inventory}
        onRestockItem={handleRestockItem}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectNotificationAction={(type) => {
          if (type === 'community') setCurrentTab('community');
          else if (type === 'order') setCurrentTab('finance');
          else if (type === 'inventory' || type === 'waitlist') setCurrentTab('store');
        }}
      />
    </div>
  );
}

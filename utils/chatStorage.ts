const CHAT_GROUP_ID_KEY = 'personal-jesus-chat-group-id';

export const chatStorage = {
  /**
   * Save chat group ID to localStorage (always overwrites)
   */
  saveChatGroupId: (chatGroupId: string): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(CHAT_GROUP_ID_KEY, chatGroupId);
    console.log('[ChatStorage] Saved chat group ID:', chatGroupId);
  },

  /**
   * Retrieve saved chat group ID from localStorage
   */
  getChatGroupId: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const chatGroupId = localStorage.getItem(CHAT_GROUP_ID_KEY);
    if (chatGroupId) {
      console.log('[ChatStorage] Retrieved chat group ID:', chatGroupId);
    }
    return chatGroupId;
  },

  /**
   * Clear stored chat group ID
   */
  clearChatGroupId: (): void => {
    if (typeof window === 'undefined') return;
    
    const existing = localStorage.getItem(CHAT_GROUP_ID_KEY);
    if (existing) {
      localStorage.removeItem(CHAT_GROUP_ID_KEY);
      console.log('[ChatStorage] Cleared chat group ID:', existing);
    }
  },

  /**
   * Check if chat group ID exists
   */
  hasChatGroupId: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(CHAT_GROUP_ID_KEY) !== null;
  }
};
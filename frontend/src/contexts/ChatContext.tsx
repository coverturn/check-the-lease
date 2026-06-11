import { createContext, useContext, useState, type ReactNode } from "react";

export type ChatContextData = {
  state?: string | null;
  intake?: {
    state: string;
    stage: string;
    perspective: string;
    isParent?: boolean;
    receivesHousingAid?: boolean;
    isStudent?: boolean;
    reviewingForSomeoneElse?: boolean;
  } | null;
  analysisResult?: {
    key_terms?: Array<{ label: string; value: string; original_quote?: string }>;
    potential_issues?: Array<{
      severity: string;
      title: string;
      explanation: string;
      citation?: string;
      original_quote?: string;
    }>;
    missing_protections?: {
      renter: Array<{ title: string; explanation: string; helps: string }>;
      landlord: Array<{ title: string; explanation: string; helps: string }>;
    };
    questions?: string[];
    stats?: { potential_issues: number; missing_protections: number; questions: number };
  } | null;
};

type ChatContextValue = {
  chatCtx: ChatContextData | null;
  setChatCtx: (ctx: ChatContextData | null) => void;
};

const ChatContext = createContext<ChatContextValue>({
  chatCtx: null,
  setChatCtx: () => {},
});

export function ChatContextProvider({ children }: { children: ReactNode }) {
  const [chatCtx, setChatCtx] = useState<ChatContextData | null>(null);
  return (
    <ChatContext.Provider value={{ chatCtx, setChatCtx }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { UniversalChartFormat } from '@/types/chart';
import moment from 'moment';
import { useMutation } from '@apollo/client/react';
import { CHAT_MUTATION } from '@/client/graphql/chat.mutation';
import { toast } from '@/hooks/use-toast';

type MessageContent = {
  type: string;
  text: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, any>;
  }>;
};

type Message = {
  role: string;
  content: string | MessageContent | MessageContent[];
  createdAt: string;
  text?: string;
  bgColor?: string;
  opacity?: number;
  textColor?: string;
};

type WorkspaceChartState = {
  isPanelOpen: boolean;
  messages: Message[];
  chartData: UniversalChartFormat | null;
  prompt: string;
  loading: boolean;
  conversationId: string | null;
};

type WorkspaceChartAction =
  | { type: 'TOGGLE_PANEL' }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_CHART_DATA'; payload: UniversalChartFormat | null }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONVERSATION_ID'; payload: string | null };

const initialState: WorkspaceChartState = {
  isPanelOpen: true,
  messages: [],
  chartData: null,
  prompt: '',
  loading: false,
  conversationId: null,
};

const WorkspaceChartContext = createContext<{
  state: WorkspaceChartState;
  dispatch: React.Dispatch<WorkspaceChartAction>;
  sendMessage: (prompt: string) => void;
} | undefined>(undefined);

function workspaceChartReducer(state: WorkspaceChartState, action: WorkspaceChartAction): WorkspaceChartState {
  switch (action.type) {
    case 'TOGGLE_PANEL':
      return { ...state, isPanelOpen: !state.isPanelOpen };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_CHART_DATA':
      return { ...state, chartData: action.payload };
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CONVERSATION_ID':
      return { ...state, conversationId: action.payload };
    default:
      return state;
  }
}

type WorkspaceChartProviderProps = {
  children: ReactNode;
  initialData?: Partial<WorkspaceChartState>;
};

export function WorkspaceChartProvider({ children, initialData = {} }: WorkspaceChartProviderProps) {
  const [state, dispatch] = useReducer(workspaceChartReducer, {
    ...initialState,
    ...initialData,
  });

  const [chat] = useMutation(CHAT_MUTATION);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!state.conversationId || state.loading) {
      return;
    }

    // Add user message to the chat
    const userMessage = {
      role: 'USER',
      content: [{ type: 'text', text: prompt }],
      createdAt: moment().toISOString(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_PROMPT', payload: '' });

    try {
      const response = await chat({
        variables: {
          input: {
            conversationId: state.conversationId,
            prompt,
          },
        },
        fetchPolicy: 'network-only',
      });

      const message = response?.data?.chat;

      if (message) {
        const aiMessage = {
          role: 'ASSISTANT',
          content: [{
            type: 'text',
            text: message.aiResponse,
          }],
          createdAt: moment().toISOString(),
        };

        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
        
        if (message.chartData?.normalized) {
          dispatch({ type: 'SET_CHART_DATA', payload: message.chartData.normalized });
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.conversationId, state.loading, chat]);

  return (
    <WorkspaceChartContext.Provider value={{ state, dispatch, sendMessage }}>
      {children}
    </WorkspaceChartContext.Provider>
  );
}

export function useWorkspaceChart() {
  const context = useContext(WorkspaceChartContext);
  if (context === undefined) {
    throw new Error('useWorkspaceChart must be used within a WorkspaceChartProvider');
  }
  return context;
}

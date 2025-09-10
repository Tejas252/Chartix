import { Message } from '@/contexts/workspace-chart-context';
import moment from 'moment';

interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
  messageEndRef?: React.RefObject<HTMLDivElement>;
}

export function ChatMessage({ message, isLastMessage, messageEndRef }: ChatMessageProps) {
  const isAssistant = message.role === 'ASSISTANT';
  const bgColor = isAssistant ? 'bg-muted' : 'bg-primary';
  const textColor = isAssistant ? 'text-muted-foreground' : 'text-primary-foreground';
  
  return (
    <div className={`flex ${isAssistant ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-1 flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div className={`${bgColor} rounded-lg p-3 max-w-[80%]`}>
          {Array.isArray(message.content) ? (
            message.content.map((content, contentIndex) => (
              content.type === 'text' && (
                <p key={contentIndex} className={`text-sm ${textColor}`}>
                  {content.text}
                </p>
              )
            ))
          ) : (
            <p className={`text-sm ${textColor}`}>
              {typeof message.content === 'string' ? message.content : ''}
            </p>
          )}
          {Array.isArray(message.content) && message.content.some(c => c.toolCalls) && (
            message.content.flatMap(content => 
              content.toolCalls?.map((call, callIndex) => (
                <div key={callIndex} className="mt-2 p-2 bg-background/50 rounded text-xs">
                  <div className="font-mono">{call.name}</div>
                  <pre className="whitespace-pre-wrap mt-1">
                    {JSON.stringify(call.arguments, null, 2)}
                  </pre>
                </div>
              ))
            ) || []
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {moment(message.createdAt).isValid() ? moment(message.createdAt).calendar() : message.createdAt}
        </p>
        {isLastMessage && <div ref={messageEndRef} />}
      </div>
    </div>
  );
}

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export function ChatMessage({ message }: { message: Message }) {
  const isAgent = message.type === 'agent';

  return (
    <div className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}>
      {isAgent && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          AL
        </div>
      )}
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
          isAgent
            ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-none'
            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-none'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isAgent ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
          }`}
        >
          {formatDistanceToNow(message.timestamp, { locale: es, addSuffix: true })}
        </p>
      </div>
      {!isAgent && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          Tú
        </div>
      )}
    </div>
  );
}

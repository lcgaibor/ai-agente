interface UserContext {
  name?: string;
  preferences: string[];
  topics: string[];
}

export function UserProfile({ userContext }: { userContext: UserContext }) {
  return (
    <div className="flex-1 px-4 py-4 overflow-y-auto">
      {userContext.name && (
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
            Perfil
          </h3>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{userContext.name}</p>
          </div>
        </div>
      )}

      {userContext.topics.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
            Temas de Interés
          </h3>
          <div className="space-y-2">
            {userContext.topics.map((topic, index) => (
              <div
                key={index}
                className="bg-blue-50 dark:bg-slate-700 px-3 py-2 rounded text-xs text-gray-700 dark:text-gray-300"
              >
                • {topic}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

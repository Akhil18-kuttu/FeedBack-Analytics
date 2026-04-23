import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-surface-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-700 mb-1">
        {title || 'No data found'}
      </h3>
      <p className="text-sm text-surface-500 max-w-sm">
        {message || 'There is nothing to display here yet. Check back later.'}
      </p>
    </div>
  );
}

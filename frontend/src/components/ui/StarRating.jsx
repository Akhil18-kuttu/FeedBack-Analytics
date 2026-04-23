import { Star } from 'lucide-react';
import { useState } from 'react';

export default function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  showLabel = false
}) {
  const [hover, setHover] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-8 h-8',
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform duration-150`}
          >
            <Star
              className={`${sizes[size]} transition-colors duration-150 ${
                star <= (hover || value)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-surface-200 text-surface-200'
              }`}
            />
          </button>
        ))}
      </div>
      {showLabel && (hover || value) > 0 && (
        <span className="text-sm text-surface-500 ml-2 font-medium">
          {labels[hover || value]}
        </span>
      )}
    </div>
  );
}

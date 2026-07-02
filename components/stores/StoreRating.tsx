function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  if (half) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 20 20" aria-hidden="true">
        <defs>
          <linearGradient id="half-star">
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="50%" stopColor="#e4e4e7" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-star)"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fill={filled ? "#eab308" : "#e4e4e7"}
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      />
    </svg>
  );
}

interface StoreStarRatingProps {
  rating: number;
  reviewCount: number;
  centered?: boolean;
}

export default function StoreStarRating({
  rating,
  reviewCount,
  centered = false,
}: StoreStarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const filled = rating >= starValue;
    const half = !filled && rating >= starValue - 0.5;

    return { starValue, filled, half };
  });

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${centered ? "justify-center sm:justify-start" : ""}`}
      aria-label={`${rating.toFixed(1)} / 5, ${reviewCount.toLocaleString("tr-TR")} değerlendirme`}
    >
      <div className="flex items-center gap-0.5">
        {stars.map(({ starValue, filled, half }) => (
          <StarIcon key={starValue} filled={filled} half={half} />
        ))}
      </div>
      <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted">
        ({reviewCount.toLocaleString("tr-TR")} değerlendirme)
      </span>
    </div>
  );
}

import './SkeletonCard.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-title short" />
        <div className="skeleton skeleton-price" />
        <div className="skeleton skeleton-location" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid-products">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div className="skeleton-detail card">
      <div className="skeleton skeleton-detail-img" />
      <div className="skeleton-detail-info">
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-detail-title" />
        <div className="skeleton skeleton-detail-price" />
        <div className="skeleton skeleton-meta" />
        <div className="skeleton skeleton-meta short" />
        <div className="skeleton skeleton-desc" />
        <div className="skeleton skeleton-desc" />
        <div className="skeleton skeleton-desc short" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="skeleton-dashboard">
      <div className="skeleton-stats-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-stat-card card">
            <div className="skeleton-stat-inner">
              <div className="skeleton skeleton-icon" />
              <div className="skeleton-stat-body">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-value" />
              </div>
            </div>
            <div className="skeleton skeleton-footer" />
          </div>
        ))}
      </div>
      <div className="skeleton-chart card">
        <div className="skeleton skeleton-chart-title" />
        <div className="skeleton skeleton-chart-body" />
      </div>
    </div>
  );
}

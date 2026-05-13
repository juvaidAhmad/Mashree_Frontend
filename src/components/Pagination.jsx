export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
      <button className="btn btn-outline" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Prev
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={`btn ${p === page ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button className="btn btn-outline" onClick={() => onPageChange(page + 1)} disabled={page === pages}>
        Next
      </button>
    </div>
  );
}

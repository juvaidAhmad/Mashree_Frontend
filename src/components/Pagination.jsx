import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Pagination.css';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  // Show max 5 page buttons
  const getRange = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(pages, page + delta); i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn page-nav"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <FiChevronLeft size={16} />
      </button>

      {getRange()[0] > 1 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
          {getRange()[0] > 2 && <span className="page-ellipsis">…</span>}
        </>
      )}

      {getRange().map((p) => (
        <button
          key={p}
          className={`page-btn ${p === page ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {getRange().at(-1) < pages && (
        <>
          {getRange().at(-1) < pages - 1 && <span className="page-ellipsis">…</span>}
          <button className="page-btn" onClick={() => onPageChange(pages)}>{pages}</button>
        </>
      )}

      <button
        className="page-btn page-nav"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}

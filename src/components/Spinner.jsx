import './Spinner.css';

// Inline spinner for inside buttons
export function BtnSpinner() {
  return <span className="btn-spinner" aria-hidden="true" />;
}

// Full page overlay loader
export function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="page-loader">
      <div className="page-loader-inner">
        <div className="page-loader-ring">
          <div /><div /><div /><div />
        </div>
        {label && <p className="page-loader-label">{label}</p>}
      </div>
    </div>
  );
}

// Section spinner (inside a card/table area)
export default function Spinner({ label }) {
  return (
    <div className="section-spinner">
      <div className="section-spinner-ring">
        <div /><div /><div /><div />
      </div>
      {label && <p className="section-spinner-label">{label}</p>}
    </div>
  );
}

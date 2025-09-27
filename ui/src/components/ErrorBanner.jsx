import React from 'react';
import styles from './ErrorBanner.module.css';

export default function ErrorBanner({ message, onRetry, offline, showingCached }) {
  return (
    <div role="alert" className={styles.banner}>
      <div className={styles.text}>
        <strong>Unable to load movies.</strong>
        <span className="muted"> {message}</span>
        {offline && <span className={styles.hint}>You appear to be offline.</span>}
        {showingCached && <span className={styles.hint}>(showing cached)</span>}
      </div>
      {onRetry && <button className={styles.retry} onClick={onRetry}>Retry</button>}
    </div>
  );
}

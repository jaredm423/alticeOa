import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ErrorBanner from '../components/ErrorBanner.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import { getDetails, tmdbImage } from '../api.js';
import styles from './MovieDetails.module.css';

export default function MovieDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setStatus('loading'); setError('');
        const d = await getDetails(id);
        if (!cancel) { setData(d); setStatus('success'); }
      } catch (e) {
        if (!cancel) { setError(e?.code || e?.message || 'Failed'); setStatus('error'); }
      }
    })();
    return () => { cancel = true; };
  }, [id, reload]);

  const title = data?.title || data?.name || '';
  const year = useMemo(() => (data?.release_date ? new Date(data.release_date).getFullYear() : ''), [data]);
  const runtime = data?.runtime;
  const genres = useMemo(() => (data?.genres || []).map(g => g.name).filter(Boolean), [data]);
  const rating = typeof data?.vote_average === 'number' ? data.vote_average.toFixed(1) : null;
  const poster = tmdbImage(data?.poster_path, 'w342');
  const backdrop = tmdbImage(data?.backdrop_path, 'w1280');

  if (status === 'loading') {
    return (
      <main className={styles.page}>
        <div className={`${styles.hero} ${styles.heroSkeleton}`}>
          <div className={`skeleton ${styles.backdropSkel}`} />
          <div className={styles.heroOverlay} />
          <div className={`${styles.heroContent} container`}>
            <div className={styles.posterWrap}>
              <div className={`skeleton ${styles.posterSkel}`} />
            </div>
            <div className={styles.meta}>
              <div className={`skeleton ${styles.titleSkel}`} />
              <div className={`skeleton ${styles.subSkel}`} />
              <div className={`skeleton ${styles.taglineSkel}`} />
            </div>
          </div>
        </div>
        <div className="container">
          <section className={styles.section}>
            <div className={`skeleton ${styles.paraSkel}`} />
            <div className={`skeleton ${styles.paraSkel}`} />
          </section>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="container" style={{ paddingTop: 16 }}>
        <a href="/" className={styles.backLink}>← Back</a>
        <div style={{ marginTop: 12 }}>
          <ErrorBanner
            message={error}
            onRetry={() => setReload(r => r + 1)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        {backdrop
          ? <img className={styles.backdrop} src={backdrop} alt="" />
          : <div className={`skeleton ${styles.backdropSkel}`} aria-hidden="true" />
        }
        <div className={styles.heroOverlay} />

        <div className={`${styles.heroContent} container`}>
          <div className={styles.topRow}>
            <a href="/" className={styles.backLink}>← Back</a>
            <div className={styles.actions}>
              {data && <FavoriteButton movie={data} />}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.headerRow}>
          <div className={styles.posterWrap}>
            {poster
              ? <img className={styles.poster} src={poster} alt={title} />
              : <div className={`skeleton ${styles.posterSkel}`} aria-hidden="true" />
            }
          </div>

          <div className={styles.meta}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.sub}>
              {year && <span>{year}</span>}
              {!!genres.length && <span>{genres.join(', ')}</span>}
              {typeof runtime === 'number' && <span>{runtime} min</span>}
              {rating && <span className={styles.badge} title="Average rating">★ {rating}</span>}
            </div>
            {data?.tagline && <p className={styles.tagline}>“{data.tagline}”</p>}
          </div>
        </div>
        <section className={styles.section}>
          <h2 className={styles.h2}>Overview</h2>
          <p className={styles.overview}>
            {data?.overview || 'No overview available.'}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>Details</h2>
          <dl className={styles.dl}>
            {data?.release_date && (
              <div><dt>Release</dt><dd>{data.release_date}</dd></div>
            )}
            {typeof runtime === 'number' && (
              <div><dt>Runtime</dt><dd>{runtime} min</dd></div>
            )}
            {!!(data?.spoken_languages || []).length && (
              <div><dt>Languages</dt><dd>{data.spoken_languages.map(l => l.english_name || l.name).join(', ')}</dd></div>
            )}
            {!!(data?.production_companies || []).length && (
              <div><dt>Production</dt><dd>{data.production_companies.map(c => c.name).join(', ')}</dd></div>
            )}
            {data?.homepage && (
              <div><dt>Homepage</dt><dd><a href={data.homepage} target="_blank" rel="noopener noreferrer">{new URL(data.homepage).host}</a></dd></div>
            )}
          </dl>
        </section>
      </div>
    </main>
  );
}

package com.optimum.movie_api;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class MovieService {
  private final TmdbClient tmdb;
  public MovieService(TmdbClient tmdb) { this.tmdb = tmdb; }

  public Mono<String> getTrending(String window, int limit) {
    if (!"day".equals(window) && !"week".equals(window)) {
      return Mono.error(new IllegalArgumentException("window must be day|week"));
    }
    // return the reactive pipeline; do not block --- also ignoring limit for now
    return tmdb.trending(window);
  }
}


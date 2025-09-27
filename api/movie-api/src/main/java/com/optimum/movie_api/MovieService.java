package com.optimum.movie_api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.benmanes.caffeine.cache.AsyncLoadingCache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.optimum.movie_api.TmdbClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class MovieService {

  private final TmdbClient tmdb;
  private final ObjectMapper mapper;

  private final AsyncLoadingCache<String, String> trendingCache;

  public MovieService(TmdbClient tmdb, ObjectMapper mapper) {
    this.tmdb = tmdb;
    this.mapper = mapper;

    this.trendingCache = Caffeine.newBuilder()
        .maximumSize(16)
        .expireAfterWrite(Duration.ofMinutes(5))
        .buildAsync((window, executor) -> this.tmdb.trending(window).toFuture());
  }

  /** Cached by window ("day" | "week"); slice to limit on the fly. */
  public Mono<String> getTrending(String window, int limit) {
    return Mono.fromFuture(trendingCache.get(window)) // Mono<String>
        .map(json -> sliceResults(json, limit))
        .onErrorResume(ex -> {
          trendingCache.synchronous().invalidate(window);
          return tmdb.trending(window).map(body -> sliceResults(body, limit));
        });
  }

  public Mono<String> getDetails(long id) {
    return tmdb.details(id);
  }

  private String sliceResults(String json, int limit) {
    try {
      if (limit <= 0)
        return json;
      JsonNode root = mapper.readTree(json);
      JsonNode results = root.path("results");
      if (results.isArray() && results.size() > limit) {
        ArrayNode arr = mapper.createArrayNode();
        for (int i = 0; i < limit && i < results.size(); i++) {
          arr.add(results.get(i));
        }
        ((ObjectNode) root).set("results", arr);
        return mapper.writeValueAsString(root);
      }
      return json;
    } catch (Exception e) {
      throw new RuntimeException("Failed to slice results", e);
    }
  }
}

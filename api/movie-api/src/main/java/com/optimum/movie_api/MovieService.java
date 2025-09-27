package com.optimum.movie_api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class MovieService {
  private final TmdbClient tmdb;
  private final ObjectMapper mapper;

  public MovieService(TmdbClient tmdb, ObjectMapper mapper) {
    this.tmdb = tmdb;
    this.mapper = mapper;
  }

  public Mono<String> getTrending(String window, int limit) {
    if (!"day".equals(window) && !"week".equals(window)) {
      return Mono.error(new IllegalArgumentException("window must be day|week"));
    }

    // Accept only 5, 10, 20; default to 10 if anything else comes in
    int safeLimit = (limit == 5 || limit == 10 || limit == 20) ? limit : 10;

    return tmdb.trending(window)
        .map(body -> {
          try {
            JsonNode root = mapper.readTree(body);
            JsonNode results = root.path("results");
            if (results.isArray()) {
              int max = Math.min(safeLimit, results.size());
              ArrayNode trimmed = mapper.createArrayNode();
              for (int i = 0; i < max; i++)
                trimmed.add(results.get(i));
              ((ObjectNode) root).set("results", trimmed);
            }
            return mapper.writeValueAsString(root);
          } catch (Exception e) {
            throw new RuntimeException("Failed to trim results", e);
          }
        });
  }

  public Mono<String> getDetails(long id) {
    return tmdb.details(id);
  }
}

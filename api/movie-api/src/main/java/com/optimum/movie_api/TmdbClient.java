package com.optimum.movie_api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Component
public class TmdbClient {
  private final WebClient client;
  private final String v4Token;
  private final String v3Key;

  public TmdbClient(
      @Value("${tmdb.v4Token:}") String v4Token,
      @Value("${tmdb.v3Key:}")   String v3Key
  ) {
    this.v4Token = v4Token == null ? "" : v4Token.trim();
    this.v3Key   = v3Key   == null ? "" : v3Key.trim();

    var b = WebClient.builder().baseUrl("https://api.themoviedb.org/3");
    if (!this.v4Token.isEmpty()) {
      b.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + this.v4Token);
    }
    this.client = b.build();

    // debug (no secret printed)
    System.out.println("[TMDB] v4 present? " + !this.v4Token.isEmpty() +
                       " | v3 present? " + !this.v3Key.isEmpty());
  }

  public Mono<String> trending(String window) {
    String uri = "/trending/movie/" + window;
    if (v4Token.isEmpty() && !v3Key.isEmpty()) {
      uri += "?api_key=" + v3Key;  // V3 fallback
    }
    return client.get().uri(uri)
      .retrieve()
      .onStatus(s -> s.is4xxClientError() || s.is5xxServerError(),
        resp -> resp.createException()) // bubble WebClientResponseException
      .bodyToMono(String.class);
  }
}

package com.optimum.movie_api;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

@Slf4j
@Component
public class TmdbClient {
  private final WebClient client;
  private final String v4Token;
  private final String v3Key;

  public TmdbClient(
      @Value("${tmdb.v4Token:}") String v4Token,
      @Value("${tmdb.v3Key:}") String v3Key) {
    this.v4Token = v4Token == null ? "" : v4Token.trim();
    this.v3Key = v3Key == null ? "" : v3Key.trim();

    var b = WebClient.builder().baseUrl("https://api.themoviedb.org/3");
    if (!this.v4Token.isEmpty()) {
      b.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + this.v4Token);
    }
    this.client = b.build();
  }

  public Mono<String> trending(String window) {
    String uri = "/trending/movie/" + window;
    if (v4Token.isEmpty() && !v3Key.isEmpty()) {
      uri += "?api_key=" + v3Key;
    }

    log.info("[TMDB] GET /trending/movie/{} (NETWORK CALL)", window);

    return client.get().uri(uri)
        .retrieve()
        .onStatus(HttpStatusCode::isError, resp -> resp.bodyToMono(String.class).defaultIfEmpty("")
            .map(body -> new WebClientResponseException(
                "TMDB trending " + resp.statusCode().value(),
                resp.statusCode().value(), resp.statusCode().toString(),
                null, body.getBytes(), null)))
        .bodyToMono(String.class)
        .timeout(Duration.ofSeconds(6))
        .retryWhen(
            Retry.backoff(2, Duration.ofMillis(250))
                .filter(ex -> ex instanceof WebClientResponseException wcre && wcre.getStatusCode().is5xxServerError()
                    || !(ex instanceof WebClientResponseException))
                .onRetryExhaustedThrow((spec, signal) -> signal.failure()));
  }

  public Mono<String> details(long id) {
    String q = "append_to_response=videos,credits,images&include_image_language=en,null";
    String uri = "/movie/" + id + "?" + q;
    if (v4Token.isEmpty() && !v3Key.isEmpty()) {
      uri += "&api_key=" + v3Key;
    }
    return client.get().uri(uri)
        .retrieve()
        .onStatus(HttpStatusCode::isError, resp -> resp.bodyToMono(String.class).defaultIfEmpty("")
            .map(body -> new WebClientResponseException(
                "TMDB details " + resp.statusCode().value(),
                resp.statusCode().value(), resp.statusCode().toString(),
                null, body.getBytes(), null)))
        .bodyToMono(String.class)
        .timeout(Duration.ofSeconds(6))
        .retryWhen(
            Retry.backoff(2, Duration.ofMillis(250))
                .filter(ex -> ex instanceof WebClientResponseException wcre && wcre.getStatusCode().is5xxServerError()
                    || !(ex instanceof WebClientResponseException))
                .onRetryExhaustedThrow((spec, signal) -> signal.failure()));
  }
}

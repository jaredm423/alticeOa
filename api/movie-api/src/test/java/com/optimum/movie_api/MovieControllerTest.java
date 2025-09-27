package com.optimum.movie_api;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.util.DigestUtils.md5DigestAsHex;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpHeaders;

@WebFluxTest(controllers = MovieController.class)
class MovieControllerTest {

  @Autowired
  WebTestClient web;
  @MockBean
  MovieService service;

  @Test
  void trendingReturnsJson() {
    when(service.getTrending("day", 5))
        .thenReturn(Mono.just("{\"results\":[{\"id\":1,\"title\":\"A\"}]}"));

    web.get().uri("/api/trending?window=day&limit=5")
        .exchange()
        .expectStatus().isOk()
        // Accept application/json with or without charset
        .expectHeader().contentTypeCompatibleWith(MediaType.APPLICATION_JSON)
        .expectBody()
        .jsonPath("$.results[0].id").isEqualTo(1);
  }

  @Test
  void returnsEtagAndResponds304OnMatch() {
    var service = mock(MovieService.class);
    String body = "{\"results\":[{\"id\":1}]}";
    when(service.getTrending("day", 5)).thenReturn(Mono.just(body));

    var ctrl = new MovieController(service);
    var client = WebTestClient.bindToController(ctrl).build();

    var etag = "\"" + md5DigestAsHex(body.getBytes()) + "\"";

    // 200 with ETag
    client.get().uri("/api/trending?window=day&limit=5")
        .exchange()
        .expectStatus().isOk()
        .expectHeader().contentType(MediaType.APPLICATION_JSON)
        .expectHeader().valueEquals(HttpHeaders.ETAG, etag)
        .expectBody().json(body);

    // 304 Not Modified when If-None-Match matches
    client.get().uri("/api/trending?window=day&limit=5")
        .header(HttpHeaders.IF_NONE_MATCH, etag)
        .exchange()
        .expectStatus().isNotModified()
        .expectBody().isEmpty();
  }
}

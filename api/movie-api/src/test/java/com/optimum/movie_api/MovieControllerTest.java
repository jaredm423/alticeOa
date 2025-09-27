package com.optimum.movie_api;

import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

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
}

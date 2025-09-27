package com.optimum.movie_api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import reactor.core.publisher.Mono;

public class MovieServiceTest {

  @Test
  void trimsResultsToLimit() {
    var tmdb = Mockito.mock(TmdbClient.class);
    var mapper = new ObjectMapper();
    var svc = new MovieService(tmdb, mapper);

    String body = """
        {"results":[
          {"id":1,"title":"A"},{"id":2,"title":"B"},{"id":3,"title":"C"},
          {"id":4,"title":"D"},{"id":5,"title":"E"},{"id":6,"title":"F"}
        ]}
        """;
    when(tmdb.trending("day")).thenReturn(Mono.just(body));

    var json = svc.getTrending("day", 5).block();
    assertThat(json).contains("\"id\":1").contains("\"id\":2");
    assertThat(json).doesNotContain("\"id\":6");
  }

  @Test
  void returnsDetailsJson() {
    var tmdb = Mockito.mock(TmdbClient.class);
    var mapper = new ObjectMapper();
    var svc = new MovieService(tmdb, mapper);

    long id = 550L;
    String body = "{\"id\":550,\"title\":\"Fight Club\",\"runtime\":139}";
    when(tmdb.details(id)).thenReturn(Mono.just(body));

    String json = svc.getDetails(id).block();
    assertThat(json).contains("\"id\":550").contains("\"Fight Club\"");
  }
}

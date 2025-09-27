package com.optimum.movie_api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
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

  @Test
  void sameWindowCachedEvenWithDifferentLimits() {
    var tmdb = Mockito.mock(TmdbClient.class);
    // Base TMDB payload with 3 items; service will slice to requested limit
    when(tmdb.trending("day")).thenReturn(Mono.just("{\"results\":[{\"id\":1},{\"id\":2},{\"id\":3}]}"));

    var svc = new MovieService(tmdb, new ObjectMapper());

    String l1 = svc.getTrending("day", 1).block();
    String l3 = svc.getTrending("day", 3).block();

    // Only one downstream call because cache is keyed by window
    verify(tmdb, times(1)).trending("day");

    assertThat(l1).contains("\"id\":1").doesNotContain("\"id\":2");
    assertThat(l3).contains("\"id\":1").contains("\"id\":2").contains("\"id\":3");
  }

  @Test
  void differentWindowsUseDifferentCacheEntries() {
    var tmdb = Mockito.mock(TmdbClient.class);
    when(tmdb.trending("day")).thenReturn(Mono.just("{\"results\":[{\"id\":1}]}"));
    when(tmdb.trending("week")).thenReturn(Mono.just("{\"results\":[{\"id\":9}]}"));

    var svc = new MovieService(tmdb, new ObjectMapper());

    String day = svc.getTrending("day", 5).block();
    String week = svc.getTrending("week", 5).block();

    verify(tmdb, times(1)).trending("day");
    verify(tmdb, times(1)).trending("week");
    assertThat(day).contains("\"id\":1");
    assertThat(week).contains("\"id\":9");
  }
}

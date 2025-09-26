package com.optimum.movie_api;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class MovieController {
  private final MovieService service;
  public MovieController(MovieService service) { this.service = service; }

  @GetMapping(value="/trending", produces=MediaType.APPLICATION_JSON_VALUE)
  public Mono<String> trending(@RequestParam(defaultValue="day") String window,
                               @RequestParam(defaultValue="10") int limit) {
    return service.getTrending(window, limit);
  }
}

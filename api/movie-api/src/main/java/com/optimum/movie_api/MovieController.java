package com.optimum.movie_api;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

import static org.springframework.util.DigestUtils.md5DigestAsHex;

@RestController
@RequestMapping("/api")
public class MovieController {
  private final MovieService service;

  public MovieController(MovieService service) {
    this.service = service;
  }

  @GetMapping(value = "/trending", produces = MediaType.APPLICATION_JSON_VALUE)
  public Mono<ResponseEntity<String>> trending(
      @RequestParam(name = "window", defaultValue = "day") String window,
      @RequestParam(name = "limit", defaultValue = "10") int limit,
      @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
    if (!("day".equals(window) || "week".equals(window))) {
      return Mono.error(new IllegalArgumentException("window must be 'day' or 'week'"));
    }
    if (limit < 1 || limit > 50) {
      return Mono.error(new IllegalArgumentException("limit must be 1..50"));
    }

    return service.getTrending(window, limit)
        .map(body -> {
          String etag = "\"" + md5DigestAsHex(body.getBytes(StandardCharsets.UTF_8)) + "\"";
          if (etag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(5))
                    .staleWhileRevalidate(Duration.ofMinutes(2))
                    .cachePublic())
                .build();
          }
          return ResponseEntity.ok()
              .cacheControl(CacheControl.maxAge(Duration.ofMinutes(5))
                  .staleWhileRevalidate(Duration.ofMinutes(2))
                  .cachePublic())
              .eTag(etag)
              .contentType(MediaType.APPLICATION_JSON)
              .body(body);
        });
  }

  @GetMapping(value = "/movie/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public Mono<ResponseEntity<String>> details(@PathVariable long id) {
    return service.getDetails(id)
        .map(body -> ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(Duration.ofMinutes(10)).cachePublic())
            .contentType(MediaType.APPLICATION_JSON)
            .body(body));
  }
}

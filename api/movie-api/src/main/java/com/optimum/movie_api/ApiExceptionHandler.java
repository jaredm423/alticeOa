package com.optimum.movie_api;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@ControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> bad(IllegalArgumentException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
  }
//   @ExceptionHandler(Exception.class)
//   public ResponseEntity<?> generic(Exception ex) {
//     return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", "Upstream error"));
//   }
  @ExceptionHandler(WebClientResponseException.class)
    public ResponseEntity<?> webClient(WebClientResponseException ex) {
        return ResponseEntity.status(ex.getStatusCode())
            .body(Map.of(
            "error", "TMDB",
            "status", ex.getRawStatusCode(),
            "message", ex.getResponseBodyAsString()
        ));
    }
}

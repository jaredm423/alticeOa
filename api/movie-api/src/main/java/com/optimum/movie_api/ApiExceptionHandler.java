package com.optimum.movie_api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.TimeoutException;

@Slf4j
@ControllerAdvice
public class ApiExceptionHandler {

  private Map<String, Object> body(String code, String msg, HttpStatus status) {
    return Map.of(
        "timestamp", Instant.now().toString(),
        "code", code,
        "status", status.value(),
        "error", status.getReasonPhrase(),
        "message", msg);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> bad(IllegalArgumentException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body("BAD_REQUEST", ex.getMessage(), HttpStatus.BAD_REQUEST));
  }

  @ExceptionHandler(WebClientResponseException.class)
  public ResponseEntity<?> upstream(WebClientResponseException ex) {
    HttpStatus status = HttpStatus.BAD_GATEWAY;
    if (ex.getStatusCode().is4xxClientError())
      status = HttpStatus.BAD_GATEWAY;
    if (ex.getStatusCode().is5xxServerError())
      status = HttpStatus.BAD_GATEWAY;

    log.warn("Upstream error: {} {}", ex.getRawStatusCode(), ex.getResponseBodyAsString());
    return ResponseEntity.status(status)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body("UPSTREAM_ERROR", "Upstream service failed", status));
  }

  @ExceptionHandler(TimeoutException.class)
  public ResponseEntity<?> timeout(TimeoutException ex) {
    return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body("TIMEOUT", "Upstream timeout", HttpStatus.GATEWAY_TIMEOUT));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> generic(Exception ex) {
    log.error("Unhandled error", ex);
    return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body("UNKNOWN", "Upstream error", HttpStatus.BAD_GATEWAY));
  }
}

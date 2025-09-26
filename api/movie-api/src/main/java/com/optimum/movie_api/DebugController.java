package com.optimum.movie_api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DebugController {
  @Value("${tmdb.v4Token:}") String v4;
  @Value("${tmdb.v3Key:}")   String v3;

  @GetMapping("/_debug/creds")
  public Map<String, Object> creds() {
    return Map.of("v4_present", v4 != null && !v4.trim().isEmpty(),
                  "v3_present", v3 != null && !v3.trim().isEmpty());
  }
}


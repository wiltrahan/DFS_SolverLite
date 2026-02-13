package com.dfssolverlite.backend.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
@RequestMapping("/api")
class HealthController {
    @GetMapping("/health")
    fun health() = mapOf(
        "status" to "ok",
        "service" to "dfs-solverlite-backend",
        "timestamp" to Instant.now().toString()
    )
}


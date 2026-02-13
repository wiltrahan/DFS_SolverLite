package com.dfssolverlite.backend.controller

import com.dfssolverlite.backend.domain.ContestMode
import com.dfssolverlite.backend.dto.SaveLineupRequest
import com.dfssolverlite.backend.dto.SavedLineupResponse
import com.dfssolverlite.backend.service.LineupService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class LineupController(
    private val lineupService: LineupService
) {

    @GetMapping("/lineups")
    fun getLineups(): List<SavedLineupResponse> =
        lineupService.getLineups()

    @PostMapping("/lineups")
    fun saveLineup(@Valid @RequestBody request: SaveLineupRequest): SavedLineupResponse =
        lineupService.saveLineup(request)

    @PutMapping("/lineups/{id}")
    fun updateLineup(
        @PathVariable id: Long,
        @Valid @RequestBody request: SaveLineupRequest
    ): SavedLineupResponse = lineupService.updateLineup(id, request)

    @DeleteMapping("/lineups/{id}")
    fun deleteLineup(
        @PathVariable id: Long,
        @RequestParam contestMode: ContestMode
    ) {
        lineupService.deleteLineup(id, contestMode)
    }
}

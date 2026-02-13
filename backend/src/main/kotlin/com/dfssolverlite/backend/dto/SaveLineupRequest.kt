package com.dfssolverlite.backend.dto

import com.dfssolverlite.backend.domain.ContestMode
import com.fasterxml.jackson.databind.JsonNode
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class SaveLineupRequest(
    @field:NotBlank
    val title: String,
    val contestMode: ContestMode,
    @field:Min(0)
    @field:Max(50000)
    val totalSalary: Int,
    val lineupData: JsonNode
)

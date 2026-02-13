package com.dfssolverlite.backend.dto

import com.dfssolverlite.backend.domain.ContestMode
import com.fasterxml.jackson.databind.JsonNode
import java.time.Instant
import java.math.BigDecimal

data class SavedLineupResponse(
    val id: Long,
    val title: String,
    val contestMode: ContestMode,
    val totalSalary: Int,
    val totalOwnership: BigDecimal,
    val lineupData: JsonNode,
    val createdAt: Instant,
    val updatedAt: Instant
)

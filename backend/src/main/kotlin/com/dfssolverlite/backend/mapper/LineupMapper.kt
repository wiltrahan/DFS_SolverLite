package com.dfssolverlite.backend.mapper

import com.dfssolverlite.backend.domain.ContestMode
import com.dfssolverlite.backend.dto.SavedLineupResponse
import com.dfssolverlite.backend.entity.ClassicLineup
import com.dfssolverlite.backend.entity.ShowdownLineup

fun ClassicLineup.toResponse(): SavedLineupResponse =
    SavedLineupResponse(
        id = requireNotNull(id),
        title = title,
        contestMode = ContestMode.CLASSIC,
        totalSalary = totalSalary,
        totalOwnership = totalOwnership,
        lineupData = lineupData,
        createdAt = createdAt,
        updatedAt = updatedAt
    )

fun ShowdownLineup.toResponse(): SavedLineupResponse =
    SavedLineupResponse(
        id = requireNotNull(id),
        title = title,
        contestMode = ContestMode.SHOWDOWN,
        totalSalary = totalSalary,
        totalOwnership = totalOwnership,
        lineupData = lineupData,
        createdAt = createdAt,
        updatedAt = updatedAt
    )

package com.dfssolverlite.backend.repository

import com.dfssolverlite.backend.entity.ShowdownLineup
import org.springframework.data.jpa.repository.JpaRepository

interface ShowdownLineupRepository : JpaRepository<ShowdownLineup, Long> {
    fun findAllByOrderByCreatedAtDesc(): List<ShowdownLineup>
}


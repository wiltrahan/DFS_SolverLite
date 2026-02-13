package com.dfssolverlite.backend.repository

import com.dfssolverlite.backend.entity.ClassicLineup
import org.springframework.data.jpa.repository.JpaRepository

interface ClassicLineupRepository : JpaRepository<ClassicLineup, Long> {
    fun findAllByOrderByCreatedAtDesc(): List<ClassicLineup>
}


package com.dfssolverlite.backend.entity

import com.fasterxml.jackson.databind.JsonNode
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.math.BigDecimal
import java.time.Instant

@Entity
@Table(name = "showdown_lineups")
class ShowdownLineup(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    val id: Long? = null,
    @Column(nullable = false)
    val title: String,
    @Column(name = "total_salary", nullable = false)
    val totalSalary: Int,
    @Column(name = "total_ownership", nullable = false, precision = 10, scale = 2)
    val totalOwnership: BigDecimal,
    @Column(nullable = false)
    val captain: String,
    @Column(nullable = false)
    val player1: String,
    @Column(nullable = false)
    val player2: String,
    @Column(nullable = false)
    val player3: String,
    @Column(nullable = false)
    val player4: String,
    @Column(nullable = false)
    val player5: String,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "lineup_data", nullable = false, columnDefinition = "jsonb")
    val lineupData: JsonNode,
    @Column(name = "created_date", nullable = false)
    val createdAt: Instant = Instant.now(),
    @Column(name = "updated_date", nullable = false)
    val updatedAt: Instant = Instant.now()
)

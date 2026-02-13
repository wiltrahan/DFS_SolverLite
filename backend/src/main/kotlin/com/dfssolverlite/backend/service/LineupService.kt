package com.dfssolverlite.backend.service

import com.dfssolverlite.backend.domain.ContestMode
import com.dfssolverlite.backend.dto.SaveLineupRequest
import com.dfssolverlite.backend.dto.SavedLineupResponse
import com.dfssolverlite.backend.entity.ClassicLineup
import com.dfssolverlite.backend.entity.ShowdownLineup
import com.dfssolverlite.backend.mapper.toResponse
import com.dfssolverlite.backend.repository.ClassicLineupRepository
import com.dfssolverlite.backend.repository.ShowdownLineupRepository
import com.fasterxml.jackson.databind.JsonNode
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.time.Instant

@Service
class LineupService(
    private val classicRepository: ClassicLineupRepository,
    private val showdownRepository: ShowdownLineupRepository
) {
    fun getLineups(): List<SavedLineupResponse> {
        val classic = classicRepository.findAllByOrderByCreatedAtDesc().map { it.toResponse() }
        val showdown = showdownRepository.findAllByOrderByCreatedAtDesc().map { it.toResponse() }

        return (classic + showdown).sortedByDescending { it.createdAt }
    }

    fun saveLineup(request: SaveLineupRequest): SavedLineupResponse =
        when (request.contestMode) {
            ContestMode.CLASSIC -> {
                val lineup = createClassicLineup(request)
                classicRepository.save(lineup).toResponse()
            }
            ContestMode.SHOWDOWN -> {
                val lineup = createShowdownLineup(request)
                showdownRepository.save(lineup).toResponse()
            }
        }

    fun updateLineup(id: Long, request: SaveLineupRequest): SavedLineupResponse =
        when (request.contestMode) {
            ContestMode.CLASSIC -> updateClassicLineup(id, request).toResponse()
            ContestMode.SHOWDOWN -> updateShowdownLineup(id, request).toResponse()
        }

    fun deleteLineup(id: Long, contestMode: ContestMode) {
        when (contestMode) {
            ContestMode.CLASSIC -> classicRepository.deleteById(id)
            ContestMode.SHOWDOWN -> showdownRepository.deleteById(id)
        }
    }

    private fun updateClassicLineup(id: Long, request: SaveLineupRequest): ClassicLineup {
        val existing = classicRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Classic lineup $id not found") }
        val slots = readSlotNames(request.lineupData, 9)

        return classicRepository.save(
            ClassicLineup(
                id = existing.id,
                title = request.title,
                totalSalary = request.totalSalary,
                totalOwnership = extractTotalOwnership(request.lineupData),
                qb = slots[0],
                rb1 = slots[1],
                rb2 = slots[2],
                wr1 = slots[3],
                wr2 = slots[4],
                wr3 = slots[5],
                te = slots[6],
                flex = slots[7],
                dst = slots[8],
                lineupData = request.lineupData,
                createdAt = existing.createdAt,
                updatedAt = Instant.now()
            )
        )
    }

    private fun updateShowdownLineup(id: Long, request: SaveLineupRequest): ShowdownLineup {
        val existing = showdownRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Showdown lineup $id not found") }
        val slots = readSlotNames(request.lineupData, 6)

        return showdownRepository.save(
            ShowdownLineup(
                id = existing.id,
                title = request.title,
                totalSalary = request.totalSalary,
                totalOwnership = extractTotalOwnership(request.lineupData),
                captain = slots[0],
                player1 = slots[1],
                player2 = slots[2],
                player3 = slots[3],
                player4 = slots[4],
                player5 = slots[5],
                lineupData = request.lineupData,
                createdAt = existing.createdAt,
                updatedAt = Instant.now()
            )
        )
    }

    private fun createClassicLineup(request: SaveLineupRequest): ClassicLineup {
        val slots = readSlotNames(request.lineupData, 9)
        val now = Instant.now()

        return ClassicLineup(
            title = request.title,
            totalSalary = request.totalSalary,
            totalOwnership = extractTotalOwnership(request.lineupData),
            qb = slots[0],
            rb1 = slots[1],
            rb2 = slots[2],
            wr1 = slots[3],
            wr2 = slots[4],
            wr3 = slots[5],
            te = slots[6],
            flex = slots[7],
            dst = slots[8],
            lineupData = request.lineupData,
            createdAt = now,
            updatedAt = now
        )
    }

    private fun createShowdownLineup(request: SaveLineupRequest): ShowdownLineup {
        val slots = readSlotNames(request.lineupData, 6)
        val now = Instant.now()

        return ShowdownLineup(
            title = request.title,
            totalSalary = request.totalSalary,
            totalOwnership = extractTotalOwnership(request.lineupData),
            captain = slots[0],
            player1 = slots[1],
            player2 = slots[2],
            player3 = slots[3],
            player4 = slots[4],
            player5 = slots[5],
            lineupData = request.lineupData,
            createdAt = now,
            updatedAt = now
        )
    }

    private fun readSlotNames(lineupData: JsonNode, expectedSlots: Int): List<String> {
        val slotsNode = lineupData["slots"]
            ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "lineupData.slots is required")

        if (!slotsNode.isArray || slotsNode.size() < expectedSlots) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "lineupData.slots must contain at least $expectedSlots slot entries"
            )
        }

        return (0 until expectedSlots).map { index ->
            val playerName = slotsNode[index]?.get("player")?.get("name")?.asText()?.trim()
            if (playerName.isNullOrBlank()) {
                throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "lineupData.slots[$index].player.name is required"
                )
            }
            playerName
        }
    }

    private fun extractTotalOwnership(lineupData: JsonNode): BigDecimal {
        val playersNode = lineupData["players"] ?: return BigDecimal.ZERO
        if (!playersNode.isArray) return BigDecimal.ZERO

        var total = BigDecimal.ZERO
        playersNode.forEach { player ->
            val ownership = player["ownership"]?.asDouble() ?: 0.0
            total = total.add(BigDecimal.valueOf(ownership))
        }
        return total.setScale(2, java.math.RoundingMode.HALF_UP)
    }
}


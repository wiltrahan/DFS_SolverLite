package com.dfssolverlite.backend.service

import com.dfssolverlite.backend.domain.ContestMode
import com.dfssolverlite.backend.dto.SaveLineupRequest
import com.dfssolverlite.backend.entity.ClassicLineup
import com.dfssolverlite.backend.entity.ShowdownLineup
import com.dfssolverlite.backend.repository.ClassicLineupRepository
import com.dfssolverlite.backend.repository.ShowdownLineupRepository
import com.fasterxml.jackson.databind.node.JsonNodeFactory
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Mockito
import java.math.BigDecimal
import java.time.Instant
import java.util.Optional

class LineupServiceTest {

    private val classicRepository: ClassicLineupRepository = Mockito.mock(ClassicLineupRepository::class.java)
    private val showdownRepository: ShowdownLineupRepository = Mockito.mock(ShowdownLineupRepository::class.java)
    private val service = LineupService(classicRepository, showdownRepository)

    @Test
    fun `saveLineup stores classic lineup in classic repository`() {
        val lineupData = JsonNodeFactory.instance.objectNode().apply {
            putArray("players").addObject().put("ownership", 12.3)
            putArray("slots").apply {
                addObject().putObject("player").put("name", "QB Name")
                addObject().putObject("player").put("name", "RB1 Name")
                addObject().putObject("player").put("name", "RB2 Name")
                addObject().putObject("player").put("name", "WR1 Name")
                addObject().putObject("player").put("name", "WR2 Name")
                addObject().putObject("player").put("name", "WR3 Name")
                addObject().putObject("player").put("name", "TE Name")
                addObject().putObject("player").put("name", "FLEX Name")
                addObject().putObject("player").put("name", "DST Name")
            }
        }
        val request = SaveLineupRequest(
            title = "Classic lineup",
            contestMode = ContestMode.CLASSIC,
            totalSalary = 50000,
            lineupData = lineupData
        )

        Mockito.`when`(classicRepository.save(Mockito.any(ClassicLineup::class.java)))
            .thenAnswer { invocation ->
                val lineup = invocation.arguments[0] as ClassicLineup
                ClassicLineup(
                    id = 1L,
                    title = lineup.title,
                    totalSalary = lineup.totalSalary,
                    totalOwnership = lineup.totalOwnership,
                    qb = lineup.qb,
                    rb1 = lineup.rb1,
                    rb2 = lineup.rb2,
                    wr1 = lineup.wr1,
                    wr2 = lineup.wr2,
                    wr3 = lineup.wr3,
                    te = lineup.te,
                    flex = lineup.flex,
                    dst = lineup.dst,
                    lineupData = lineup.lineupData,
                    createdAt = lineup.createdAt,
                    updatedAt = lineup.updatedAt
                )
            }

        val response = service.saveLineup(request)
        val captor = ArgumentCaptor.forClass(ClassicLineup::class.java)
        Mockito.verify(classicRepository).save(captor.capture())
        Mockito.verifyNoInteractions(showdownRepository)

        assertEquals("Classic lineup", captor.value.title)
        assertEquals(BigDecimal("12.30"), captor.value.totalOwnership)
        assertEquals("QB Name", captor.value.qb)
        assertEquals(ContestMode.CLASSIC, response.contestMode)
    }

    @Test
    fun `updateLineup keeps createdAt and refreshes updatedAt for showdown`() {
        val id = 5L
        val createdAt = Instant.parse("2026-01-01T00:00:00Z")
        val existing = ShowdownLineup(
            id = id,
            title = "Old",
            totalSalary = 45000,
            totalOwnership = BigDecimal.ZERO,
            captain = "Captain Old",
            player1 = "P1",
            player2 = "P2",
            player3 = "P3",
            player4 = "P4",
            player5 = "P5",
            lineupData = JsonNodeFactory.instance.objectNode(),
            createdAt = createdAt,
            updatedAt = createdAt
        )
        val lineupData = JsonNodeFactory.instance.objectNode().apply {
            putArray("slots").apply {
                addObject().putObject("player").put("name", "Captain New")
                addObject().putObject("player").put("name", "P1 New")
                addObject().putObject("player").put("name", "P2 New")
                addObject().putObject("player").put("name", "P3 New")
                addObject().putObject("player").put("name", "P4 New")
                addObject().putObject("player").put("name", "P5 New")
            }
        }
        val request = SaveLineupRequest(
            title = "Updated",
            contestMode = ContestMode.SHOWDOWN,
            totalSalary = 50000,
            lineupData = lineupData
        )

        Mockito.`when`(showdownRepository.findById(id)).thenReturn(Optional.of(existing))
        Mockito.`when`(showdownRepository.save(Mockito.any(ShowdownLineup::class.java)))
            .thenAnswer { invocation -> invocation.arguments[0] as ShowdownLineup }

        val response = service.updateLineup(id, request)
        val captor = ArgumentCaptor.forClass(ShowdownLineup::class.java)
        Mockito.verify(showdownRepository).save(captor.capture())

        assertEquals(id, captor.value.id)
        assertEquals(createdAt, captor.value.createdAt)
        assertEquals("Captain New", captor.value.captain)
        assertEquals("Updated", response.title)
        assertEquals(ContestMode.SHOWDOWN, response.contestMode)
    }

    @Test
    fun `deleteLineup routes by contest mode`() {
        service.deleteLineup(10L, ContestMode.CLASSIC)
        service.deleteLineup(20L, ContestMode.SHOWDOWN)

        Mockito.verify(classicRepository).deleteById(10L)
        Mockito.verify(showdownRepository).deleteById(20L)
    }
}

data class RoomSummary(val name: String, val available: Int)

interface RoomReport {
    fun render(room: RoomSummary): String
}

object CompactReport : RoomReport {
    override fun render(room: RoomSummary): String =
        "${room.name}: ${room.available}"
}

class SentenceReport(val prefix: String) : RoomReport {
    override fun render(room: RoomSummary): String =
        "$prefix ${room.name} has ${room.available} places available."
}

fun show(room: RoomSummary, report: RoomReport) {
    println(report.render(room))
}

object CsvReport : RoomReport {
    override fun render(room: RoomSummary): String =
        "${room.name},${room.available}"
}

fun main() {
    val room = RoomSummary("A1", 3)
    show(room, CsvReport)
    show(room, CompactReport)
    show(room, SentenceReport("Room"))
}

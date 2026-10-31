enum class RoomKind(val seats: Int) {
    SEMINAR(12), LAB(24)
}

object BookingRules {
    const val MAX_MINUTES = 120
    fun accepts(minutes: Int): Boolean = minutes in 1..MAX_MINUTES
}

class Booking private constructor(val minutes: Int) {
    companion object {
        fun create(minutes: Int): Booking {
            require(BookingRules.accepts(minutes))
            return Booking(minutes)
        }
    }
}

fun main() {
    val first = Booking.create(45)
    val second = Booking.create(45)
    println(RoomKind.SEMINAR.seats)
    println(first.minutes)
    println(first === second)
    println(BookingRules.accepts(121))
}

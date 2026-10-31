class Room(val capacity: Int) {
    init {
        require(capacity > 0)
    }
    var occupied: Int = 0
        private set
    val available: Int
        get() = capacity - occupied

    fun reserve(places: Int): Boolean {
        require(places > 0)
        if (places > available) return false
        occupied += places
        return true
    }

    fun release(places: Int) {
        require(places in 1..occupied)
        occupied -= places
    }
}

fun main() {
    val room = Room(3)
    println(room.reserve(2))
    println(room.reserve(2))
    room.release(1)
    println(room.occupied)
    println(room.available)
}

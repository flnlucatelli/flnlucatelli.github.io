class Room(val capacity: Int) {
    init {
        require(capacity > 0)
    }
    var occupied: Int = 0
        private set
    val available: Int
        get() = capacity - occupied

    val isFull: Boolean
        get() = occupied == capacity

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
    println(room.isFull)
    room.reserve(3)
    println(room.isFull)
}

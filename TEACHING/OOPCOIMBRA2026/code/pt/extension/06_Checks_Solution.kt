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
    check(room.occupied == 0)
    check(room.reserve(3))
    check(room.available == 0)
    check(!room.reserve(1))
    check(room.occupied == 3)
    room.release(3)
    check(room.occupied == 0)
    check(room.available == 3)

    var rejected = false
    try {
        room.reserve(0)
    } catch (error: IllegalArgumentException) {
        rejected = true
    }
    check(rejected)
    check(room.occupied == 0)
    var invalidRelease = false
    try {
        room.release(1)
    } catch (error: IllegalArgumentException) {
        invalidRelease = true
    }
    check(invalidRelease)
    check(room.occupied == 0)
    println("Todas as verificações foram satisfeitas.")
}

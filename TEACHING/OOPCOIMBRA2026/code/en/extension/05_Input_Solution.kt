fun parsePlaces(text: String?): Int? {
    val places = text?.trim()?.toIntOrNull() ?: return null
    if (places <= 0) return null
    return places
}

fun main() {
    println("Number of places:")
    val places = parsePlaces(readlnOrNull())
    if (places == null) {
        println("Invalid input")
        return
    }
    println("Requested: $places")
}

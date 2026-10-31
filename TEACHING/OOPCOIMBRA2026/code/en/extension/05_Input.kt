fun parsePlaces(text: String?): Int? {
    val places = text?.trim()?.toIntOrNull() ?: return null
    if (places <= 0) return null
    return places
}

fun main() {
    val inputs: List<String?> = listOf(" 2 ", "two", "0", null)
    for (text in inputs) {
        val places = parsePlaces(text)
        println(places ?: "Invalid input")
    }
}

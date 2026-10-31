fun parsePlaces(text: String?): Int? {
    val places = text?.trim()?.toIntOrNull() ?: return null
    if (places <= 0) return null
    return places
}

fun main() {
    println("Número de lugares:")
    val places = parsePlaces(readlnOrNull())
    if (places == null) {
        println("Entrada inválida")
        return
    }
    println("Pedido: $places")
}

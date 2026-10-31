sealed interface BookingResult

data class Accepted(val remaining: Int) : BookingResult
data class Rejected(val reason: String) : BookingResult

fun request(available: Int, wanted: Int): BookingResult {
    require(available >= 0)
    require(wanted > 0)
    return if (wanted <= available) {
        Accepted(available - wanted)
    } else {
        Rejected("Lugares insuficientes")
    }
}

fun describe(result: BookingResult): String = when (result) {
    is Accepted -> "Aceite; lugares restantes: ${result.remaining}"
    is Rejected -> "Recusado: ${result.reason}"
}

fun main() {
    println(describe(request(3, 2)))
    println(describe(request(3, 4)))
}

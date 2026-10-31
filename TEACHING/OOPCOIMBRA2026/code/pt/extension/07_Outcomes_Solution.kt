sealed interface BookingResult

data class Accepted(val remaining: Int) : BookingResult
data class Rejected(val reason: String, val available: Int) : BookingResult

fun request(available: Int, wanted: Int): BookingResult {
    require(available >= 0)
    require(wanted > 0)
    return if (wanted <= available) {
        Accepted(available - wanted)
    } else {
        Rejected("Lugares insuficientes", available)
    }
}

fun describe(result: BookingResult): String = when (result) {
    is Accepted -> "Aceite; lugares restantes: ${result.remaining}"
    is Rejected -> "Recusado: ${result.reason}; disponíveis: ${result.available}"
}

fun main() {
    println(describe(request(3, 2)))
    println(describe(request(3, 4)))
}

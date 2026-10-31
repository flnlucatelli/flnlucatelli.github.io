enum class DiaChegada { MESMO, SEGUINTE, DOIS_DIAS }

fun minutos(dia: DiaChegada): Int = TODO("Use when")

fun main() {
    for (dia in DiaChegada.entries) {
        println(minutos(dia))
    }
}

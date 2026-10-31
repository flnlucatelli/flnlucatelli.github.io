enum class DiaChegada { MESMO, SEGUINTE }

fun main() {
    val dias: List<DiaChegada> = DiaChegada.entries
    println(dias)
    for (dia in dias) {
        println(dia)
    }
}

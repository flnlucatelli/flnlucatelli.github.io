data class Leitor(val id: String, val nome: String)

fun main() {
    val a = Leitor("R1", "Ana")
    val b = Leitor("R1", "Ana")
    println(a == b)
    println(a === b)
    println(a)
}

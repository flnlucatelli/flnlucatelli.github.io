class Leitor(val nome: String)

fun main() {
    val a = Leitor("Ana")
    val b = Leitor("Ana")
    val c = a
    println(a == b)
    println(a === b)
    println(a === c)
}

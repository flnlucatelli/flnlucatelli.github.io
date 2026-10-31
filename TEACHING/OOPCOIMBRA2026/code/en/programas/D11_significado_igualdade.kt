data class Fracao(val n: Int, val d: Int)

fun main() {
    val a = Fracao(1, 2)
    val b = Fracao(2, 4)
    println(a == b)
    println(a)
    println(b)
}

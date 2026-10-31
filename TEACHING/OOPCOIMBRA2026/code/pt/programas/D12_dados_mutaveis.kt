data class Leitura(var valor: Int)

fun main() {
    val a = Leitura(10)
    val b = Leitura(10)
    println(a == b)
    a.valor = 11
    println(a == b)
    println(a.valor)
}

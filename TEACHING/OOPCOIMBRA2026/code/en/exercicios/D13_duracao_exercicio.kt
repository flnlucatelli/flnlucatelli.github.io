data class Duracao(val minutos: Int) {
    init { require(minutos in 0..1440) }
    fun segundos(): Int = TODO("Convert")
}

fun main() {
    val a = Duracao(50)
    val b = a.copy(minutos = 60)
    println(a.segundos())
    println(b.segundos())
    println(a.minutos)
    println(a == Duracao(50))
}

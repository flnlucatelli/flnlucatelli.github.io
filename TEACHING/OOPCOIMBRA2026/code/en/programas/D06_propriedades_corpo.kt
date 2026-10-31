data class Leitor(val nome: String) {
    var consultas = 0
}

fun main() {
    val a = Leitor("Ana")
    a.consultas = 3
    val b = a.copy()
    println(a == b)
    println(b.consultas)
    println(a)
}

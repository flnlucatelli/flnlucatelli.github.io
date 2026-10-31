class Contador {
    var total: Int = 0
        private set
    fun registar() {
        total += 1
    }
}
fun main() {
    val a = Contador()
    val b = Contador()
    a.registar()
    println(a.total)
    println(b.total)
}

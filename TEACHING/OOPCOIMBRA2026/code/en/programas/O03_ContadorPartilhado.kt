object ContadorViagens {
    var total: Int = 0
        private set
    fun registar() {
        total += 1
    }
}
fun main() {
    val a = ContadorViagens
    val b = ContadorViagens
    a.registar()
    b.registar()
    println(a.total)
    println(b.total)
}

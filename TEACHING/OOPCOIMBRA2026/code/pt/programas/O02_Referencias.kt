object RegrasViagem {
    val limite: Int = 1440
    fun aceita(minutos: Int): Boolean =
        minutos in 0..limite
}
fun main() {
    val primeira = RegrasViagem
    val segunda = RegrasViagem
    println(primeira === segunda)
    println(primeira.aceita(50))
}

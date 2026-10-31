object RegrasViagem {
    val limite: Int = 1440
    fun aceita(minutos: Int): Boolean =
        minutos in 0..limite
}
fun main() {
    println(RegrasViagem.limite)
    println(RegrasViagem.aceita(50))
    println(RegrasViagem.aceita(1500))
}

interface Operacao {
    fun aplicar(a: Int, b: Int): Int
}
object Diferenca : Operacao {
    override fun aplicar(a: Int, b: Int): Int {
        TODO("Devolver a menos b")
    }
}
fun main() {
    val op: Operacao = Diferenca
    println(op.aplicar(9, 4))
    println(op.aplicar(4, 9))
}

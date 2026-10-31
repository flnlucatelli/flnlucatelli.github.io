interface Operacao {
    fun aplicar(a: Int, b: Int): Int
}
object Soma : Operacao {
    override fun aplicar(a: Int, b: Int): Int = a + b
}
object Produto : Operacao {
    override fun aplicar(a: Int, b: Int): Int = a * b
}
fun main() {
    val op: Operacao = Produto
    println(op.aplicar(4, 3))
}

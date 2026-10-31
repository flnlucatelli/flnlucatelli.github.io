interface Operacao {
    fun aplicar(a: Int, b: Int): Int
}
class Soma : Operacao {
    override fun aplicar(a: Int, b: Int): Int {
        return a + b
    }
}
fun main() {
    val soma = Soma()
    println(soma.aplicar(4, 3))
}

interface Operacao {
    fun aplicar(a: Int, b: Int): Int
}
class Soma : Operacao {
    override fun aplicar(a: Int, b: Int): Int = a + b
}
class Produto : Operacao {
    override fun aplicar(a: Int, b: Int): Int = a * b
}
fun mostrar(op: Operacao) {
    println(op.aplicar(4, 3))
}
fun main() {
    mostrar(Soma())
    mostrar(Produto())
}

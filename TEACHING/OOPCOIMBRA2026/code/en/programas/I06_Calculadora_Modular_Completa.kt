// Complete program for Kotlin Playground.
// Paste this file on its own and run main.
// Part 1: a contract and two stateless operations.
interface Operacao {
    fun aplicar(a: Int, b: Int): Int
}
object Soma : Operacao {
    override fun aplicar(a: Int, b: Int): Int = a + b
}
object Multiplicacao : Operacao {
    override fun aplicar(a: Int, b: Int): Int = a * b
}

// Part 2: a valid modulus and normalisation of any Long.
// The first remainder lies between -(n - 1) and n - 1.
// Adding n makes it positive; the second remainder reduces it to 0..n-1.
class Modulo(val valor: Int) {
    init {
        require(valor in 2..12)
    }
    fun representante(x: Long): Int {
        val n = valor.toLong()
        return (((x % n) + n) % n).toInt()
    }
}

// Part 3: result data and coordination of the calculation.
// First we reduce the operands. The sum and product
// stay small because each representative is in 0..11.
data class Resultado(
    val a: Int, val b: Int, val valor: Int
)
class Calculadora(val modulo: Modulo) {
    fun calcular(
        op: Operacao, x: Long, y: Long
    ): Resultado {
        val a = modulo.representante(x)
        val b = modulo.representante(y)
        val bruto = op.aplicar(a, b)
        val r = modulo.representante(bruto.toLong())
        return Resultado(a, b, r)
    }
}

// Part 4: fixed examples that do not require keyboard input.
// L makes the Long type of the operands explicit.
fun main() {
    val calc = Calculadora(Modulo(5))
    val soma = calc.calcular(Soma, -1L, 3L)
    val produto = calc.calcular(Multiplicacao, -1L, 3L)
    println("Representatives: ${soma.a} and ${soma.b}")
    println("Sum: ${soma.valor}")
    println("Product: ${produto.valor}")
}

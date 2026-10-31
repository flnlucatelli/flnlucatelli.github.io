// Programa completo para Kotlin Playground.
// Cole este ficheiro sozinho e execute main.
// Parte 1: contrato e duas operacoes sem estado.
interface Operacao {
    fun aplicar(a: Int, b: Int): Int
}
object Soma : Operacao {
    override fun aplicar(a: Int, b: Int): Int = a + b
}
object Multiplicacao : Operacao {
    override fun aplicar(a: Int, b: Int): Int = a * b
}

// Parte 2: modulo valido e normalizacao de qualquer Long.
// O primeiro resto fica entre -(n - 1) e n - 1.
// Somar n torna-o positivo; o segundo resto reduz a 0..n-1.
class Modulo(val valor: Int) {
    init {
        require(valor in 2..12)
    }
    fun representante(x: Long): Int {
        val n = valor.toLong()
        return (((x % n) + n) % n).toInt()
    }
}

// Parte 3: dados do resultado e coordenacao do calculo.
// Primeiro reduzimos os operandos. A soma e o produto
// ficam pequenos porque cada representante esta em 0..11.
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

// Parte 4: exemplos fixos, independentes de entrada pelo teclado.
// L torna explicito o tipo Long dos operandos.
fun main() {
    val calc = Calculadora(Modulo(5))
    val soma = calc.calcular(Soma, -1L, 3L)
    val produto = calc.calcular(Multiplicacao, -1L, 3L)
    println("Representantes: ${soma.a} e ${soma.b}")
    println("Soma: ${soma.valor}")
    println("Produto: ${produto.valor}")
}

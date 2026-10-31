class Contador {
    private var valor = 0
    fun avancar() {
        require(valor < 3) { "Limite atingido." }
        valor += 1
    }
    fun atual(): Int = valor
}

fun main() {
    val contador = Contador()
    contador.avancar()
    println(contador.atual())
}

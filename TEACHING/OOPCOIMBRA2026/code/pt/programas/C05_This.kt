class Contador(var valor: Int) {
    fun definir(valor: Int) {
        this.valor = valor
    }
}

fun main() {
    val contador = Contador(2)
    contador.definir(7)
    println(contador.valor)
}

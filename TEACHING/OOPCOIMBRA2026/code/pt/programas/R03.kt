fun main() {
    try {
        val hora = 24
        require(hora in 0..23) { "Hora inválida" }
        println("Aceite")
    } catch (erro: IllegalArgumentException) {
        println(erro.message)
    }
    println("Continuamos")
}

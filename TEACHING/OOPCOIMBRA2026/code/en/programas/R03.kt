fun main() {
    try {
        val hora = 24
        require(hora in 0..23) { "Invalid time" }
        println("Accepted")
    } catch (erro: IllegalArgumentException) {
        println(erro.message)
    }
    println("Continuing")
}

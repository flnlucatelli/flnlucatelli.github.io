class Emprestimo {
    var ativo = true
        private set
    val devolvido: Boolean
        get() = !ativo
    fun devolver() {
        require(ativo) { "Already returned." }
        ativo = false
    }
}
fun main() {
    val emprestimo = Emprestimo()
    println(emprestimo.devolvido)
    emprestimo.devolver()
    println(emprestimo.devolvido)
}

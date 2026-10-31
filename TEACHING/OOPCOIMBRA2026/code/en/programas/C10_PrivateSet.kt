class Emprestimo {
    var ativo: Boolean = true
        private set
    fun devolver() {
        require(ativo) { "Already returned." }
        ativo = false
    }
}

fun main() {
    val emprestimo = Emprestimo()
    println(emprestimo.ativo)
    emprestimo.devolver()
    println(emprestimo.ativo)
}

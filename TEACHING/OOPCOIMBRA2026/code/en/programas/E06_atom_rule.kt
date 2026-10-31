enum class Atom { A, B, C, D, E }
data class Rule(
    val antecedent: Atom, val conclusion: Atom
) {
    fun accepts(atom: Atom): Boolean = atom == antecedent
}

fun main() {
    val regra = Rule(Atom.A, Atom.B)
    println(regra)
    println(regra.accepts(Atom.A))
    println(regra.accepts(Atom.C))
}

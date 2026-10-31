class Rotulo(texto: String) {
    val textoGuardado: String = texto
}

fun main() {
    val rotulo = Rotulo("Library")
    println(rotulo.textoGuardado)
}

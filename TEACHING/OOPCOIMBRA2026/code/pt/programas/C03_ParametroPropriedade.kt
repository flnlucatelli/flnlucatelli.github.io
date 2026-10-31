class Rotulo(texto: String) {
    val textoGuardado: String = texto
}

fun main() {
    val rotulo = Rotulo("Biblioteca")
    println(rotulo.textoGuardado)
}

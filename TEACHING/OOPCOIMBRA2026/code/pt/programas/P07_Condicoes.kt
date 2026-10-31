fun main() {
    val hora = 23
    val valida = hora >= 0 && hora <= 23
    if (valida) {
        println("Hora aceite")
    } else {
        println("Hora recusada")
    }
    println(hora == 23)
    println(hora != 23)
}

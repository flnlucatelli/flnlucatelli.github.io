fun main() {
    val hora = 23
    val valida = hora >= 0 && hora <= 23
    if (valida) {
        println("Time accepted")
    } else {
        println("Time rejected")
    }
    println(hora == 23)
    println(hora != 23)
}

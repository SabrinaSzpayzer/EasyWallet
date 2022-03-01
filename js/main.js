var tc;
const destinatarios = [];
var saldo = 125455.22;
var saldoD = 1230.45;

// Calse de objetos para Array Destinatarios de Transferencia
class Destinatario {
    constructor (nombre, cbu) {
        this.nombre = nombre;
        this.cbu = cbu;
    }

    mostrar() {
        console.log("Destinatario agregado: Nombre: " + this.nombre + " | CBU: " + this.cbu);
    }
}

// Saldo Actual
var saldoActual = document.createElement("p");
saldoActual.innerHTML = "$ " + saldo;
saldoActual.className = "pSaldo";
document.getElementById("saldo").appendChild(saldoActual);

var saldoDolares = document.createElement("p");
saldoDolares.innerHTML = "U$S " + saldoD;
saldoDolares.className = "pSaldo";
document.getElementById("saldoD").appendChild(saldoDolares);

// Transferencias
$("#btnSeccionT").click(() => { 
    $("#seccionToggleT").toggle("fast");
});
let botonTransferir = document.getElementById("btnTransferir");
botonTransferir.addEventListener("click", function(){  
    var monto = document.getElementById("montoTransferencia");
    if (document.getElementById("listadoDestinatarios").value == "seleccione") {
        $(".mensajeTransferencia").append(`<p class="mensajeT">Debe seleccionar el destinatario de transferencia</p>`);     
        $(".mensajeT").css("font-weight","800")
                      .delay(4000)
                      .fadeOut(500);
    } else {
        if (monto.value > saldo) {
            $(".mensajeTransferencia").append(`<p class="mensajeT">Saldo insuficiente</p>`);     
            $(".mensajeT").css("font-weight","800")
                          .delay(4000)
                          .fadeOut(500);
        } else {
            var saldoFinal = saldo - monto.value;
            saldo = parseFloat(saldoFinal.toFixed(2));
            $(".mensajeTransferencia").append(`<p class="mensajeT">La transferencia se realizó correctamente y su saldo final es de $${saldo}</p>`);     
            $(".mensajeT").css("font-weight","800")
                          .delay(4000)
                          .fadeOut(500);
            saldoActual.innerHTML = "$ " + saldo;
        }
    }
    monto.value = "";
})

let botonActualizarAgenda = document.getElementById("btnActualizarAgenda");
botonActualizarAgenda.addEventListener("click", function(){
    for (const destinatario of destinatarios) {
        destinatario.mostrar();  
        let listado = document.createElement("option");   
        listado.innerHTML = `Nombre: ${destinatario.nombre} | CBU / CVU: ${destinatario.cbu}`;
        listado.className = "destinatario";
        document.getElementById("listadoDestinatarios").appendChild(listado);
    } 
})

// Agenda de Destinatarios
$("#btnSeccionDe").click(() => { 
    $("#seccionToggleDe").toggle("fast");
});
let botonAgenda = document.getElementById("btnAgenda");
botonAgenda.addEventListener("click", function(){
    if (document.getElementById("cbuDestinatario").value.length == 22) {
        destinatarios.push(new Destinatario(document.getElementById("nombreDestinatario").value.toUpperCase(), document.getElementById("cbuDestinatario").value));
        destinatarios.sort(function(a, b){
            if(a.nombre < b.nombre) { return -1; }
            if(a.nombre > b.nombre) { return 1; }
            return 0;
        })
        $(".mensajeAgenda").append(`<p class="mensajeA">Destinatario agregado correctamente</p>`);
        $(".mensajeA").css("font-weight","800")
                      .delay(4000)
                      .fadeOut(500);
    } else {
        $(".mensajeAgenda").append(`<p class="mensajeA">El CBU / CVU debe contener 22 dígitos</p>`);
        $(".mensajeA").css("font-weight","800")
                      .delay(4000)
                      .fadeOut(500);
    }  
    document.getElementById("nombreDestinatario").value = "";
    document.getElementById("cbuDestinatario").value = "";
    sessionStorage.setItem("sessionDestinatarios", JSON.stringify(destinatarios));
})

// Comprar Dólares
$("#btnSeccionDo").click(() => { 
    $("#seccionToggleDo").toggle("fast");
});
let botonDolares = document.getElementById("btnDolares");
botonDolares.addEventListener("click", function(){
    var monto = parseFloat(document.getElementById("montoCompra").value);
    if (monto > saldo) {
        $(".mensajeDolares").append(`<p class="mensajeD">Saldo insuficiente</p>`);
        $(".mensajeD").css("font-weight","800")
                      .delay(4000)
                      .fadeOut(500);
    } else {
        const URLGET = 
        "https://www.dolarsi.com/api/api.php?type=valoresprincipales";
        $.ajax({
            method: "GET",
            async: false,
            url: URLGET,
            datatype: "json",           
            success: function(dolar) {
                    encontrar(dolar);
                    return tc;
                    }
        });
        function encontrar(dolar){
            tc = dolar;
        }
        console.log(tc);
        var saldoFinal = saldo - monto;
        var dolares = monto / parseFloat(tc[6].casa.venta);
        var montoDolares = dolares.toFixed(2);
        saldo = parseFloat(saldoFinal.toFixed(2));
        saldoD = parseFloat((saldoD + dolares).toFixed(2));
        $(".mensajeDolares").append(`<p class="mensajeD">Usted compró U$S${montoDolares} y su saldo final es de $${saldo}</p>`);
        $(".mensajeD").css("font-weight","800")
                      .delay(4000)
                      .fadeOut(500);
        saldoActual.innerHTML = "$ " + saldo;
        saldoDolares.innerHTML = "U$S " + saldoD;
    }
    document.getElementById("montoCompra").value = "";
})

// Cerrar Sesión
$("#btnSesion").on('click', cerrarSesion);

function cerrarSesion () {
    alert ("La sesión se cerró correctamente.");
    saldo = 125455.22;
    saldoD = 1230.45;
    saldoActual.innerHTML = "$ " + saldo;
    saldoDolares.innerHTML = "U$S " + saldoD;
}
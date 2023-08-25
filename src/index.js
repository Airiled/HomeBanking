let users = [];

function Usuario(nombre, apellido, email, contraseña, cuentas, historialTransacciones){
    const id = () => { //funcion para crear id random
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    this.id = id();
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.contraseña = contraseña;
    this.cuentas = cuentas;
    this.historialTransacciones = historialTransacciones;
}
    
Usuario.prototype.crearCuenta = function(tipoDeCuenta, saldo) { //Le asignamos las 4 cuentas con un valor de 0 pesos, y la caja de ahorro en pesos de 1000
    
    const numeroRandom = () => {
        return parseInt(Math.floor(Math.random() * 100));
    }
    let numeroDeCuenta = numeroRandom();
    
    let nombreDeCuenta;
    if(tipoDeCuenta === 0) nombreDeCuenta = 'Caja de Ahorro en Pesos';
    if(tipoDeCuenta === 1) nombreDeCuenta = 'Cuenta Corriente en Pesos';
    if(tipoDeCuenta === 2) nombreDeCuenta = 'Caja de Ahorro en Dolares';
    if(tipoDeCuenta === 3) nombreDeCuenta = 'Cuenta Corriente en Dolares';

    this.cuentas[tipoDeCuenta] = {
        numeroDeCuenta: numeroDeCuenta,
        tipoDeCuenta: nombreDeCuenta,
        saldo: saldo,
    }  
}

Usuario.prototype.transferirDinero = function(tipoDeCuenta, cuentaDestino, saldo, email, id) {

    if(this.email == email){
        this.cuentas[tipoDeCuenta].saldo -= saldo;
        this.cuentas[cuentaDestino].saldo += saldo;
        alert(`Se realizo la transaccion exitosamente`);
        
        const mensaje = `Se realizo una transaccion desde su ${JSON.stringify(this.cuentas[tipoDeCuenta].tipoDeCuenta)} a su ${JSON.stringify(this.cuentas[cuentaDestino].tipoDeCuenta)} de ${saldo}$`;
        this.agregarHistorialTransacciones('Transferencia de Dinero', new Date(), saldo, 'Cuenta actual', mensaje, tipoDeCuenta);
        return
    }
    this.cuentas[tipoDeCuenta].saldo -= saldo;
    users[id].cuentas[cuentaDestino].saldo += saldo;
    alert(`Se realizo la transaccion exitosamente`);

    const mensaje = `Se realizo una transaccion desde su ${JSON.stringify(this.cuentas[tipoDeCuenta].tipoDeCuenta)} hacia la ${JSON.stringify(users[id].cuentas[cuentaDestino].tipoDeCuenta)} de ${users[id].nombre} con un monto de ${saldo}$`;
    this.agregarHistorialTransacciones('Transferencia de Dinero', new Date(), saldo, users[id].email, mensaje, tipoDeCuenta);
}

Usuario.prototype.manejarDineroFisico = function(tipoDeCuenta, saldo, accion) {
    accion = accion.toLowerCase();

    if(accion == 'ingresar') this.cuentas[tipoDeCuenta].saldo += saldo;
    if(accion == 'retirar') this.cuentas[tipoDeCuenta].saldo -= saldo;
    
    alert('La operacion se realizo correctamente!');

    const nombreTransaccion = (accion.charAt(0).toUpperCase() + accion.slice(1)) + ' Dinero';
    const mensaje = (accion == 'ingresar') ? `Se realizo un deposito de dinero de ${saldo}$`: `Se realizo un retiro de dinero de ${saldo}$`;
    this.agregarHistorialTransacciones(nombreTransaccion, new Date(), saldo, 'Cuenta Propia', mensaje, tipoDeCuenta);
}

Usuario.prototype.comprarDivisas = function(pesos, dolares) {
    this.cuentas[0].saldo -= pesos;

    if(!this.cuentas[2]){ //si no tiene caja de ahorro para dolares le abrimos una automaticamente y le depositamos sus dolares
        this.crearCuenta(2, dolares);
        alert('No posee una Caja de Ahorros en dolares por lo que se le abrió una y se le depositaron sus dolares ahi.');
        return
    }

    //transaccion de pesos a dolares
    this.cuentas[2].saldo += dolares;

    alert('Se completo la compra con exito!');

    const mensaje = `Se hizo una compra de divisas, cambiando ${pesos}ARS por ${dolares}USD`;
    this.agregarHistorialTransacciones('Comprar Divisas', new Date(), dolares + ' USD', 'Cuenta Propia', mensaje, 2);

}

Usuario.prototype.venderDivisas = function(pesos, dolares) {
    this.cuentas[0].saldo += pesos;
    this.cuentas[2].saldo -= dolares;

    alert('Sus dolares fueron convertidos a ARS \nSe completo la compra con exito!');

    const mensaje = `Se hizo una venta de divisas, cambiando ${dolares}USD por ${dolares}ARS`;
    this.agregarHistorialTransacciones('Vender Divisas', new Date(), dolares + ' USD', 'Cuenta Propia', mensaje, 0);
}

Usuario.prototype.agregarHistorialTransacciones = function(nombreTransaccion, fechaTransaccion, saldo, destinatario, mensaje, tipoDeCuenta) {
    const nuevaPosicion = this.historialTransacciones.length;

    this.historialTransacciones[nuevaPosicion] = {
        transaccion: `Tipo de operacion: ${nombreTransaccion}`,
        fecha: `Fecha: ${fechaTransaccion}`,
        cantidadDinero: `Monto: ${saldo} desde ${this.cuentas[tipoDeCuenta].tipoDeCuenta}`,
        destinatario: `Destino ${destinatario}`,
        mensaje: `Detalles: ${mensaje}`
    };
}

function menuInicial() {
    let opcion = parseInt(prompt(`
    Menu Principal
    1. Ingresar Cuenta
    2. Crear Cuenta
    3. Salir

    Indique la operacion que desea realizar
    `
    ));
    
    switch (opcion) {
        case 1:
            ingresarCuenta();
            break;
        
        case 2:
            crearCuenta();
            break;

        case 3:
            console.log('Gracias por utilizar nuestros servicios\nEl programa va a terminar.');
            process.exit(1);
            break;

        default:
            console.log('Solo se permiten numeros entre 1 y 3, vuelva a intentarlo');
            menuInicial();
            break;
    }
}

function ingresarCuenta() {

    const buscarEmail = prompt('Ingrese el mail de su cuenta: ');

    const [emailUsuarioSolicitado, id] = verificarCuentaSolicitada(buscarEmail);
    
    if(!emailUsuarioSolicitado){  //se pone la posicion 0 debido a que la funcion filter nos devuevle un array, por eso siempre vamos a usar esa posicion.
        alert('El email ingresado es incorrecto');
        menuInicial();
    }

    const buscarContraseña = prompt('Ingrese su contraseña: ');
    if(users[id].contraseña != buscarContraseña){
        alert('La contraseña ingresada es incorrecta');
        menuInicial();
    }

    menuDelUsuario(users[id]);
}

function crearCuenta() {
    const reContraseña = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]/  
    const reEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 

    const nombre = prompt('Ingrese el nombre: ');
    const apellido = prompt('Ingrese el apellido: ');
    const email = prompt(`
    Ingrese un email: 
    (Ejemplo: user@example.com)
    `);
    const contraseña = prompt(`
    Ingrese una contraseña: 
    (Esta debe poseer numeros, letras y al menos una mayuscula) 
    *Ejemplo: Contraseña123456
    `);
    const cuentas = [];
    const historialTransacciones = [];

    const existeEmailIngresado = users.filter(user => (user.email == email) ? true : false)
    console.log(existeEmailIngresado[0]);

    if(existeEmailIngresado[0]){
        alert('El email ingresado ya existe, verifique si ya posee una cuenta o intente de nuevo con otro email')
        menuInicial();
    }

    if(!reContraseña.test(contraseña) && !reEmail.test(email)){
        alert('El email y contraseña ingresados no cumplen con los requisitos. \nVuelva a intentarlo');
        menuInicial();
    }

    if(!reContraseña.test(contraseña)){
        alert('La contraseña ingresada no cumple con los requisitos. \nVuelva a intentarlo');
        menuInicial();
    }

    if(!reEmail.test(email)){
        alert('El email ingresado no cumple con los requisitos. \nVuelva a intentarlo');
        menuInicial();
    }

    const nuevoUsuario = new Usuario(nombre, apellido, email, contraseña, cuentas, historialTransacciones);
    users.push(nuevoUsuario);

    nuevoUsuario.crearCuenta(0, 1000);
    alert('Felicidades, la cuenta ha sido creada. Como agradecimiento se le abrió una caja de ahorro en pesos con un bono de 1000ARS');
    menuInicial(); //volvemos al menu inicial
}

function menuDelUsuario(user) {

    let opcion = parseInt(prompt(
    `Bienvenido ${user.nombre} ${user.apellido}\n¿Que operacion desea realizar?
    1. Transferencias
    2. Ingresos/Egresos
    3. Compra/Venta de divisas
    4. Abrir nueva cuenta
    5. Informacion de la Cuenta
    6. Historial de Transacciones
    7. Volver al menu inicial
    `
    ));
    switch (opcion) {
        case 1:
            menuTransferencia(user);
            break;
        case 2:
            menuIngresoEgreso(user);
            break;
        case 3:
            menuDivisas(user);
            break;
        case 4:
            abrirNuevaCuenta(user);
            break;
        case 5:
            informacionDelUsuario(user);
            break;
        case 6:
            historialTransacciones(user);
            break;
        case 7:
            menuInicial();
            break;
        default:
            alert('Ingrese un valor correcto');
            menuDelUsuario(user);
            break;
    }

}

function menuTransferencia(user) {

    let opcion = parseInt(prompt(`
    1. Transferir entre mis cuentas
    2. Transferir a otra cuenta
    3. Volver atras

    Ingrese la operacion que desea realizar`
    ));

    switch (opcion) {
        case 1:
            transferirACuentaPropia(user);
            break;
        case 2:
            transferirAOtroUsuario(user);
            break;
        case 3:
            menuDelUsuario(user);
            break;
        case 4:
            menuTransferencia(user);                   
    
        default:
            alert('Ingrese un valor correcto');
            menuTransferencia(user);
    }

}

function menuIngresoEgreso(user) {
    console.log(`1. Ingresar Dinero     2. Retirar Dinero     3. Volver atras`);
    const opcion = parseInt(prompt(
    `
    1. Ingresar Dinero
    2. Retirar Dinero
    3. Volver atras

    Indique la operacion que desea realizar`
    ));

    if(opcion < 1 && opcion > 3){
        alert('Ingrese un valor correcto');
        menuDelUsuario(user)
    }
    if(opcion === 1) ingresarDinero(user);
    if(opcion === 2) retirarDinero(user);
    if(opcion === 3) menuDelUsuario(user);
}

function historialTransacciones(user) {
    const longitudHistorial = user.historialTransacciones.length;
    
    if(longitudHistorial === 0){
        alert('No se realizaron ningun tipo de transaccion desde esta cuenta');
        return menuDelUsuario(user);
    }

    if(longitudHistorial === 1){
        alert(`
        ${JSON.stringify(user.historialTransacciones[0].transaccion)}
        ${JSON.stringify(user.historialTransacciones[0].fecha)}
        ${JSON.stringify(user.historialTransacciones[0].cantidadDinero)}
        ${JSON.stringify(user.historialTransacciones[0].destinatario)}
        ${JSON.stringify(user.historialTransacciones[0].mensaje)}
        `
        );
        return menuDelUsuario(user)
    }

    for (let i = 0; i < user.historialTransacciones.length; i++) {
        
        alert(`
        ${JSON.stringify(user.historialTransacciones[i].transaccion)}
        ${JSON.stringify(user.historialTransacciones[i].fecha)}
        ${JSON.stringify(user.historialTransacciones[i].cantidadDinero)}
        ${JSON.stringify(user.historialTransacciones[i].destinatario)}
        ${JSON.stringify(user.historialTransacciones[i].mensaje)}
        `
        );
    }
    menuDelUsuario(user);
}

function ingresarDinero(user) {
    const accion = 'Ingresar'

    const tipoDeCuenta = (parseInt(prompt(`
    Indique a cual cuenta desea ingresar dinero

    1. Caja de Ahorro en Pesos      3. Caja de Ahorros en Dolares
    2. Cuenta Corriente en Pesos    4. Cuenta Corriente en Dolares
    5. Volver atras
    `
    )) - 1)
    obtenerRequsitosTransaccion(user, tipoDeCuenta);
    
    const opcion = parseInt(prompt(`
    ¿Desea ingresar dinero en ${JSON.stringify(user.cuentas[tipoDeCuenta].tipoDeCuenta)}?

    1. SI
    2. NO`
    ));
    const saldo = validarRequisitosTransaccion(user, tipoDeCuenta, menuIngresoEgreso, opcion);

    user.manejarDineroFisico(tipoDeCuenta, saldo, accion);
    menuDelUsuario(user);
}

function retirarDinero(user) {
    const accion = 'Retirar'

    const tipoDeCuenta = (parseInt(prompt(`
    Indique de cual cuenta desea retirar dinero

    1. Caja de Ahorro en Pesos      3. Caja de Ahorros en Dolares
    2. Cuenta Corriente en Pesos    4. Cuenta Corriente en Dolares
    5. Volver atras
    `
    )) - 1)
    obtenerRequsitosTransaccion(user, tipoDeCuenta);
    
    const opcion = parseInt(prompt(`
    ¿Desea retirar dinero de ${JSON.stringify(user.cuentas[tipoDeCuenta].tipoDeCuenta)}?

    1. SI
    2. NO`
    ));
    const saldo = validarRequisitosTransaccion(user, tipoDeCuenta, menuIngresoEgreso, opcion);

    user.manejarDineroFisico(tipoDeCuenta, saldo, accion);
    menuDelUsuario(user);
}

function transferirACuentaPropia(user) {

    let tipoDeCuenta = (parseInt(prompt(`
    Seleccione desde que cuenta desea transferir dinero

    1. Caja de Ahorro en Pesos      3. Caja de Ahorros en Dolares
    2. Cuenta Corriente en Pesos    4. Cuenta Corriente en Dolares
    5. Volver atras
    `
    )) - 1); //Tipo de cuenta desde la que va a transferir
    tipoDeCuenta = obtenerRequsitosTransaccion(user, tipoDeCuenta);
    
    const cuentaDestino = (tipoDeCuenta == 0 || tipoDeCuenta == 2) ? tipoDeCuenta + 1 : tipoDeCuenta - 1; //Cuenta a la que va a ser transferida

    if(!user.cuentas[cuentaDestino]){
        const isNotCuentaCorriente = (cuentaDestino === 1) ? 'Cuenta Corriente en Pesos' : 'Cuenta Corriente en Dolares';
        const isNotCajaDeAhorro = (cuentaDestino === 2) ? 'Caja de Ahorro en Dolares': 'Caja de Ahorro en Pesos';

        if(cuentaDestino === 1 || cuentaDestino === 3){
            alert(`
            No posee una ${isNotCuentaCorriente} como para poder realizarle una transaccion 
            Puede abrir una desde la opcion Abrir nueva cuenta
            `);
        }else{
            alert(`
            No posee una ${isNotCajaDeAhorro} como para poder realizarle una     transaccion 
            Puede abrir una desde la opcion Abrir nueva cuenta
            `);
        }

        menuDelUsuario(user);
    }

    const opcion = parseInt(prompt(`
    ¿Desea transferir desde de su ${user.cuentas[tipoDeCuenta].tipoDeCuenta} a su ${user.cuentas[cuentaDestino].tipoDeCuenta}?

    1. SI
    2. NO`
    ));
    const saldo = validarRequisitosTransaccion(user, tipoDeCuenta, menuTransferencia, opcion);

    user.transferirDinero(tipoDeCuenta, cuentaDestino, saldo, user.email);
    menuDelUsuario(user);
}

function transferirAOtroUsuario(user) {

    const emailUsuarioIntroducido = prompt(`
    Ingrese el mail de la persona a la que quiere realizarse la transaccion`);
    const [emailUsuarioSolicitado, id] = verificarCuentaSolicitada(emailUsuarioIntroducido);

    if(!emailUsuarioSolicitado){
        alert('El email ingresado no existe');
        menuTransferencia(user)
    }

    const userDestino = users[id];

    let tipoDeCuenta = (parseInt(prompt(`
    Seleccione desde que cuenta desea transferir dinero

    1. Caja de Ahorro en Pesos      3. Caja de Ahorros en Dolares
    2. Cuenta Corriente en Pesos    4. Cuenta Corriente en Dolares
    5. Volver atras
    `
    )) - 1); //Tipo de cuenta desde la que va a transferir
    tipoDeCuenta = obtenerRequsitosTransaccion(user, tipoDeCuenta);

    let escalaTipoDeCuenta = (tipoDeCuenta == 0 || tipoDeCuenta == 1) ? 0 : 2;
    let cuentaDestino;

    //Verificamos si al usuario que le vamos a transferir tiene ambos tipos de cuenta
    if(typeof(userDestino.cuentas[escalaTipoDeCuenta]) !== 'undefined' && typeof(userDestino.cuentas[escalaTipoDeCuenta+1]) !== 'undefined'){
        cuentaDestino = parseInt(prompt(`
        1. ${userDestino.cuentas[escalaTipoDeCuenta].tipoDeCuenta}   2. ${userDestino.cuentas[escalaTipoDeCuenta+1].tipoDeCuenta}
        Indique a cual tipo de cuenta quiere realizarle la transaccion`
        ));
    }

    //Verificamos si al usuario que le vamos a transferir tiene una cuenta corriente en pesos
    if(typeof(userDestino.cuentas[escalaTipoDeCuenta]) === 'undefined'){
        cuentaDestino = parseInt(prompt(`
        1. ${userDestino.cuentas[escalaTipoDeCuenta+1].tipoDeCuenta}
        Indique a cual tipo de cuenta quiere realizarle la transaccion`
        ));
    }

    //Verificamos si al usuario que le vamos a transferir tiene una cuenta caja de ahorro en pesos
    console.log(typeof(userDestino.cuentas[escalaTipoDeCuenta+1]));
    if(typeof(userDestino.cuentas[escalaTipoDeCuenta+1]) === 'undefined'){
        cuentaDestino = parseInt(prompt(`
        1. ${userDestino.cuentas[escalaTipoDeCuenta].tipoDeCuenta}
        Indique a cual tipo de cuenta quiere realizarle la transaccion`
        ));
    }

    if(cuentaDestino !== 1 && cuentaDestino !== 2){
        alert('Ingrese un valor correcto');
        transferirAOtroUsuario(user);
    }

    if(!userDestino.cuentas[cuentaDestino-1]){
        menuTransferencia(user);
    }


    escalaTipoDeCuenta--; //cambiamos el valor de la variable para darle solamente un uso logico en las siguientes lineas.
    cuentaDestino = escalaTipoDeCuenta + cuentaDestino; 

    const opcion = parseInt(prompt(`
    ¿Desea transferir desde su ${user.cuentas[tipoDeCuenta].tipoDeCuenta} a ${userDestino.cuentas[cuentaDestino].tipoDeCuenta}?

    1. SI
    2. NO`
    ));
    const saldo = validarRequisitosTransaccion(user, tipoDeCuenta, menuTransferencia, opcion);
    
    user.transferirDinero(tipoDeCuenta, cuentaDestino, saldo, userDestino.email, id)
    menuDelUsuario(user);
}

function abrirNuevaCuenta(user) {

    const nuevoTipoDeCuenta = (parseInt(prompt(
    `
    1. Caja de ahorro en pesos
    2. Cuenta corriente en pesos
    3. Caja de ahorro en dolares
    4. Cuenta corriente en dolares
    5. Volver atras

    Seleccione el tipo de cuenta que desea abrir`
    ))) - 1;

    if(nuevoTipoDeCuenta === 4) menuDelUsuario(user);

    if(nuevoTipoDeCuenta === 0){
        alert('La caja de ahorro en pesos fue creada automaticamente al crear su cuenta, ademas recuerde de que se le abonaron 1000 pesos como agradecimiento!');
        abrirNuevaCuenta(user);
    }

    if(user.cuentas[nuevoTipoDeCuenta] != undefined){
        alert('Ya posee una cuenta abierta de este tipo');
        menuDelUsuario(user);
    }

    if(nuevoTipoDeCuenta < 1 || nuevoTipoDeCuenta > 3){
        alert('Debe ingresar un valor correcto');
        abrirNuevaCuenta(user);
    }

    const depositarNuevaCuenta = parseInt(prompt(`
    ¿Desea depositar dinero en la cuenta?

    1 - SI
    2 - NO`
    ));

    if(depositarNuevaCuenta !== 1 && depositarNuevaCuenta !== 2){
        alert('Debe ingresar un valor correcto');
        abrirNuevaCuenta(user);
    } 
    
    if(depositarNuevaCuenta === 2){
        user.crearCuenta(nuevoTipoDeCuenta, 0);
        alert('Se realizo la operacion con exito')
        menuDelUsuario(user);
    }

    const saldoNuevaCuenta = parseInt(prompt(`Ingrese la cantidad de dinero que desee depositar en su nueva cuenta: `));

    user.crearCuenta(nuevoTipoDeCuenta, saldoNuevaCuenta);
    alert('La cuenta fue abierta con exito!');
    menuDelUsuario(user);
}

function menuDivisas(user) {
    const opcion = parseInt(prompt(`
    1. Comprar Dolares 
    2. Vender Dolares
    3. Volver atras

    Indique la operacion que desea realizar`
    ));

    if(opcion < 1 && opcion > 3){
        alert('Ingrese un valor correcto');
        menuDelUsuario(user)
    }
    if(opcion === 3) menuDelUsuario(user); 

    operacionDivisas(user, opcion);
}

function operacionDivisas(user, opcion){
    let compra = 500;
    let venta = 490;

    if(opcion == 1){

        const dolares = parseInt(prompt(`
        Precio de compra: ${compra}
        Monto en su caja de ahorro en pesos: ${user.cuentas[0].saldo}

        Ingrese la cantidad de dolares que desea comprar
        (Actualmente le alcanza para comprar ${(user.cuentas[0].saldo/compra)} USD)`
        ));

        const pesosConvertidos = dolares*compra;
        if(user.cuentas[0].saldo - pesosConvertidos < 0){
            alert('No tiene el saldo suficiente para comprar esta cantidad de dolares');
            menuDivisas(user);
        }
        user.comprarDivisas(pesosConvertidos, dolares);
        menuDelUsuario(user);
    }

    if(opcion == 2){
        
        const dolares = parseInt(prompt(`
        Precio de compra: ${venta}
        Monto en su caja de ahorro en dolares: ${user.cuentas[2].saldo}

        Ingrese la cantidad de dolares que desea vender
        (Sus ${user.cuentas[2].saldo} USD equivalen a ${(user.cuentas[2].saldo*venta)} ARS )`
        ));

        if(user.cuentas[2].saldo - dolares < 0){
            alert('No tiene el saldo suficiente para vender esta cantidad de dolares');
            menuDivisas(user);
        }

        const pesosConvertidos = dolares*venta;
        user.venderDivisas(pesosConvertidos, dolares);
        menuDelUsuario(user);
    }

}

function verificarCuentaSolicitada(emailIntroducido) {

    const usuarioSolicitado = users.filter(e => (e.email == emailIntroducido) ? e.email : false); //comprobamos que exista el usuario
    const datosUsuarioSolicitado = (usuarioSolicitado.length == 1) ? [usuarioSolicitado[0].id, usuarioSolicitado[0].email] : false; //obtenemos los valores que queremos, si
                                                                                                                                    //no existe entonces devolvemos false

    if(!datosUsuarioSolicitado) return [datosUsuarioSolicitado, 0]

    let id = 0;
    for(let i=0; i<users.length; i++){
        if(datosUsuarioSolicitado[0] == users[i].id){
            id = i;
            break;
        }
    }

    return [datosUsuarioSolicitado[0], id];
}

function obtenerRequsitosTransaccion(user, tipoDeCuenta) {

    if(tipoDeCuenta === 4) menuTransferencia(user);

    if(tipoDeCuenta < 0 || tipoDeCuenta > 3){
        alert('Elija una opcion correcta');
        transferirACuentaPropia(user);
    }

    const cuentaSeleccionada = user.cuentas[tipoDeCuenta]; //Tipo de cuenta a la que se va a transferir

    if(!cuentaSeleccionada){
        alert('No tienes una cuenta de este tipo \nPara poder abrir una deberas hacerlo desde la opcion de Abrir Nueva Cuenta');
        menuDelUsuario(user);
    }

    if(cuentaSeleccionada.tipoDeCuenta == 'Cuenta Corriente en Pesos' || cuentaSeleccionada.tipoDeCuenta === 'Cuenta Corriente en Dolares'){
        if(cuentaSeleccionada.saldo < -1000){
            alert('No hay dinero en la cuenta como para realizarse una transaccion');
            menuDelUsuario(user);
        }
    }else{
        if(cuentaSeleccionada.saldo < 0){
            alert('No hay dinero en la cuenta como para realizarse una transaccion');
            menuDelUsuario(user);
        }
    }
    return tipoDeCuenta;
}

function validarRequisitosTransaccion(user, tipoDeCuenta, callback, opcion) {

    if(opcion !== 1 && opcion !== 2) menuDelUsuario(user);
    if(opcion === 2) return callback(user);

    const saldo = parseInt(prompt('Ingrese la cantidad de dinero que desea transferir'));

    if(saldo < 0){
        alert('Ingrese un valor correcto');
        menuTransferencia(user);
    }

    if(callback == menuIngresoEgreso) return saldo; //verificamos si lo que desea hacer es una transaccion o solamente un ingreso o egreso de dinero

    if (user.cuentas[tipoDeCuenta].saldo < saldo) {
        alert('No fue posible realizar esta operacion, revise bien los datos ingresados');
        callback(user);
    }

    return saldo;
}

function informacionDelUsuario(user) {
    const cajaAhorroEnPesos = (user.cuentas[0]) ? user.cuentas[0].saldo + ' ARS': 'No posee una cuenta de este tipo';
    const cuentaCorrienteEnPesos = (user.cuentas[1]) ? user.cuentas[1].saldo + ' ARS': 'No posee una cuenta de este tipo';
    const cajaAhorroEnDolares = (user.cuentas[2]) ? user.cuentas[2].saldo + ' USD': 'No posee una cuenta de este tipo';
    const cuentaCorrienteEnDolares = (user.cuentas[3]) ? user.cuentas[3].saldo + ' USD': 'No posee una cuenta de este tipo';

    alert(`
    ID de la cuenta: ${user.id}
    Email de la cuenta: ${user.email}

    Informacion sobre los tipos de cuentas

    Caja de Ahorro en Pesos: ${cajaAhorroEnPesos} 
    Cuenta Corriente en Pesos: ${cuentaCorrienteEnPesos} 
    Caja de Ahorro en Dolares: ${cajaAhorroEnDolares}
    Cuenta Corriente en Dolares: ${cuentaCorrienteEnDolares}
    `);

    menuDelUsuario(user);
}


setTimeout(() => {
    menuInicial(); 
}, 1000);
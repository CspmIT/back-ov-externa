function Register(data) {
    try {
        const hmtl = `<html>
    <style>
        .btn {
            margin-top: 5px;
            margin-right: 2px;
            color: #fff !important;
            text-decoration: none;
            background: #60a3bc;
            padding: 5px;
            border-radius: 10px;
            display: inline-block;
            border: none;
        }
    
        .border_div {
            border-radius: 5px;
            border-color: grey !important;
            border: 2px solid;
            width: 200px;
            margin-right: 10px;
            text-align: center;
            display: inline-block;
        }
    
        .p {
            font-size: 20px;
        }
    
        .tamano_iconos {
            width: 10% !important;
        }
    
        .ancho_img {
            max-width: 20%;
            margin: auto;
        }
    
        .imagen_fondo {
            background-color: #fcf6423d;
            background-image: linear-gradient(to bottom, white, #fcf642);
        }
    
        @media(max-width: 550px) {
            .ancho_img {
                max-width: 50%;
                margin: auto;
            }
    
            .p {
                font-size: 15px;
            }
        }
    </style>
    
    <body class="imagen_fondo">
        <div style="text-align: center;margin-top: 20px;margin-bottom: 10px; background-color: black;">
            <a href="https://app.coopmorteros.coop">
                <img src="https://app.coopmorteros.coop/public/images/gifs/Ofi_Virtual_Blanco_2.gif" title="Oficina Virtual"
                    style="width:180px;" width="400" alt="Oficina Virtual">
            </a>
        </div>
        <h1 style="text-align: center;">Activación de Cuenta</h1>
    <p style="text-align:center;"><b>${data.name}</b>, Haz click en el siguiente link para habilitar la cuenta:</p>
    <hr>
    <a href="${data.link}" style="text-align:center;font-weight:800">Haz Click aqui</a>
    <hr>
        <div style="text-align: center;margin-bottom: 10px;margin-top: 20px;">
            Te invitamos a mantenerte conectado, siguiendo nuestras redes sociales...</p>
            <br>
            <br>
            <div style="text-align:center;"> <a title="Twitter" href="https://twitter.com/coopmorteros?lang=es"><img
                        class="tamano_iconos" src="https://app.coopmorteros.coop/public/images/redes_sociales/Twitter.png"
                        alt="Twitter"></a>
                <a title="Instagram" style="padding-top:15;" href="https://www.instagram.com/coopmorteros/?hl=es-la"><img
                        class="tamano_iconos" src="https://app.coopmorteros.coop/public/images/redes_sociales/instagram.png"
                        alt="Instagram"></a>
                <a title="Facebook" href="https://es-la.facebook.com/coopmorteros/"><img class="tamano_iconos"
                        src="https://app.coopmorteros.coop/public/images/redes_sociales/facebook.png" alt="Facebook"></a>
            </div>
            <br>
        </div>
        <div style="text-align: center;margin-top: 30px;margin-bottom: 10px;"><a href="https://app.coopmorteros.coop"
                target="_blank" style="margin-left: 10px;margin-right: 10px;">#VivíLaNuevaEraDigital</a> <a
                href="https://app.coopmorteros.coop" target="_blank"
                style="margin-left: 10px;margin-right: 10px;">#Coopmorteros</a> <a href="https://app.coopmorteros.coop"
                target="_blank" style="margin-left: 10px;margin-right: 10px;">#EstamosConVos</a></div>
        <br>
        <div style="text-align: center;">
            <p>
                Por consultas y/o reclamos comunicate a:<br>
                Email: info@coopmorteros.coop<br>
                Tel: (03562)-402000<br>
            </p>
        </div>
        <div style="text-align: center;"><a href="https://www.coopmorteros.com" target="_blank"><img
                    src="https://app.coopmorteros.coop/public/images/logos/ISOLOGO.png" target="_blank" alt="" height="80"
                    width=""></a> <a href="https://app.coopmorteros.coop/" target="_blank"> <img target="_blank"
                    src="https://app.coopmorteros.coop/public/images/logos/Ofi_Virtual_Negro.png" alt="" height="80"
                    width=""></a><br></div><br>
        <div style=" color: #AAAAAA;font-family: Verdana; font-size: 7pt;font-weight: normal;font-style: normal;"> Este
            correo electrónico y cualquier anexo o respuesta relacionada puede contener datos e información confidenciales y
            estar legalmente protegido.
            En caso de que lo haya recibido por error, por favor (i) notifique al remitente inmediatamente mediante un
            e-mail, (ii) no lea, copie, imprima o
            reenvíe este mensaje o cualquier anexo, o divulgue su(s) contenido(s) a terceros, y (iii) bórrelo inmediatamente
            de su sistema
            Los mensajes electrónicos no son seguros y, por lo tanto, no nos responsabilizaremos por cualquier consecuencia
            relacionada al uso
            de este mensaje (inclusive daños causados por cualquier virus). Gracias.</div>
    </body>
    
    </html>`
        return hmtl
    } catch (error) {
        throw new Error(error)
    }
}
function PasswordRecovery(data) {
    try {
        const hmtl = `<html>
    <style>
        .btn {
            margin-top: 5px;
            margin-right: 2px;
            color: #fff !important;
            text-decoration: none;
            background: #60a3bc;
            padding: 5px;
            border-radius: 10px;
            display: inline-block;
            border: none;
        }
    
        .border_div {
            border-radius: 5px;
            border-color: grey !important;
            border: 2px solid;
            width: 200px;
            margin-right: 10px;
            text-align: center;
            display: inline-block;
        }
    
        .p {
            font-size: 20px;
        }
    
        .tamano_iconos {
            width: 10% !important;
        }
    
        .ancho_img {
            max-width: 20%;
            margin: auto;
        }
    
        .imagen_fondo {
            background-color: #fcf6423d;
            background-image: linear-gradient(to bottom, white, #fcf642);
        }
    
        @media(max-width: 550px) {
            .ancho_img {
                max-width: 50%;
                margin: auto;
            }
    
            .p {
                font-size: 15px;
            }
        }
    </style>
    
    <body class="imagen_fondo">
        <div style="text-align: center;margin-top: 20px;margin-bottom: 10px; background-color: black;">
            <a href="https://app.coopmorteros.coop">
                <img src="https://app.coopmorteros.coop/public/images/gifs/Ofi_Virtual_Blanco_2.gif" title="Oficina Virtual"
                    style="width:180px;" width="400" alt="Oficina Virtual">
            </a>
        </div>
        <h1 style="text-align: center;">Activación de Cuenta</h1>
    <p style="text-align:center;"><b>${data.name}</b>, Haz click en el siguiente link para recuperar tu contraseña:</p>
    <hr>
    <a href="${data.link}" style="text-align:center;font-weight:800">Haz Click aqui</a>
    <hr>
        <div style="text-align: center;margin-bottom: 10px;margin-top: 20px;">
            Te invitamos a mantenerte conectado, siguiendo nuestras redes sociales...</p>
            <br>
            <br>
            <div style="text-align:center;"> <a title="Twitter" href="https://twitter.com/coopmorteros?lang=es"><img
                        class="tamano_iconos" src="https://app.coopmorteros.coop/public/images/redes_sociales/Twitter.png"
                        alt="Twitter"></a>
                <a title="Instagram" style="padding-top:15;" href="https://www.instagram.com/coopmorteros/?hl=es-la"><img
                        class="tamano_iconos" src="https://app.coopmorteros.coop/public/images/redes_sociales/instagram.png"
                        alt="Instagram"></a>
                <a title="Facebook" href="https://es-la.facebook.com/coopmorteros/"><img class="tamano_iconos"
                        src="https://app.coopmorteros.coop/public/images/redes_sociales/facebook.png" alt="Facebook"></a>
            </div>
            <br>
        </div>
        <div style="text-align: center;margin-top: 30px;margin-bottom: 10px;"><a href="https://app.coopmorteros.coop"
                target="_blank" style="margin-left: 10px;margin-right: 10px;">#VivíLaNuevaEraDigital</a> <a
                href="https://app.coopmorteros.coop" target="_blank"
                style="margin-left: 10px;margin-right: 10px;">#Coopmorteros</a> <a href="https://app.coopmorteros.coop"
                target="_blank" style="margin-left: 10px;margin-right: 10px;">#EstamosConVos</a></div>
        <br>
        <div style="text-align: center;">
            <p>
                Por consultas y/o reclamos comunicate a:<br>
                Email: info@coopmorteros.coop<br>
                Tel: (03562)-402000<br>
            </p>
        </div>
        <div style="text-align: center;"><a href="https://www.coopmorteros.com" target="_blank"><img
                    src="https://app.coopmorteros.coop/public/images/logos/ISOLOGO.png" target="_blank" alt="" height="80"
                    width=""></a> <a href="https://app.coopmorteros.coop/" target="_blank"> <img target="_blank"
                    src="https://app.coopmorteros.coop/public/images/logos/Ofi_Virtual_Negro.png" alt="" height="80"
                    width=""></a><br></div><br>
        <div style=" color: #AAAAAA;font-family: Verdana; font-size: 7pt;font-weight: normal;font-style: normal;"> Este
            correo electrónico y cualquier anexo o respuesta relacionada puede contener datos e información confidenciales y
            estar legalmente protegido.
            En caso de que lo haya recibido por error, por favor (i) notifique al remitente inmediatamente mediante un
            e-mail, (ii) no lea, copie, imprima o
            reenvíe este mensaje o cualquier anexo, o divulgue su(s) contenido(s) a terceros, y (iii) bórrelo inmediatamente
            de su sistema
            Los mensajes electrónicos no son seguros y, por lo tanto, no nos responsabilizaremos por cualquier consecuencia
            relacionada al uso
            de este mensaje (inclusive daños causados por cualquier virus). Gracias.</div>
    </body>
    
    </html>`
        return hmtl
    } catch (error) {
        throw new Error(error)
    }
}
module.exports = {
    Register,
    PasswordRecovery
}


let headers = {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\""
};

const mysql = require('mysql2/promise');
// Create the connection to database
 
const { input, confirm } = require('@inquirer/prompts');

let urls = [];
let check_data = false;

async function main() {
    const min = await input({ message: 'Enter range min' });
    const max = await input({ message: 'Enter range max' });
    check_data = await confirm({ message: '¿Deseas solo guardar actas sin repetir cédulas?' });
    
    console.log(check_data ? "Se hará mediante chequeo":"Se guarda todo");

    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'resultados',
    });
    
    try {
        const [results] = await connection.query(
          'SELECT * FROM link_imagenes WHERE cedula BETWEEN ? AND ?',
          [min,max]
        );
        
        if(results.length) 
            urls = check_data ? results:[results[results.length-1]];
    } catch (err) {
        return console.log(err);
    }
    console.log("DB Preparada",urls);
        
    let cedula_init = urls.length ? urls[urls.length-1].cedula+1:parseInt(min);
    let cedula_final = parseInt(max);
    
    let reintentos = 0;
    for(let i = cedula_init; i < cedula_final;i=!check_data ? i+1:i) {
        reintentos++;
        console.log("Consultando cédula: V"+i);//https://37latuqm766patrerdf5rvdhqe0wgrug.lambda-url.us-east-1.on.aws/
        //https://tvtcrhau2vo336qa5r66p3bygy0hazyk.lambda-url.us-east-1.on.aws/
        await get("https://37latuqm766patrerdf5rvdhqe0wgrug.lambda-url.us-east-1.on.aws/", "cedula=V"+i+"&recaptcha=03AFcWeA4Pgw7tRinSg9TspTl2oGummRSXgtmSv-NZFgdiKyJ9wpE8Rqz1vrrIEshc80XFkUQWmsVcCXWTSvm9K9RRkP1OcD0CYxvG4Jz_xoibtO-GDRuowoZf0QUhPy1rjot3-CEI-4u1gz8bSiND-7Xg2Kxk2BZuQQZgUw3ZClcYreJaQJLJgpIxr_vweHgHXSkQt8L-WPKiUbe_DfRWZyqU3Pt7T_YlBPmWx5PS5je96FfNKcPiZq-0_jnLmwJh-4TNnkgRcDDcYpo4-TEDXvHp_h8XINJ8-X6LXoj5kOLSoQYeLG2mkkDrjZhzH4CJpix0e1vy4KWBe6mx_RnGG4X9o16pByPUdcR6YmkerMXn6kmucDMDaNUKwEuyE5Y0ga13PNAzxga-OQpQ-7oV85iN2RqhCnkD1_GOpLG3DLAaBcTHUPLpIDKxmzD8Bs2bR6AVcZfulvD52gC3RqdEJW8zd6KUZy-P4fOPKkfNpLuKQvznmLnnWAJdiH9OAzl74SmPEgYDRvmRNGOR2A-S6xItkb_Nqdie4gcNjgzhdz4su3vktUWBI50KE_uprJSjM4-kReiycHe7U4KILdwwi01YY8oxb1RTOyOsyCDRqsUJEiNp7RNTEQCJngWjTxmU1R1lhocHpaD7gVUJoa1WkKCSyOKVatOS99ZxrgadfCaoK0xdjge537Z35KLvKBEePPNcsiQ6uuPBRuFOSj8XRDWE3iih-S5CY-TFYm0D-z0skcDMLJx4zxCMGG4yggXsJlExWmxfh1E8mQ43nyZisU_w_xYLiMA5iTIflmOqpOa7xtLmYzkjTYPdGkbvg1O0k0o-Bsc1DlG0PNMKc1friqoa1MKZhW1cflL_SkNnFLTWpSHrHoQgp2AzGck7dg6rsZ-qS1V7Afgv", headers)
        .then(async (data) => {
            console.log(data.data);
            if(!check_data || check(data.data)) {
                try {
                    const [results2] = await connection.query(
                      'INSERT INTO link_imagenes (cedula, url) VALUES (?,?)',
                      [i, data.data.url]
                    );
                    if(check_data) {
                        urls.push({
                            id: urls[urls.length-1].id+1,
                            cedula: i,
                            url: data.data.url
                        });
                        i++;
                    }
                    console.log("Info Guardada "+urls.length);
                } catch (err) {
                    console.log(err);
                }
            }
        })
        .catch((error) => {
            console.log(error.status);
            if(error.status == 502 || reintentos >= 2){
                if(check_data)
                    i++;
                reintentos=0;
            }
        });
    }
    //connection.end();
    
}

main();

function check(r){for(let e=0;e<urls.length;e++)if(urls[e].url==r)return!1;return!0}
function get(e,r,t=defaultHeaders,o=15e3){return new Promise(function(n,s){let a=0,i={},c=!1,d=setTimeout(function(){c=!0,console.log("Tiempo agotado"),s("Tiempo de espera agotado")},o);fetch(e+(r?"?"+r:""),{method:"GET",headers:t,timeout:o,referrer:"https://resultadospresidencialesvenezuela2024.com/",referrerPolicy:"strict-origin-when-cross-origin",body:null,method:"GET",mode:"cors",credentials:"omit"}).then(e=>{if(!c){for(let r of(clearTimeout(d),a=e.status,e.headers.entries()))i[r[0]]=r[1];return e.text()}}).then(e=>{try{e=JSON.parse(e)}catch{}return e}).then(e=>{200===a?n({status:a,data:e,headers:i}):s({status:a,error:e,headers:i})}).catch(e=>{c||(clearTimeout(d),s({error:e.stack}))})})}
// 마리아 db설치 및 불러오기
const mariadb = require('mariadb');
// 로그인 정보 모듈화하여 들고오기
const dbconfig = require('./loginData/dbconfig.js');

async function main(){
    let conn = null;
    const sql = `select distinct dong from zipcode2013 where sido=:sido and gugun =:gugun order by dong`;
    const params={'sido': '서울','gugun':'강남구'};
    try
    {
        conn = await mariadb.createConnection(dbconfig);
        let result =  await conn.execute({namedPlaceholders: true, sql: sql},params);
        for(let row of result){
            console.log(row.dong);
        }

    }catch (e){
        console.error(e);
    }finally {
       if(conn){
           try{await conn.close();}
           catch (e){console.error(e);}
       }
    }
}

main();
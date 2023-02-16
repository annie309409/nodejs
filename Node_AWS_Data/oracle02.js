// zipcode2013에서 서울시 강남남구에 있는 모든 동을 조회해서 출력해보세요
const oracledb = require('oracledb');
//db연결정보 파일
const dbconfig = require('./loginData/login.js');

async function main(){
    let sql = `create table sungjuk(name2 VARCHAR2(100),kor NUMBER(3), eng NUMBER(3), math NUMBER(3))`;
    let sql2 = `insert into sungjuk values (:1,:2,:3,:4)`;
    let sql3 = `update sungjuk set kor=:1,eng=:2,math=:3 where name=:4`;
    let sql4 = `delete from sungjuk where name=:4`;
    let sql5 = `select * from sungjuk`;
    let params=[];
    let options ={
        resultSet: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
    };
    let conn = null;

    try{
        //oracle instance clinet 초기화
        oracledb.initOracleClient(
            //oracle instance client 설치위치 설정
            {libDir:'C:/Java/instantclient_19_17'});
        // 오라클 접속정보로 오라클 연결객체 생성
        // 3.35.8.243
        //1521은 oracle 전용 포트임
        conn = await oracledb.getConnection(dbconfig);


        console.log('오라클 데이터 접속 성공!');
        // 테이블 생성
        // let rs = await conn.execute(sql);
        // //작업이 끝나면 결과집합 객체를 닫음
        // await rs.close();

        // params=['둘리',90,90,90];
        // let result =  await conn.execute(sql2,params);
        // //커밋기능이 없으므로 사용해야함
        // await conn.commit();
        // console.log(result);

        // params=[40,80,90,'둘리'];
        // let result =  await conn.execute(sql3,params);
        // //커밋기능이 없으므로 사용해야함
        // await conn.commit();
        // console.log(result);

        // params=['고길동'];
        // let result =  await conn.execute(sql4,params);
        //  await conn.commit();
        //  console.log(result);
        let result =  await conn.execute(sql5,params,options);

        //실행결과를 결과집합 객체로 변환
        let rs = result.resultSet;

        //결과집합 객체의 각 요소를 순회하면서 내용 출력
        let row = null;
        while ((row = await rs.getRow())){
            console.log(row);
        }

        //작업이 끝나면 결과집합 객체를 닫음
        // await rs.close();
    }catch (e){
        // 에러발생시 에러 출력
        console.error(e);
    }finally {
        //작업이 끝난후 오라클접속을 끊어줌
        if(conn){
            try{
                await conn.close();
                console.log('오라클 접속 해제성공');
            } catch (e){
                //에러발생시 에러 출력
                console.error(e);
            }
        }
    }

}

main();
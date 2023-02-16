//오라클 라이브러러 설치
const oracledb = require('oracledb');

//오라클 접속 정보 들고오기
const fs = require('fs');
const bringOracle = JSON.parse(fs.readFileSync('./login.json','utf8'));
// 접속정보 객체저장
const login = bringOracle.oracle;

async function main(){
    //sql문
    const sql = 'select distinct SIDO from zipcode2013';
    //insert, update, delete혹은 where절로 조건을 걸때 주로 사용한다.
    let params = {};

    //oracle db를 위한 옵션 정의
    let options ={
        //row result를 사용하기위해 필요함
        resultSet: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
    };

    // 디비연결 객체
    let conn = null;

    try{
        //oracle instance clinet 초기화
        oracledb.initOracleClient(
            //oracle instance client 설치위치 설정
            {libDir:'C:/Java/instantclient_19_17'});
        // 오라클 접속정보로 오라클 연결객체 생성
        // 3.35.8.243
        //1521은 oracle 전용 포트임
        conn = await oracledb.getConnection({});
        console.log('오라클 데이터 접속 성공!');

        //sql문을 실행하고 결과를 받아옴
        // 옵션이 추가되어야 resultSet을 받아옴
        // excute는 select용임
        let result =  await conn.execute(sql,params,options);

        //실행결과를 결과집합 객체로 변환
        let rs = result.resultSet;

        //결과집합 객체의 각 요소를 순회하면서 내용 출력
        let row = null;
        while ((row = await rs.getRow())){
            console.log(row.SIDO);
        }

        //작업이 끝나면 결과집합 객체를 닫음
        await rs.close();
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
// 미세먼저 공공데이터를 이용해서 특정 지역의 미세먼저 정보출력
// https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty
// ?serviceKey=9CGvwEOuD7B%2Flmq152FgujYXfExIJvXhfq4WpVdI1OUEEnpVV24skweMDzXeZ4blzuZg3wYY9bmT4PPwJqWCAw%3D%3D&returnType=json&numOfRows=100&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.0


// 사용할 패키지 가져오기 : require(패키지명)
// ajax 라이브러리
const axios =  require('axios');
// dom라이브러리 alt+enter는 최신버전만 다운받음 , 특정버전을 원할때 npm 명령어 필요
const cheerio =  require('cheerio');

//비동기 입출력 지원 함수
async function main(){
    const url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty';
    const params ={
        'serviceKey':'9CGvwEOuD7B/lmq152FgujYXfExIJvXhfq4WpVdI1OUEEnpVV24skweMDzXeZ4blzuZg3wYY9bmT4PPwJqWCAw==',
        'returnType':'json',
        'sidoName':'경기',
        'numOfRows':500,
        'ver':1.3
    }
    const headers= {'UserAgent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78'};
    // let [titles,writers,prices,books]=[[],[],[],[]];

    // axios로 접속해서 대기 오염정보 받아오기
    const json = await axios.get(url,{
        params : params, headers: headers
    });

    //받아 온 데이터(잠시)확인
    // console.log(json.data);

    //json으로 불러오기
    let items = json.data['response']['body']['items'];
    console.log(items);
    //미세먼지 경보출력
    items.forEach((e,idx)=>{
        // console.log(e);
        console.log((idx+1)+e.sidoName + e.stationName , e.pm10Value,e.pm25Value, pmGrade(e.pm10Grade) , pmGrade(e.pm25Grade)  , e.dataTime);
    });
    // // 등급별 이모지로 표시해볼것
    // // 1등급 : 😍
    // // 2등급 : 😯
    // // 3등급 : 😑
    // // 4등급 : 🤯
}

function pmGrade(e){
    // let result = ['😍','😯','😑','🤯'];
    // if (Number.isInteger(e)){
    //     return result[e-1]
    // }else{
    //     return '값 없음';
    // }
    //

    let emojis = '😍 😯 😑 🤯'.split(' ');
    return (Number.isInteger(parseInt(e)))?emojis[parseInt(e)-1] : '-';

}
// 호출부분
main();


// 코로나 공공데이터를 이용해서 특정 지역의 확진자 현황출력
//https://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api?serviceKey=9CGvwEOuD7B%2Flmq152FgujYXfExIJvXhfq4WpVdI1OUEEnpVV24skweMDzXeZ4blzuZg3wYY9bmT4PPwJqWCAw%3D%3D&pageNo=1&numOfRows=500&apiType=xml&std_day=2023-02-13&gubun=%EC%84%9C%EC%9A%B8


// 사용할 패키지 가져오기 : require(패키지명)
// ajax 라이브러리
const axios =  require('axios');
const {XMLParser}= require('fast-xml-parser');

//비동기 입출력 지원 함수
async function main(){
    // url에서 https가 있으면 http로 바꾸기
    const url = 'http://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api';
    const params ={
        'serviceKey':'9CGvwEOuD7B/lmq152FgujYXfExIJvXhfq4WpVdI1OUEEnpVV24skweMDzXeZ4blzuZg3wYY9bmT4PPwJqWCAw==',
        // 대문자 json으로 하면 json확인가능
        'apiType':'xml',
        'std_day':'2023-02-13',
        'gubun':''
    }
    const headers= {'UserAgent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78'};

    // axios로 접속해서 코로나 확진자수 정보 받아오기
    const xml = await axios.get(url,{
        params : params, headers: headers
    });

    const parser = new XMLParser();
    let json = parser.parse(xml.data);

    let items = json['response']['body']['items']['item'];
    // console.log(items);

    items.forEach(e=>{
        console.log(`지역${e.gubun},전일 확진자 수:${e.incDec},총 확진자수 :${e.defCnt}, 누적 사망자 수 :${e.deathCnt}, 측정일 :${e.stdDay}`);
    });
}

// 호출부분
main();


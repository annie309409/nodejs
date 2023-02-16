// hanbit.co.kr사이트에서 새로나온 책에대한 정보를 긁어오기
// https://www.hanbit.co.kr/store/store_submain.html

// 사용할 패키지 가져오기 : require(패키지명)
// ajax 라이브러리
const axios =  require('axios');
// dom라이브러리 alt+enter는 최신버전만 다운받음 , 특정버전을 원할때 npm 명령어 필요
const cheerio =  require('cheerio');


//비동기 입출력 지원 함수
async function main(){
    const url = 'https://www.hanbit.co.kr/store/store_submain.html';
    // 비동기 I/O지원
    const html = await axios.get(url);
    // 불러온 html을 parsing해서 dom생성
    const dom = cheerio.load(html.data);

    // css선택자로 도서제목을 담고있는 요소 지정
    let elements = dom('.book_tit');
    let writers = dom('.book_writer');
    let prices = dom('.price');

    //찾은 요소를 순회하면서 요소의 텍스트 출력
    elements.each((idx,title)=>{
        console.log(`제목 : ${dom(title).text()} |  저자:${dom(writers[idx]).text()} | 가격: ${dom(prices[idx]).text()}`);
    });
}

// 호출부분
main();


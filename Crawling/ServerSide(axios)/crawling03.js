// hanbit.co.kr사이트에서 새로나온 책에대한 정보를 긁어오기
// https://www.hanbit.co.kr/store/store_submain.html

// 사용할 패키지 가져오기 : require(패키지명)
// ajax 라이브러리
const axios =  require('axios');
// dom라이브러리 alt+enter는 최신버전만 다운받음 , 특정버전을 원할때 npm 명령어 필요
const cheerio =  require('cheerio');

//파일저장을 위한 라이브러리(내장 라이브러리이므로 설치가 따로 필요없음)
const fs = require('fs'); //파일 시스템 관련 라이브러리
const path = require('path'); //파일경로 관련 라이브러리


//비동기 입출력 지원 함수
async function main(){
    const url = 'https://www.hanbit.co.kr/store/books/new_book_list.html';
    // 수집한 정보를 저장하기위한 배열선언
    let [titles,writers,prices,books]=[[],[],[],[]];


    // axios로 접속해서 html불러오기
    const html = await axios.get(url,{
        // 서버 요청시 user-agent  헤더 사용 : nodejs가 브라우져와같이 긁어갈 수 있게 함.
        headers:{'UserAgent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.78'}
    });
    // 불러온 html을 parsing해서 dom생성
    const dom = cheerio.load(html.data);

    // css선택자로 도서제목을 담고있는 요소 지정
    let elements = dom('.book_tit');
    let wtdom = dom('.book_writer');
    let prdom = dom('.price');

    //찾은 요소를 순회하면서 요소의 텍스트 출력
    elements.each((idx,title)=>{
        titles.push(dom(title).text());
        writers.push(dom(wtdom[idx]).text().replaceAll(' ',''));
        prices.push(parseInt(dom(prdom[idx]).text().replaceAll(/[,|원]/g,'')));
    });

    //수집한 정보들을 json 객체로 생성
    for(let i =0; i < titles.length;i++){
        let book ={};
        book.title = titles[i];
        book.writer = writers[i];
        book.price = prices[i];
        books.push(book);
    }

    //저장된 요소확인
    console.log(books);

    // 생성된 도서 객체를 json문자열로 변환하고
    const bookJSON = JSON.stringify(books);

    // 파일에 저장
    // data폴더가 존재하는지 확인하고 없으면 생성
    !fs.existsSync('data') && fs.mkdirSync('data');

    //저장위치와 파일명 지정후 파일에 저장
    const fpath =  path.join(__dirname,'data','books.json');

    //파일을 넣어줌
    fs.writeFileSync(fpath,bookJSON);
}

// 호출부분
main();


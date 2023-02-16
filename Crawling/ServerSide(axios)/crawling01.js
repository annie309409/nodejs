// hanbit.co.kr사이트에서 새로나온 책에대한 정보를 긁어오기
// https://www.hanbit.co.kr/store/store_submain.html

// 사용할 패키지 가져오기 : require(패키지명)
const axios =  require('axios');


const main = ()=>{
    // 접속할 url지정
    const url = 'https://www.hanbit.co.kr/store/store_submain.html';
    // axious로 접속해서 html을 불러옴
    axios.get(url)
        .then((html)=>{
            // 불러온 html을 콘솔에 출력
            console.log(html.data);
        })
        .catch((error)=>{
            console.log(error);
        });
};

// 호출부분
main();


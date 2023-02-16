// https://movie.daum.net/main 사이트에서 '상영중'인 영화정보 긁어오기
// 영화제목 , 순위, 예약율, 평점
// https://movie.daum.net/main

// dom라이브러리 alt+enter는 최신버전만 다운받음 , 특정버전을 원할때 npm 명령어 필요
const cheerio =  require('cheerio');
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const URL = require('url');
//비동기 입출력 지원 함수
async function main() {
    //접속 url
    const url = 'https://movie.daum.net/main';
    // 크롬 자동화 브라우저 객체생성
    const chrome = await new Builder().forBrowser(Browser.CHROME).setChromeOptions().build();

    try{
        //지정한 url로 접속
        await chrome.get(url);

        // 특정 요소가 화면에 위치할때까지 최대 5초간 기다려줌
        await chrome.wait(until.elementLocated(By.css('.tit_item')),5000);

        //접속한 사이트 html소스를 가져옴
        const  html = await chrome.getPageSource();
        // console.log(html);

        //5초 정도 잠시 대기
        // await chrome.sleep(5000);

        //cheerio : 페이지 소스를 dom객체로 변환
        const dom = cheerio.load(html);
        //영화 제목 추출
        // #mainContent > section > div.slide_ranking
        let movies = dom('.feature_home strong.tit_item');
        let scores = dom('.feature_home span.txt_num:nth-of-type(1)');
        let rates = dom('.feature_home span.txt_num:nth-of-type(3)');

        //추출된 영화제목 출력
        movies.each((idx,title)=>{
            console.log(`${idx+1}. 제목: ${dom(title).text().trim()} , 평점: ${dom(scores[idx]).text().trim()}, 예매율:${dom(rates[idx]).text().trim()}`);
        });

    } catch (ex){
        console.log(ex);
    } finally {
        await  chrome.quit();
    }

}

main();


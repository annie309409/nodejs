// https://movie.daum.net/main 사이트에서 '상영중'인 영화정보 긁어오기
// 영화제목 , 순위, 예약율, 평점
// https://movie.daum.net/main

const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
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
        await chrome.wait(until.elementLocated(By.css('.feature_home strong.tit_item')),5000);

        //영화 제목 추출
        // element :단수의 추출 elements : 복수의 추출
        let movies = await chrome.findElements(By.css('.feature_home strong.tit_item'));
        let scores = await chrome.findElements(By.css('.feature_home span.txt_num:nth-of-type(1)'));
        let rates = await chrome.findElements(By.css('.feature_home span.txt_num:nth-of-type(3)'));

        let [mv,scr,rts]=[[],[],[]];


        //forEach함수는 async함수를 기다려주지 않는다... ㄷㄷ
        for(let i in movies){
            // gettext는 눈에 보이는데로만 출력이 된다.
            // console.log(await movie.getText());
            mv.push((await movies[i].getAttribute('textContent')).trim());
            scr.push((await scores[i].getAttribute('textContent')).trim());
            rts.push((await rates[i].getAttribute('textContent')).trim());
        }

        mv.forEach((title,i)=>{
            console.log(`${i+1}. 제목: ${title} , 평점: ${scr[i]}, 예매율:${rts[i]}`);
        })

    } catch (ex){
        console.log(ex);
    } finally {
        await  chrome.quit();
    }

}

main();


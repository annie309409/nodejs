// 셀레늄을 이용한 네이버 받은 메일 개수 조회 후 메일 출력
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');

//copy and paste
const ncp= require('copy-paste');
async function main(){
    const url ='https://www.naver.com/';
    const chrome = await new Builder().forBrowser(Browser.CHROME).build();
    try{
        //사이트 접속
        await chrome.get(url);

        // 로그인버튼이 제대로 나타날때까지 최대 5초 까지 대기
        await chrome.wait(until.elementLocated(By.css('.link_login')),5000);

        // 로그인 버튼 찾기
        let loginBtn = await chrome.findElement(By.css('.link_login'));

        //로그인 버튼 클릭
        await chrome.actions().move({origin:loginBtn}).click().perform();

        //1초 쉬었다가..
        await chrome.sleep(1000);

        // 아이디 패스워드 버튼위치 확인
        const [uid,pwd,logBtn] =[await chrome.findElement(By.css('#id_line')),await chrome.findElement(By.css('#pw_line')),await chrome.findElement(By.css('.btn_login'))];

        //클립보드로 아이디/비밀번호 복붙 후 로그인 시도
        //클립보드 복사 모듈 - copy-paste
        ncp.copy('아이디를 입력하세요');
        await chrome.actions().click(uid).keyDown(Key.CONTROL).sendKeys('v').perform();
        await sleep(2000);
        ncp.copy('패스워드를 입력하세요');
        await chrome.actions().click(pwd).keyDown(Key.CONTROL).sendKeys('v').perform();
        await sleep(1000);
        // 로그인 버튼 클릭
        await chrome.actions().move({origin:logBtn}).click().perform();
        await sleep(2000);

        // 최종적 디바이스 등록버튼
        await chrome.wait(until.elementLocated(By.css('.btn_cancel .btn')),5000);
        const cnfrm= await chrome.findElement(By.css('.btn_cancel .btn'));
        await chrome.actions().move({origin:cnfrm}).click().perform();
        await sleep(5000);
        
        // 아이프레임 접근
        const iframe = chrome.findElement(By.css('#minime'));

        // 탐색을 iframe으로 전환
        await chrome.switchTo().frame(iframe);

        // 이메일 개수 css 셀렉터 가져오기
        let emailCnt =await chrome.findElement(By.css('.num.MY_MAIL_COUNT'));
        // 이메일 개수 내용 지정
        emailCnt = await emailCnt.getAttribute('textContent');
        // 출력
        console.log(`total mails : ${emailCnt}`);
            
    } catch (ex){
        console.log(ex);
    }finally {
        await chrome.sleep(3000);
        await chrome.quit();
    }
}

function sleep(ms){
    new Promise(resolve => {
        setTimeout(resolve,ms);
    });
}


main();
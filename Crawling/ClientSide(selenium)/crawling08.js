// selenium을 이용한 k-apt 2023-01 기준 서울시 강남구 삼성동 아이파크 주차대수 가져오기
const {Builder, Browser, By, Key, until, Select} = require('selenium-webdriver');

async function main() {
    const url = 'http://k-apt.go.kr/';
    const chrome = await new Builder().forBrowser(Browser.CHROME).build();
    try{
        await chrome.get(url);
        // 우리단지 기본정보 버튼이 뜰때까지 기다림
        // .fr>#nav .mainMenunDiv:nth-of-type(1)
        await chrome.wait(until.elementLocated(By.xpath('//a[@title="우리단지 기본정보"]')),5000);
        //단지정보  버튼 찾기
        let menu = await chrome.findElement(By.xpath('//a[@title="단지정보"]'),5000);
        let danji = await chrome.findElement(By.xpath('//a[@title="우리단지 기본정보"]'),5000);

        //단지정보 버튼 클릭
        await chrome.actions().move({origin:menu}).click().perform();
        await chrome.actions().move({origin:danji}).click().perform();
        await sleep(1000);

        //검색내용 변수선언
        let syear = '2023년';
        let smonth = '01월';
        let sido = '서울특별시';
        let gugun = '강남구';
        let dong = '삼성동';
        let apt = '아이파크삼성동';

        //검색 반복문처리


        //검색년도 값 설정
        let select = await chrome.findElement(By.name('searchYYYY'));
        // 셀렉트에서 보이는 글자를 설정
        await new Select(select).selectByVisibleText(syear);
        await sleep(1000);

        await chrome.wait(until.elementLocated(By.name('searchMM')),5000);
        // 검색월 searchMM
        select = await chrome.findElement(By.name('searchMM'));
        // 셀렉트에서 보이는 글자를 설정
        await new Select(select).selectByVisibleText(smonth);
        await sleep(1000);

        await chrome.wait(until.elementLocated(By.name('combo_SIDO')),5000);
        //검색 시도 combo_SIDO
        select = await chrome.findElement(By.name('combo_SIDO'));
        // 셀렉트에서 보이는 글자를 설정
        await new Select(select).selectByVisibleText(sido);
        await sleep(1000);

        await chrome.wait(until.elementLocated(By.name('combo_SGG')),5000);
        //검색 군구 combo_SGG
        select = await chrome.findElement(By.name('combo_SGG'));
        // 셀렉트에서 보이는 글자를 설정
        await new Select(select).selectByVisibleText(gugun);
        await sleep(1000);

        await chrome.wait(until.elementLocated(By.name('combo_EMD')),5000);
        //검색 동 combo_EMD
        select = await chrome.findElement(By.name('combo_EMD'));
        // 셀렉트에서 보이는 글자를 설정
        await new Select(select).selectByVisibleText(dong);

        //단지 이름 가져오기
        let aptList = await chrome.findElements(By.css('.aptS_rLName'));
        //주소 가져오기
        let addr = await chrome.findElements(By.css('.aptS_rLAdd'));

        for(let i in aptList){
            if(await aptList[i].getAttribute('textContent')===apt){
                //클릭
                await chrome.actions().move({origin:aptList[i]}).click().perform();
                break;
            }
        }

        await sleep(5000);

        //title="관리시설정보"  .lnbNav>li:nth-of-type(3)>a

        await chrome.wait(until.elementLocated(By.css('.lnbNav>li:nth-of-type(3)>a')),5000);
        let menu2 = await chrome.findElement(By.css('.lnbNav>li:nth-of-type(3)>a'));
        await chrome.actions().move({origin:menu2}).click().perform();
        // subCbox
        await sleep(5000);

        let table  =await chrome.findElements(By.css('.subCbox>table:nth-of-type(2) tr:nth-of-type(5) .ul01_fl li span'));
        let dt = [];
        for(let i of table){
            dt.push(await i.getAttribute('textContent'));
        }

        console.log(`지상: ${dt[0]} 대 | 지하 : ${dt[1]} 대 | 총 : ${dt[2]} 대`);
        

    }catch (e){
        console.log(e);
    }finally {
        await chrome.sleep(5000);
        await chrome.quit();
    }
}

function sleep(ms){
    new Promise(resolve => {
        setTimeout(resolve,ms);
    });
}

main();
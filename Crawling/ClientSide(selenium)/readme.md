## selenium-webdriver
* 웹브라우저를 이용한 작업들을 자동화할 수 있도록 특수제작된 브라우저
* axios로 스크래핑할 수 없는 동적 데이터를 포함하는 웹 페이지를 원격 조작이 가능한 웹브라우저를 이용해서 처리
* 로그인을 해서 특정정보를 추출하거나, 반복적인 작업을 통해 정보를 추출하거나 마우스 클릭등 무인으로 프로그램을 조작해야 할 필요가 있는 경우
* https://www.npmjs.com/package/selenium-webdriver
* https://www.selenium.dev/documentation/webdriver/getting_started

### ChromDriver 설치
* selenium을 실행하다보면 아래와 같은 경고창이 뜰 수도 있다.
>![이미지](../imgs/result0213018.png)
* 해당 경고는 현재 사용하는 브라우저의 버전과 selenium의 drive버전이 맞지 않기때문에 발생한다.
* 따라서 다음과 같이 [ChromeDriver](https://chromedriver.chromium.org/downloads)사이트에 접속한 뒤 버전에 맞는 드라이버를 다운로드 한다.
>![이미지](../imgs/result0213014.png)
>![이미지](../imgs/result0213015.png)
>![이미지](../imgs/result0213016.png)

* 다운 받은 드라이버의 실행파일을 현재 selenium이 설치된 폴더에 넣는다.
>![이미지](../imgs/result0213019.png)
 
### [다음영화 페이지 크롤링](./crawling06.js)
* https://movie.daum.net/main 사이트에서 '상영중'인 영화정보 긁어오기
1. 셀레늄 설치 및 사용준비(dom탐색을 위한 cheeio 설치)
```javascript
const cheerio =  require('cheerio');
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
```
2. 자동화 브라우저 객체 생성 및 url지정
* 셀레늄은 비동기처리되므로 await를 반드시 사용한다.
```javascript
const chrome = await new Builder().forBrowser(Browser.CHROME).setChromeOptions().build();
const url = 'https://movie.daum.net/main';
```
3. 비동기 작업으로 url접속
````javascript
try {
    // url을 크롬으로 열기
   await chrome.get(url);
}catch(ex){
    //오류시 오류 출력
    console.log(ex);
}finally {
    //최종작업
   await  chrome.quit();
}
````

4. url접속 후 작업내용 추가
```javascript
try{
    
   await chrome.get(url);

  // css선택자 중 .tit_item이 화면에 위치할때까지 최대 5초간 기다려주게 설정
  await chrome.wait(until.elementLocated(By.css('.tit_item')),5000);

  //접속한 사이트 html소스를 가져옴
  const  html = await chrome.getPageSource();

   //cheerio : 페이지 소스를 dom객체로 변환
   const dom = cheerio.load(html);

    //영화제목 selector로 가져오기
   let movies = dom('.feature_home strong.tit_item');
    //평점 selector로 가져오기
   let scores = dom('.feature_home span.txt_num:nth-of-type(1)');
    //예매율 selector로 가져오기
   let rates = dom('.feature_home span.txt_num:nth-of-type(3)');
   
   //추출된 영화제목 출력
   movies.each((idx,title)=>{
      console.log(`${idx+1}. 제목: ${dom(title).text().trim()} , 평점: ${dom(scores[idx]).text().trim()}, 예매율:${dom(rates[idx]).text().trim()}`);
   });
}catch....

```
>결과<br>
> ![이미지](../imgs/result0213007.png)

### [다음영화페이지크롤링2](./crawling06B.js)
* selenium을 사용하면 cheerio없이 바로 dom탐색이 가능하다.
* 대체내용 

|구분| cheerio | selenium|
|---|---| ---|
selector | dom('css선택자') | await chrome.findElements(By.css('css선택자')) |
text출력 | dom(selector담은 변수).text() | await selector 담은변수.getAttribute('textContent')

* 따라서 다음과 같이 수정될 수 있다.
```javascript
// 셀레늄 불러오기
const {Builder, Browser, By, until} = require('selenium-webdriver');

//작동 함수
async function main(){
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

        for(let i in movies){
            // gettext는 눈에 보이는데로만 출력이 된다.
            // console.log(await movie.getText());
            // textContent의 경우 로딩된 페이지 전체중 선택자의 텍스트만 탐색된다.
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

//실제 함수 작동
main()
```
>결과<br>
> ![이미지](../imgs/result0213007.png)


### [네이버 자동로그인](./crawling07.js)
* 셀레늄은 클릭 및 타이핑같은 모든 작업이 자율화 되어있기때문에 자동 로그인 및 원하는 메뉴로의 이동이 가능하다.
* 네이버의 경우 아이디나 패스워드를 자동화해서 직접적으로 입력하면 매크로를 돌렸다고 인식하기 때문에 복사 + 붙여넣기 확장팩이 필요하다.
1. 셀레늄 및 복사 붙여넣기 설치 및 사용 
```javascript
// 셀레늄을 이용한 네이버 받은 메일 개수 조회 후 메일 출력
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');

//copy and paste
const ncp= require('copy-paste');

```

2. 메인함수 생성 및 브라우저 빌드 [메인함수]
````javascript
async function main(){
    const url ='https://www.naver.com/';
    const chrome = await new Builder().forBrowser(Browser.CHROME).build();
}
````

3. 사이트 접속 및 로그인버튼 클릭 [메인함수]
```javascript
    //사이트접속
    try{
        await chrome.get(url);
        // 로그인버튼이 제대로 나타날때까지 최대 5초 까지 대기
        await chrome.wait(until.elementLocated(By.css('.link_login')),5000);
        // 로그인 버튼 찾기
        let loginBtn = await chrome.findElement(By.css('.link_login'));
        //로그인 버튼 클릭
        await chrome.actions().move({origin:loginBtn}).click().perform();
    
    }catch (e) {
        console.log(e);
    }finally {
        //3초 쉬었다가 종료 
        await chrome.sleep(3000);
        await chrome.quit();
    }
```

4. 잠깐 쉬어가기 함수 생성 [sleep함수]
* 해당 함수는 메인함수 바깥에 새롭게 생성한다.
* 해당 함수를 만드는 이유는, 모든 자동화 활동이 너무 빠르게 진행되면 매크로 의심을 받기 때문이다.
```javascript
function sleep(ms){
    new Promise(resolve => {
        setTimeout(resolve,ms);
    });
}
```

5. 클립보드를 활용하여 아이디 복붙 [main함수]
```javascript
    try{
            ⁝
        // 아이디, 패스워드 로그인버튼 위치 찾기 
        const [uid,pwd,logBtn] =[await chrome.findElement(By.css('#id_line')),
          await chrome.findElement(By.css('#pw_line')),
          await chrome.findElement(By.css('.btn_login'))];
            
         //복사할 아이디 설정   
        ncp.copy('put your id here');
        // 아이디 위치로 가서 클릭 후 붙여넣기
        await chrome.actions().click(uid).keyDown(Key.CONTROL).sendKeys('v').perform();
        // 2초 휴식
        await sleep(2000);
        
        // 복사할 패스워드 설정
        ncp.copy('put your password here');
        // 패스워드 위치로 가서 클릭 후 붙여넣기
        await chrome.actions().click(pwd).keyDown(Key.CONTROL).sendKeys('v').perform();
        //1초 휴식
        await sleep(1000);
        // 로그인 버튼 클릭
        await chrome.actions().move({origin:logBtn}).click().perform();
        //2초 휴식
        await sleep(2000);
            
    }
     ⁝

```

6. 디바이스 등록창 버튼 클릭 [메인함수]
```javascript
try{
                    ⁝
        // 등록안함 버튼 로딩 기다림
        await chrome.wait(until.elementLocated(By.css('.btn_cancel .btn')),5000);
        
        // 등록안함버튼 찾기
        const cnfrm= await chrome.findElement(By.css('.btn_cancel .btn'));
        
        // 등록안함버튼 클릭
        await chrome.actions().move({origin:cnfrm}).click().perform();
        
        // 5초 휴식
        await sleep(5000);
}
         ⁝
```


6. 로그인 후 메일에 접근 
* 이때, 메일은 iframe으로 추가가 되어있기때문에 iframe접속이 필요하다.
```javascript
try{
                    ⁝
        // iframe접근 (메일이 들어있는..)
        const iframe = chrome.findElement(By.css('#minime'));
        // 탐색을 iframe으로 전환            
        await chrome.switchTo().frame(iframe);
        
        //이메일 개수가 지정되있는 선택자 선택
        let emailCnt =await chrome.findElement(By.css('.num.MY_MAIL_COUNT'));
        //텍스트 추출
        emailCnt = await emailCnt.getAttribute('textContent');
        
        //최종 이메일 추출
        console.log(`total mails : ${emailCnt}`);
}
         ⁝

```

>결과<br>
> ![이미지](../imgs/result0214001.png)


### [k-apt 단지정보 내 주차대수 가져오기](./crawling08.js)
* k-apt의 경우 select를 선택해야하는 action이 많다. 
* 따라서 select에 있는 값을 기준으로 선택을 한 뒤 값을 가져오는것이 이 크롤링의 핵심 포인트 이다.
* k-apt의 2023-01 기준, 서울 강남구 삼성동 아이파크 주차대수를 가져와본다.
1. 셀레늄 세팅
```javascript
    const {Builder, Browser, By, Key, until, Select} = require('selenium-webdriver');
```
2. 메인함수 설정 및 url, 브라우저 설정
```javascript
    async function main(){
        const url = 'http://k-apt.go.kr/';
        const chrome = await new Builder().forBrowser(Browser.CHROME).build();
    }
```

3. 브라우저를 띄우고나서 url가져오기 [메인함수]
```javascript
    try{
        await chrome.get(url);
    }catch (e){
    console.log(e);
    }finally {
        await chrome.sleep(5000);
        await chrome.quit();
    }
```

4. 우리단지 기본정보 버튼이 뜰때까지 기다림 [메인함수]
* 여기서 사용하는 x-path는 속성명을 기준으로 dom을 탐색 할 수 있다.
```javascript
    try{
            ⁝
        await chrome.wait(until.elementLocated(By.xpath('//a[@title="우리단지 기본정보"]')),5000);
    }
```

5. 단지정보 > 우리단지 기본정보 버튼 찾아서 클릭하기 [메인함수]
```javascript
    try{
                ⁝
        //단지정보  버튼 찾기
        let menu = await chrome.findElement(By.xpath('//a[@title="단지정보"]'),5000);
        let danji = await chrome.findElement(By.xpath('//a[@title="우리단지 기본정보"]'),5000);
    
        //단지정보 버튼 클릭
        await chrome.actions().move({origin:menu}).click().perform();
        await chrome.actions().move({origin:danji}).click().perform();
    }
```

6. 잠깐 쉬어갈 수 있는 함수 만들기[sleep함수]
````javascript
    function sleep(ms){
        new Promise(resolve => {
            setTimeout(resolve,ms);
        });
    }
````

7. 1초 쉬었다가 검색할 내용 변수 선언[main함수]
```javascript
    try{
                ⁝
        await sleep(1000);

        //검색내용 변수선언
        let syear = '2023년';
        let smonth = '01월';
        let sido = '서울특별시';
        let gugun = '강남구';
        let dong = '삼성동';
        let apt = '아이파크삼성동';
        
    }
```

8. 검색년도 select값 설정 및 선택[main함수]
```javascript
    try{
                ⁝
        //검색년도 값 설정
        let select = await chrome.findElement(By.name('searchYYYY'));
        // 셀렉트에서 보이는 글자를 설정
        await new Select(select).selectByVisibleText(syear);
        // 1초 쉬기
        await sleep(1000);
    }
```

9. 검색 월 설정 및 선택[main함수]
```javascript
    try{
                ⁝
        //월 검색이 나올때까지 대기
        await chrome.wait(until.elementLocated(By.name('searchMM')),5000);
        // 검색월 searchMM 찾기
        select = await chrome.findElement(By.name('searchMM'));
        // 셀렉트에서 smonth 와 같은 글자를 선택
        await new Select(select).selectByVisibleText(smonth);
        //1초 쉬기
        await sleep(1000);
    }
```

10. 시도 설정 및 선택[main함수]
```javascript
    try{
                ⁝
        //시도 검색이 나올때까지 대기
        await chrome.wait(until.elementLocated(By.name('combo_SIDO')),5000);
        //검색창 찾기
        select = await chrome.findElement(By.name('combo_SIDO'));
        // 셀렉트에서 sido와 같은 글자를 선택
        await new Select(select).selectByVisibleText(sido);
        await sleep(1000);
    }
```

11. 군구 설정 및 선택[main함수]
```javascript
    try{
                ⁝
        //군구 검색이 나올때까지 대기
        await chrome.wait(until.elementLocated(By.name('combo_SGG')),5000);
        //검색 군구 combo_SGG
        select = await chrome.findElement(By.name('combo_SGG'));
        // 셀렉트에서 보이는 글자를 설정
        await new Select(select).selectByVisibleText(gugun);
        await sleep(1000);
    }
```

12. 동 설정 및 선택[main함수]
```javascript
    try{
                ⁝
        //동 검색이 나올때까지 대기
        await chrome.wait(until.elementLocated(By.name('combo_EMD')),5000);
        //검색 동 combo_EMD
        select = await chrome.findElement(By.name('combo_EMD'));
        // 셀렉트에서 보이는 글자를 설정
        await new Select(select).selectByVisibleText(dong);
    }
```

13. 단지 이름 가져온 후 클릭하기[메인함수]
* 단지내의 정보로 들어가기위해서 해당 리스트의 이름이 필요하다.
```javascript
    try{
                ⁝
        //단지 이름 가져오기
        let aptList = await chrome.findElements(By.css('.aptS_rLName'))
        //단지 리스트를 전체적으로 비교
        for(let i in aptList){
            // 비교 시 apt에 저장한 이름과 같은 단지가 있다면
            if(await aptList[i].getAttribute('textContent')===apt){
                //클릭 진행후
                await chrome.actions().move({origin:aptList[i]}).click().perform();
                //for문 중단
                break;
            }
        }
        //5초 쉬기
        await sleep(5000);
    }
```

14. 관리시설 정보 클릭하기[메인함수]
* 관리시설정보에 title이라는 속성명이있지만, 여기서 먹히지 않아 css선택자로 대처하였다.
```javascript
    try{
                ⁝
    // 관리시설정보 버튼이 뜰때까지 기다림
    await chrome.wait(until.elementLocated(By.css('.lnbNav>li:nth-of-type(3)>a')),5000);
    // 관리시설 정보 버튼 탐색
    let menu2 = await chrome.findElement(By.css('.lnbNav>li:nth-of-type(3)>a'));
    //관리시설 정보 버튼 클릭
    await chrome.actions().move({origin:menu2}).click().perform();
    //5초 쉬기
    await sleep(5000);
    }
```

15. 관리시설 정보 안에 주차대수가져오기[메인함수]

```javascript
    try{
                ⁝
        // 주차대수가 있는 selector탐색
        let table  =await chrome.findElements(By.css('.subCbox>table:nth-of-type(2) tr:nth-of-type(5) .ul01_fl li span'));
        // 주차대수를 저장할 수 있는 배열 선언
        let dt = [];
        // dt에 주차대수에서 가져온 텍스트를 배열로 넣음
        for(let i of table){
            dt.push(await i.getAttribute('textContent'));
        }
        
        // span기준으로 첫번째가 지상, 두번째가 지하 세번째가 총 대수이므로 아래와 같이 출력
        console.log(`지상: ${dt[0]} 대 | 지하 : ${dt[1]} 대 | 총 : ${dt[2]} 대`);
    }
```

>결과<br>
> ![이미지](../imgs/result0214002.png)

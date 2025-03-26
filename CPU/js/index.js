'use strict';

document.addEventListener('DOMContentLoaded', function() {
    htmlInitialize();

    welcomeInitialize();

    lunboInitialize();

    rankInitialize();

    partFaceInitialize();
});

//页面初始化
function htmlInitialize(){
    const htmlScroll = document.querySelectorAll('.htmlScrollCell');
    const htmlElement = document.documentElement;
    getTop();
    window.addEventListener('resize',function(){
        getTop();
    });
    function getTop(){
        //记录元素绝对于html的高度
        htmlScroll.forEach((element, index) => {
            if (index === 0)
                element.htmlTop=0;
            else
                element.htmlTop = htmlScroll[index - 1].htmlTop + htmlScroll[index - 1].offsetHeight;
        });
    }

	let htmlScrollId=0;
    // 页面切换滚动
    htmlElement.addEventListener('wheel', wheeHtml);
    function wheeHtml(event) {
        if (event.deltaY > 0 && htmlScrollId < htmlScroll.length - 1)
            htmlScrollControl(htmlScrollId+1);
        else if (event.deltaY < 0 && htmlScrollId > 0)
            htmlScrollControl(htmlScrollId-1);
    }

    let lock = true; // 局部变量
    function htmlScrollControl(n){
        if(lock){
            lock = false;
            htmlScrollId = n;
            scrollSmooth(htmlElement, 0, htmlScroll[htmlScrollId].htmlTop,'html').then((callerId) => {
                if(callerId==='html')   lock = true; // 在平滑移动结束后解锁
            });
            return;
        }
    }

    const homeTotalBox = htmlElement.querySelector('.homeTotalBox');
    homeTotalBox.addEventListener('click',function(event){
        if(event.target.classList.contains('homeBox1')){
            htmlScrollControl(1);
            return;
        }
        if(event.target.classList.contains('homeBox2')){
            htmlScrollControl(3);
            return;
        }
        if(event.target.classList.contains('homeBox3')){
            htmlScrollControl(4);
            return;
        }
    });
}

//轮播图初始化 
function lunboInitialize(){

    const lunboyemian = document.querySelector('.lunboyemian');
    const lunbototalbox=lunboyemian.querySelector('.lunbototalbox');
    const lunbobox=lunbototalbox.querySelectorAll('.lunbobox');
    lunbobox[0].innerHTML=lunbobox[lunbobox.length-2].innerHTML;
    lunbobox[lunbobox.length-1].innerHTML=lunbobox[1].innerHTML;


    const lunboExtroSolid = lunboyemian.querySelectorAll('.lunboExtroSolid');
    let lunboExtroSolidId = 0;


    const lunboExtroBox = lunboyemian.querySelectorAll('.lunboExtroBox');
    lunboExtroBox.forEach((element,index) => {
        element.index=index;
    });

    let lock = true; // 局部变量

    lunboyemian.addEventListener('click', function(event) {
		if(!lock)
			return;
        if (event.target.classList.contains('lunbobutton')) {
            const width = lunbototalbox.offsetWidth;
            const lunboboxlength = lunbobox.length;

            // 清除所有进度条进度，放在这可能不安全，但是项目小无所谓了。
            lunboExtroSolidClearAll(lunboExtroSolid);

            if (event.target.innerHTML === '&lt;') {
                lunboExtroSolidJudge(-1);
                if (lunbototalbox.scrollLeft === 0)
                    lunbototalbox.scrollLeft = width * (lunboboxlength - 2);
                scrollToo(lunbototalbox.scrollLeft - width); // 不能创建一个值来替代 lunbototalbox.scrollLeft，因为是值所以不是传输地址而是一个独立的值，所以 lunbototalbox.scrollLeft 不会对独立的值产生更新。会产生 bug
                return;
            }

            if (event.target.innerHTML === '&gt;') {
                lunboExtroSolidJudge(1);
                if (lunbototalbox.scrollLeft === width * (lunboboxlength - 1))
                    lunbototalbox.scrollLeft = width;
                scrollToo(lunbototalbox.scrollLeft + width);
                return;
            }
        }
		if (event.target.classList.contains('lunboExtroBox'))   lunboExtroBoxClick(event);
    });


    let lockExtro=true;
	lunboExtroBox[0].click();

    //轮播额外栏点击
    function lunboExtroBoxClick(event){
        lockExtro=false;
        //改变轮播额外栏
        lunboExtroSolidClearAll(lunboExtroSolid);//清空所有进度条进度
        lunboExtroSolidJudge(event.target.index-lunboExtroSolidId);
        //改变轮播图
        scrollToo((event.target.index+1)*lunbototalbox.offsetWidth);
        return;
    }
    //轮播额外栏进入
    lunboyemian.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('lunboExtroBox') && event.target.querySelector('.lunboExtroSolid').offsetWidth > 0)
            lockExtro = false;
    });
    //轮播额外栏离开
    lunboyemian.addEventListener('mouseout', function(event) {
        if (event.target.classList.contains('lunboExtroBox'))
            lockExtro = true;
    });


    setInterval(lunboExtroSolidSelect, 30);

    const lunbobutton=lunboyemian.querySelectorAll('.lunbobutton');
    //upobj为比较元素，相对与upobj同长时会更换到下一个元素
    function lunboExtroSolidSelect(){
        if(lunboExtroSolidAddSelf(lunboExtroSolid[lunboExtroSolidId], lunboExtroBox[lunboExtroSolidId])>lunboExtroBox[lunboExtroSolidId].clientWidth && lockExtro){
            lunbobutton[1].click();//切换页面,切换页面中封装了id更新，以及清理所有进度条
        }
    }
    //轮播额外栏自动装置
    //轮播额外栏自动增长
    function lunboExtroSolidAddSelf(obj,upobj){
        if(obj.clientWidth<upobj.clientWidth*3/4){
            obj.style.width=(obj.clientWidth+2)+'px';
        }else{
            obj.style.width=(obj.clientWidth+1)+'px';
        }
        return obj.clientWidth;
    }
    //轮播额外栏归零
    function lunboExtroSolidClearAll(obj){
        obj.forEach(element => {
            element.style.width='0px';
        });
    }
    //更改id值并检测越界
    function lunboExtroSolidJudge(n){
        lunboExtroSolidId+=n;
        if(lunboExtroSolidId>=lunboExtroSolid.length){
            lunboExtroSolidId=0;
        }else if(lunboExtroSolidId<0){
            lunboExtroSolidId=lunboExtroSolid.length-1;
        }
    }


    
    //统一接口
    function scrollToo(x) {
        if (lock) {
            lock = false;
            scrollSmooth(lunbototalbox, x, 0,'lunbo').then((callerId) => {
                if(callerId==='lunbo')  lock = true; // 在平滑移动结束后解锁
            });
        }
    }
}

//加入页面初始化
function welcomeInitialize(){
    const welcomeyemian=document.querySelectorAll('.yemian')[2];
    const newDiv=welcomeyemian.querySelector('.newDiv');
    let state=true;
    welcomeyemian.addEventListener('click',function(event){
        if(event.target.tagName!=='BUTTON' && state)
            return;
        state=false;
        newDiv.style.top=event.clientY+'px';
        newDiv.style.left=event.clientX+'px';
        newDiv.style.animation='in 1s ease-out forwards';

    });
    welcomeyemian.addEventListener('mouseleave',function(){
        if(state)
            return;
        state=true;
        newDiv.style.animation='out 1s ease-out forwards';
    })
}

//排行榜初始化
function rankInitialize(){

    const switchFaces = document.querySelectorAll('.switchFace');
    switchFaces[0].style.display = 'block';

    const zongdaolan = document.querySelector('.zongdaolan');
    const daolan = zongdaolan.querySelectorAll('.daolan');
	// 初始化导航栏
    daolan.forEach((item, i) => {
        item.id = i;
        item.style.background = 'black';
        item.style.color = 'white';
    });

    let lastBackgroud;
    let lastColor;
    zongdaolan.addEventListener('click', function(event) {
        if (event.target.classList.contains('daolan')) {
            resetDaolanStyles(daolan);
            event.target.style.background = lastBackgroud = 'white';
            event.target.style.color = lastColor = 'black';
            showSwitchFace(event.target.id);
            return;
        }
    });

    zongdaolan.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('daolan')) {
            lastBackgroud = event.target.style.background;
            lastColor = event.target.style.color;
            event.target.style.background = 'gray';
            event.target.style.color = 'black';
            return;
        }
    });

    zongdaolan.addEventListener('mouseout', function(event) {
        if (event.target.classList.contains('daolan')) {
            event.target.style.background = lastBackgroud;
            event.target.style.color = lastColor;
            return;
        }
    });
    
    daolan[0].click();

    // 排行榜滚动
    const rank = document.querySelector('.rank');
    rank.addEventListener('wheel', function(event) {
        event.stopPropagation(); // 默认的传播模式为自下而上，所以只要截断传播链即可防止父元素被触发，这里截断
        event.target.parentElement.scrollTo(0, event.target.parentElement.scrollTop + event.deltaY);
    });

    // 重置导航栏样式
    function resetDaolanStyles(daolan) {
        daolan.forEach(item => {
            item.style.background = 'black';
            item.style.color = 'white';
        });
    }

    // 显示对应的 switchFace
    function showSwitchFace(id) {
        switchFaces.forEach(item => {
            item.style.display = 'none';
        });
        switchFaces[id].style.display = 'block';
    }
}

//电脑配件搭配初始化
function partFaceInitialize(){


    const partFaceAllTotalLoopBox = document.querySelectorAll('.partFaceTotalLoopBox');
    
    partFaceAllTotalLoopBox.forEach(loopBoxContainer => {
        const loopBox = loopBoxContainer.querySelectorAll('.loopBox');
        const k = 360 / loopBox.length;
        const r = loopBox.length * 40;
        loopBox.forEach((box, j) => {
            box.style.transform = `rotateY(${k * j}deg) translateZ(${r}px)`;
        });
    });


    //配件栏拖动
    const partFace = document.querySelector('.partFace');
    const partFaceTotalBox = partFace.querySelectorAll('.partFaceTotalBox');
    const partFaceTotalLoopBox = partFace.querySelectorAll('.partFaceTotalLoopBox');
    partFaceTotalLoopBox.forEach(box => {
        box.rotateY = 0;
    });

    let lockMove=false;
    let mouseDownX;
    //点击
    partFace.addEventListener('mousedown', function(event) {
        event.preventDefault(); //防止触发浏览器的新增页面功能
        if(event.target.classList.contains('partFaceBox')){
            lockMove = true;
            mouseDownX = event.clientX;
        }
    });
    //移动
    partFace.addEventListener('mousemove', function(event) {
        if (!lockMove)
            return;
        const partFaceTotalLoopBox = partFaceTotalBoxSearch(partFaceTotalBox, event.target).querySelector('.partFaceTotalLoopBox');
        partFaceTotalLoopBox.style.transform = `rotateY(${(event.clientX - mouseDownX) / 5 + partFaceTotalLoopBox.rotateY}deg)`;
    });
    //松开
    partFace.addEventListener('mouseup',function(event){
        if(!lockMove)
            return;
        lockMove=false;
        const partFaceTotalLoopBox=partFaceTotalBoxSearch(partFaceTotalBox,event.target).getElementsByClassName('partFaceTotalLoopBox')[0];
        partFaceTotalLoopBox.rotateY=(event.clientX-mouseDownX)/5+partFaceTotalLoopBox.rotateY;
    });
    //离开
    partFaceTotalBox.forEach((element)=>{
        element.addEventListener('mouseleave',function(event){
            lockMove=false;
            this.rotateY=(event.clientX-mouseDownX)/5+partFaceTotalLoopBox.rotateY;
        });
    });

    function partFaceTotalBoxSearch(obj,target){
        for(let i=0;i<obj.length;i++){
            //contains包括自己
            if(obj[i].contains(target)){
                return obj[i];
            }
        }
        return null;
    }
}



//平滑滚动接口
function scrollSmooth(obj, x, y,callerId) {
    return new Promise((resolve) => {
        let distanceX = (x - obj.scrollLeft) * 3 / 4;
        let distanceY = (y - obj.scrollTop) * 3 / 4;

        obj.scrollLeft = x - distanceX;
        obj.scrollTop = y - distanceY;
        
        if (distanceX > -4 && distanceX < 4 && distanceY > -4 && distanceY < 4) {
            obj.scrollLeft = x;
            obj.scrollTop = y;
            resolve(callerId); // 滚动完成，解锁
        } else {
            setTimeout(() => {
                //resolve 是 Promise 构造函数中的一个函数参数，但它不仅仅是一个“值”，而是一个函数。
                //成功，调用父对象的resolve函数,此时子对象返回的值，会被父对象的resolve获取用于返回
                scrollSmooth(obj, x, y,callerId).then(resolve);//返回的promise对象触发.then后then里如果是一个值，会将m包装为一个promise，并立即解析为m，且这个promise的值为fulfilled，从而影响父promise对象，导致父对象也出发.then
            }, 20);
        }
    });
}

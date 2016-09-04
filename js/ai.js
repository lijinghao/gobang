var canvas;
var context;
var isWhite = false;//设置是否该轮到白棋，黑棋为人，白棋为ai
var isWell = false;//设置该局棋盘是否已经结束
var isHumanFirstStep = true;//人第一步必须下棋到天元处
var isAIFirstStep = true;//电脑第一步下棋到黑棋四周随机一个地方
var img_b = new Image();
img_b.src = "./img/black.png";//白棋图片
var img_w = new Image();
img_w.src = "./img/white.png";//黑棋图片
var SEARCH_DEPTH = 1;//设置minmax算法搜索深度

var chessData = new Array(15);//这个为棋盘的二维数组用来保存棋盘信息，初始化0为没有走过的，1为白棋走的，2为黑棋走的
for (var x = 0; x < 15; x++) {
    chessData[x] = new Array(15);
    for (var y = 0; y < 15; y++) {
        chessData[x][y] = 0;
    }
}
var score = new Array(15);//这个数组用于记录计算位置估分时存储计算结果
for (var x = 0; x < 15; x++) {
    score[x] = new Array(15);
    for (var y = 0; y < 15; y++) {
        score[x][y] = 0;
    }
}

function drawRect() {//页面加载完毕调用函数，初始化棋盘
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    for (var i = 40; i < 640; i += 40) {//绘制棋盘的线

        //context.translate(0.5,0.5);
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(40, i);
        context.lineTo(600, i);
        context.closePath();
        //context.strokeStyle = "white";
        context.stroke();//绘制边框

        //context.translate(-0.5,-0.5);
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(i, 40);
        context.lineTo(i, 600);
        context.closePath();
        context.stroke();//绘制边框

    }

    context.beginPath();//棋盘左上点
    context.arc(160, 160, 5, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fill();

    context.beginPath();//棋盘右上点
    context.arc(480, 160, 5, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fill();

    context.beginPath();//棋盘中间点
    context.arc(320, 320, 5, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fill();

    context.beginPath();//棋盘左下点
    context.arc(160, 480, 5, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fill();

    context.beginPath();//棋盘右下点
    context.arc(480, 480, 5, 0, Math.PI * 2, true);
    context.closePath();
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fill();

}
function play(e) {//鼠标点击时发生
    if(isHumanFirstStep){
        isWhite = true;
        drawChess(2, 7, 7);
        isHumanFirstStep = false;
        aiplay();
        return;
    }
    if (isWell == true) {//判断是否已经分出胜负
        alert("此局已结束");
        return;
    }

    var offset_left = $(".main").offset().left;//获取canvas距离document左上角的偏移量，用于之后计算
    var x = parseInt((e.pageX - offset_left - 20) / 40);//计算鼠标点击的区域，如果点击了（65，65），那么就是点击了（1，1）的位置，其中pageX是将参照点固定在页面左上角，是随页面滚动而变化的
    var y = parseInt((e.pageY -20 - 20) / 40);

    if (x>=15 || y>=15 || chessData[x][y] != 0) {//判断该位置是否被下过了
        alert("你不能在这个位置下棋");
        return;
    }

    if (isWhite) {
        alert("请等电脑下完棋吧");
    }
    else {
        isWhite = true;
        drawChess(2, x, y);
        if (isWell == true) {//判断是否已经分出胜负，若分出胜负了，则黑棋不再下子
            return;
        }
        aiplay();
    }

}
function drawChess(chess, x, y) {//参数为，棋（1为白棋，2为黑棋），数组位置
    if (x >= 0 && x < 15 && y >= 0 && y < 15) {
        if (chess == 1) {
            context.drawImage(img_w, x * 40 + 20, y * 40 + 20);//绘制白棋
            chessData[x][y] = 1;
        }
        else {
            context.drawImage(img_b, x * 40 + 20, y * 40 + 20);
            chessData[x][y] = 2;
        }
        judge(x, y, chess);
    }
}
function judge(x, y, chess) {//判断该局棋盘是否赢了
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;

    //左右判断
    for (var i = x; i >= 0; i--) {
        if (chessData[i][y] != chess) {
            break;
        }
        count1++;
    }
    for (var i = x + 1; i < 15; i++) {
        if (chessData[i][y] != chess) {
            break;
        }
        count1++;
    }
    //上下判断
    for (var i = y; i >= 0; i--) {
        if (chessData[x][i] != chess) {
            break;
        }
        count2++;
    }
    for (var i = y + 1; i < 15; i++) {
        if (chessData[x][i] != chess) {
            break;
        }
        count2++;
    }
    //左上右下判断
    for (var i = x, j = y; (i >= 0) && (j >= 0); i--, j--) {
        if (chessData[i][j] != chess) {
            break;
        }
        count3++;
    }
    for (var i = x + 1, j = y + 1; (i < 15) && (j < 15); i++, j++) {
        if (chessData[i][j] != chess) {
            break;
        }
        count3++;
    }
    //右上左下判断
    for (var i = x, j = y; (i >= 0) && (j < 15); i--, j++) {
        if (chessData[i][j] != chess) {
            break;
        }
        count4++;
    }
    for (var i = x + 1, j = y - 1; (i < 15) && (j >= 0); i++, j--) {
        if (chessData[i][j] != chess) {
            break;
        }
        count4++;
    }

    if (count1 >= 5 || count2 >= 5 || count3 >= 5 || count4 >= 5) {
        if (chess == 1) {
            alert("白棋胜");
        }
        else {
            alert("黑棋胜");
        }
        isWell = true;//设置该局棋盘已经赢了，不可以再走了
    }
}
//电脑下棋函数
function aiplay() {
    if(isAIFirstStep){
        isWhite = false;
        drawChess(1, 6, 6);
        isAIFirstStep = false;
        return;
    }
    // for (var x = 0; x < 15; x++) {
    //     for (var y = 0; y < 15; y++) {
    //         if(0 == chessData[x][y]){
    //             score[x][y] = calAI(x, y, 1);
    //         }
    //     }
    // }

    // var max_value = 0;
    // var max_x = 0;
    // var max_y = 0;
    // for (var x = 0; x < 15; x++) {
    //     for (var y = 0; y < 15; y++) {
    //         if(0 == chessData[x][y]&&max_value < score[x][y]){
    //             max_value = score[x][y];
    //             max_x = x;
    //             max_y = y;
    //         }
    //     }
    // }
    // //alert(max_value);
    // isWhite = false;
    // drawChess(1, max_x, max_y);
    // return;

    // for (var x = 0; x < 15; x++) {
    //     for (var y = 0; y < 15; y++) {
    //         if(0 == chessData[x][y]){
    //             score[x][y] = minmax(x, y, 1, chessData);
    //         }
    //     }
    // }

    // var max_value = 0;
    // var max_x = 0;
    // var max_y = 0;
    // for (var x = 0; x < 15; x++) {
    //     for (var y = 0; y < 15; y++) {
    //         if(0 == chessData[x][y]&&max_value < score[x][y]){
    //             max_value = score[x][y];
    //             max_x = x;
    //             max_y = y;
    //         }
    //     }
    // }
    // //alert(max_value);
    // isWhite = false;
    // drawChess(1, max_x, max_y);
    // return;

    for (var x = 0; x < 15; x++) {
        for (var y = 0; y < 15; y++) {
            if(0 == chessData[x][y]){
                score[x][y] = minmax(x, y, 1, chessData);
                //alert("(,"+x+", "+y+") "+score[x][y]);
            }
        }
    }

    var min_value = 1000000000;
    var min_x = 0;
    var min_y = 0;
    for (var x = 0; x < 15; x++) {
        for (var y = 0; y < 15; y++) {
            if(0 == chessData[x][y]&&min_value > score[x][y]){
                min_value = score[x][y];
                min_x = x;
                min_y = y;
            }
        }
    }
    //alert(max_value);
    isWhite = false;
    drawChess(1, min_x, min_y);
    //alert("("+min_x+", "+min_y+") "+score[min_x][min_y]);
    return;

}
//构造极大极小博弈树
function minmax(x, y, depth, chessState){//初始深度为1
    var choose;
    var isMax;
    var temp_x;
    var temp_y;
    var chessTemp = new Array(15);//这个为棋盘的二维数组用来保存棋盘信息，0为没有走过的，1为白棋走的，2为黑棋走的
    for (var i = 0; i < 15; i++) {
        chessTemp[i] = new Array(15);
        for (var j = 0; j < 15; j++) {
            chessTemp[i][j] = chessState[i][j];
        }
    }
    if(depth % 2 == 0){//这步棋是人下的，下在了（x，y）点，下一步要取min值
        choose = 100000000;
        isMax = false;
    }else{//这步棋是AI下的，下在了（x，y）点，下一步要取max值
        choose = -100000000;
        isMax = true;
    }
    if(depth > SEARCH_DEPTH){
        if(isMax){
            //alert("white");
            return calAI(x, y, 1, chessState);//白棋
        }else{
            //alert("black");
            return calAI(x, y, 2, chessState);//黑棋
        }
    }else if(isMax){//这步棋是AI下的，下在了（x，y）点，下一步要取max值
        var tempchoose = calAI(x, y, 1, chessState);
        chessTemp[x][y] = 1;//把这步的白棋下完，下一步该下黑棋了
        //alert(chessTemp[x][y]+"; "+chessData[x][y]);
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if(0 == chessTemp[i][j]){
                    var t = minmax(i, j, ++depth, chessTemp);
                    if(choose < t){
                        choose = t;
                        temp_x = i;
                        temp_y = j;
                    }
                }
            }
        }
        // choose = choose - tempchoose;/这里是多层时调用的代码，层数一多就不准确了
        choose = - tempchoose;//这里是只访问一层时调用的代码
    }else{//这步棋是人下的，下在了（x，y）点，下一步要取min值
        var tempchoose = calAI(x, y, 2, chessState);
        chessTemp[x][y] = 2;//把这步的黑棋下完，下一步该下白棋了
        //alert(chessTemp[x][y]+"; "+chessData[x][y]);
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                if(0 == chessTemp[i][j]){
                    var t = minmax(i, j, ++depth, chessTemp);
                    if(choose > t){
                        choose = t;
                        temp_x = i;
                        temp_y = j;
                    }
                }
            }
        }
        // choose = choose - tempchoose;//这里是多层时调用的代码，层数一多就不准确了
        choose = - tempchoose;//这里是只访问一层时调用的代码
    }
    return choose;
}
//计算位置估分
function calAI(x, y, chessColor, chessState){
    var oppchessColor;
    if(1 == chessColor){
        oppchessColor = 2;
    }else{
        oppchessColor = 1;
    }
    //计算上下，先模拟放chessColor颜色的棋（即现在持旗方），计算权重weight，再模拟放oppchessColor颜色的棋，计算权重oppweight，用weight+oppweight即为该点的权重值
    var weightY = 0;
    var countY = 1;
    var oppweightY = 0;
    var oppcountY = 1;
    for(var i = y - 4; i <= y; i++){
        if(i < 0||i + 4 > 14){
            continue;
        }else{
            for(var j = i; j<= i+4; j++){
                if(oppchessColor == chessState[x][j]){
                    countY = 0;
                    break;
                }else if(chessColor == chessState[x][j]){
                    countY++;
                }
            }
            switch(countY){
                case 0:
                    weightY += 0;
                    break;
                case 1:
                    weightY += 1;
                    break;
                case 2:
                    weightY += 20;
                    break;
                case 3:
                    weightY += 601;
                    break;
                case 4:
                    weightY += 4001;
                    break;
                case 5:
                    weightY += 1000001;
                    break;
            }
            countY = 1;
        }
    }
    for(var i = y - 4; i <= y; i++){
        if(i < 0||i + 4 > 14){
            continue;
        }else{
            for(var j = i; j<= i+4; j++){
                if(chessColor == chessState[x][j]){
                    oppcountY = 0;
                    break;
                }else if(oppchessColor == chessState[x][j]){
                    oppcountY++;
                }
            }
            switch(oppcountY){
                case 0:
                    oppweightY += 0;
                    break;
                case 1:
                    oppweightY += 1;
                    break;
                case 2:
                    oppweightY += 20;
                    break;
                case 3:
                    oppweightY += 600;
                    break;
                case 4:
                    oppweightY += 4000;
                    break;
                case 5:
                    oppweightY += 1000000;
                    break;
            }
            oppcountY = 1;
        }
    }
    //计算左右
    var weightX = 0;
    var countX = 1;
    var oppweightX = 0;
    var oppcountX = 1;
    for(var i = x - 4; i <= x; i++){
        if(i < 0||i + 4 > 14){
            continue;
        }else{
            for(var j = i; j<= i+4; j++){
                if(oppchessColor == chessState[j][y]){
                    countX = 0;
                    break;
                }else if(chessColor == chessState[j][y]){
                    countX++;
                }
            }
            switch(countX){
                case 0:
                    weightX += 0;
                    break;
                case 1:
                    weightX += 1;
                    break;
                case 2:
                    weightX += 20;
                    break;
                case 3:
                    weightX += 601;
                    break;
                case 4:
                    weightX += 4001;
                    break;
                case 5:
                    weightX += 1000001;
                    break;
            }
            countX = 1;
        }
    }
    for(var i = x - 4; i <= x; i++){
        if(i < 0||i + 4 > 14){
            continue;
        }else{
            for(var j = i; j<= i+4; j++){
                if(chessColor == chessState[j][y]){
                    oppcountX = 0;
                    break;
                }else if(oppchessColor == chessState[j][y]){
                    oppcountX++;
                }
            }
            switch(oppcountX){
                case 0:
                    oppweightX += 0;
                    break;
                case 1:
                    oppweightX += 1;
                    break;
                case 2:
                    oppweightX += 20;
                    break;
                case 3:
                    oppweightX += 600;
                    break;
                case 4:
                    oppweightX += 4000;
                    break;
                case 5:
                    oppweightX += 1000000;
                    break;
            }
            oppcountX = 1;
        }
    }
    //计算左上右下
    var weightYX = 0;
    var countYX = 1;
    var oppweightYX = 0;
    var oppcountYX = 1;
    for(var i = x - 4, j = y - 4; i <= x; i++, j++){
        if(i < 0||i + 4 > 14||j < 0||j + 4 > 14){
            continue;
        }else{
            for(var m = i, n = j; m<= i+4; m++, n++){
                if(oppchessColor == chessState[m][n]){
                    countYX = 0;
                    break;
                }else if(chessColor == chessState[m][n]){
                    countYX++;
                }
            }
            switch(countYX){
                case 0:
                    weightYX += 0;
                    break;
                case 1:
                    weightYX += 1;
                    break;
                case 2:
                    weightYX += 20;
                    break;
                case 3:
                    weightYX += 601;
                    break;
                case 4:
                    weightYX += 4001;
                    break;
                case 5:
                    weightYX += 1000001;
                    break;
            }
            countYX = 1;
        }
    }
    for(var i = x - 4, j = y - 4; i <= x; i++, j++){
        if(i < 0||i + 4 > 14||j < 0||j + 4 > 14){
            continue;
        }else{
            for(var m = i, n = j; m<= i+4; m++, n++){
                if(chessColor == chessState[m][n]){
                    oppcountYX = 0;
                    break;
                }else if(oppchessColor == chessState[m][n]){
                    oppcountYX++;
                }
            }
            switch(oppcountYX){
                case 0:
                    oppweightYX += 0;
                    break;
                case 1:
                    oppweightYX += 1;
                    break;
                case 2:
                    oppweightYX += 20;
                    break;
                case 3:
                    oppweightYX += 600;
                    break;
                case 4:
                    oppweightYX += 4000;
                    break;
                case 5:
                    oppweightYX += 1000000;
                    break;
            }
            oppcountYX = 1;
        }
    }
    //计算左下右上
    var weightXY = 0;
    var countXY = 1;
    var oppweightXY = 0;
    var oppcountXY = 1;
    for(var i = x - 4, j = y + 4; i <= x; i++, j--){
        if(i < 0||i + 4 > 14||j > 14||j - 4 < 0){
            continue;
        }else{
            for(var m = i, n = j; m<= i+4; m++, n--){
                if(oppchessColor == chessState[m][n]){
                    countXY = 0;
                    break;
                }else if(chessColor == chessState[m][n]){
                    countXY++;
                }
            }
            switch(countXY){
                case 0:
                    weightXY += 0;
                    break;
                case 1:
                    weightXY += 1;
                    break;
                case 2:
                    weightXY += 20;
                    break;
                case 3:
                    weightXY += 601;
                    break;
                case 4:
                    weightXY += 4001;
                    break;
                case 5:
                    weightXY += 1000001;
                    break;
            }
            countXY = 1;
        }
    }
    for(var i = x - 4, j = y + 4; i <= x; i++, j--){
        if(i < 0||i + 4 > 14||j > 14||j - 4 < 0){
            continue;
        }else{
            for(var m = i, n = j; m<= i+4; m++, n--){
                if(chessColor == chessState[m][n]){
                    oppcountXY = 0;
                    break;
                }else if(oppchessColor == chessState[m][n]){
                    oppcountXY++;
                }
            }
            switch(oppcountXY){
                case 0:
                    oppweightXY += 0;
                    break;
                case 1:
                    oppweightXY += 1;
                    break;
                case 2:
                    oppweightXY += 20;
                    break;
                case 3:
                    oppweightXY += 600;
                    break;
                case 4:
                    oppweightXY += 4000;
                    break;
                case 5:
                    oppweightXY += 1000000;
                    break;
            }
            oppcountXY = 1;
        }
    }
    return weightY+weightX+weightYX+weightXY+oppweightY+oppweightX+oppweightYX+oppweightXY;
    // return weightY+weightX+weightYX+weightXY;

}


$(window).load(function(){
    $("#spinner").delay(500).fadeOut(800);
    $("#container").delay(1000).fadeIn(400);
    $('#refresh').click(function(event) {
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                chessData[x][y] = 0;
            }
        }
        isWhite = false;//设置是否该轮到白棋
        isWell = false;//设置该局棋盘是否赢了，如果赢了就不能再走了
        isHumanFirstStep = true;//人第一步必须下棋到天元处
        isAIFirstStep = true;//电脑第一步下棋到黑棋四周随机一个地方
        for (var x = 0; x < 15; x++) {
            chessData[x] = new Array(15);
            for (var y = 0; y < 15; y++) {
                chessData[x][y] = 0;
            }
        }
        for (var x = 0; x < 15; x++) {
            score[x] = new Array(15);
            for (var y = 0; y < 15; y++) {
                score[x][y] = 0;
            }
        }
        for (var x = 0; x < 5; x++) {
            group_score[x] = new Array(5);
            for (var y = 0; y < 5; y++) {
                group_score[x][y] = 0;
            }
        }
        context.clearRect(0,0,640,640);//清除画布内容
        drawRect();//画布重绘
    });
});
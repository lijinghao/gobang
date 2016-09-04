var canvas;
var context;
var isWhite = false;//设置是否该轮到白棋
var isWell = false;//设置该局棋盘是否已经结束
var img_b = new Image();
img_b.src = "./img/black.png";//白棋图片
var img_w = new Image();
img_w.src = "./img/white.png";//黑棋图片

var chessData = new Array(15);//这个为棋盘的二维数组用来保存棋盘信息，初始化0为没有走过的，1为白棋走的，2为黑棋走的
for (var x = 0; x < 15; x++) {
    chessData[x] = new Array(15);
    for (var y = 0; y < 15; y++) {
        chessData[x][y] = 0;
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
        isWhite = false;
        drawChess(1, x, y);
    }
    else {
        isWhite = true;
        drawChess(2, x, y);
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

$(window).load(function(){
    $("#spinner").delay(500).fadeOut(300);
    $("#container").delay(1000).fadeIn(300);
    $('#refresh').click(function(event) {
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                chessData[x][y] = 0;
            }
        }
        isWhite = false;//设置是否该轮到白棋
        isWell = false;//设置该局棋盘是否赢了，如果赢了就不能再走了
        context.clearRect(0,0,640,640);//清除画布内容
        drawRect();//画布重绘
    });
});
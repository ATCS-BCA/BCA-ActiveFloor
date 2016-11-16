
function initMenu(){
    var text, parser, xmlDoc;

    var reader = new FileReader();
    loadDoc();
    // readTextFile("file:///C:/ActiveFloorDeploy/Content/BCA-ActiveFloor/Release.blast");

    // var text, praser, xmlDoc
    var gameArr = ["Pong","Snake","Dodgeball", "Slide Puzzle", "Memory", "Tetris", "TicTacToe"];
    ctx.fillStyle = 'black';
    ctx.font = '24px Courier';
    ctx.strokeStyle = 'black';
    var maxItemsPerPage = 5;
    var menuItemHeight = 38;


    for(var i = 0; i / menuItemHeight < maxItemsPerPage; i += menuItemHeight){
        console.log(i);
        ctx.fillText(gameArr[i / menuItemHeight], ((canvasWidth / 2) - (ctx.measureText(gameArr[i / menuItemHeight]).width / 2)), i);
    }

}

    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         alert(this.responseText);
    //     }
    // };
    // xhttp.open("GET", "C:xampp/htdocs/Release.blast", true);
    // xhttp.send();
    // var rawFile = new XMLHttpRequest();
    // rawFile.open("GET", "localhost/release.blast", false);
    // rawFile.onreadystatechange = function ()
    // {
    //     if(rawFile.readyState === 4)
    //     {
    //         if(rawFile.status === 200 || rawFile.status == 0)
    //         {
    //             var allText = rawFile.responseText;
    //             alert(allText);
    //         }
    //     }
    // }
    // rawFile.send(null);
    function loadXMLDoc() {
      var xhr = new XMLHttpRequest();
        xhr.open("GET", "localhost/release.blast     ", true);
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log(xhr.responseText);
            } else {
              console.error(xhr.statusText);
            }
          }
        };
        xhr.onerror = function (e) {
          console.error(xhr.statusText);
        };
        xhr.send(null);
    }

// function readTextFile()
// {
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 alert(allText);
//             }
//         }
//     }
//     rawFile.send(null);
// }
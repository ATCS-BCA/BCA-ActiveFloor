/**
 * Created by Cassandra on 7/26/2016.
 */
function endScreen() {
    context2D.fillStyle = 'white';
    context2D.font = '16px sans-serif';
    context2D.fillText("Game Over",(canvas.width/2 - (context2D.measureText('Game Over').width / 2)), canvas.height/2),
        75;
}
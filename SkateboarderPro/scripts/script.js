const Scene = require('Scene');
const Patches = require('Patches');
export const Diagnostics = require('Diagnostics');
const Time = require('Time');

var jumping = false;

var playerTransform;
var obstacleTransform;

Promise.all([Scene.root.findFirst('Player')]).then(function (results) {
    const player = results[0];
    playerTransform = player.transform;
})

Promise.all([Scene.root.findFirst('Obstacle')]).then(function (results) {
    const obstacle = results[0];
    obstacleTransform = obstacle.transform;
})

Time.setInterval(jumpingUpdate, 50);

var score = Patches.getScalarValue("score");

Patches.getScalarValue("score").monitor().subscribe(() => {
    Scene.root.find("Points").text = score.toString();
});

function jumpingUpdate() {
    if (playerTransform.y.pinLastValue() != 0) {
        jumping = true;
    }
    else {
        jumping = false;
    }

    Patches.inputs.setBoolean("jumping", jumping);
    Patches.inputs.setBoolean("collided", collisionCheck());
}

function collisionCheck() {
    var collided = false;

    //The skateboarder is jumping, pulling off some sick crazy tubular moves
    if (playerTransform.y.pinLastValue() < 0.010) {
        var a = playerTransform.x.pinLastValue() - obstacleTransform.x.pinLastValue();
        var b = playerTransform.z.pinLastValue() - obstacleTransform.z.pinLastValue();

        var c = Math.sqrt(a * a + b * b);
        if (c < 0.15) collided = true;
    }

    return collided;
}
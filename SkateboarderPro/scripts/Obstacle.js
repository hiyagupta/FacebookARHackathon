const Scene = require('Scene');
const Time = require('Time');
const Patches = require('Patches');
const DeviceMotion = require('DeviceMotion');
export const Diagnostics = require('Diagnostics');

//In milliseconds
const calculationSpeed = 50;

//These are so the checks run over time
const intervalTimer = Time.setInterval(obstacleUpdate, calculationSpeed);
const playerTimer = Time.setInterval(playerUpdate, calculationSpeed);

var playerMinClamp = -0.20;
var playerMaxClamp = 0.20;
var obstacleSpeed = 0.005;
var previousValue = -0.15;
var minX = -.1;
var maxX = .1;

var dead = false;

function obstacleUpdate() {
    if (dead == false) {
        Promise.all([Scene.root.findFirst('Obstacle'),]).then(function (results) {
            const obstacle = results[0];
            previousValue += obstacleSpeed;

            if (previousValue > 0.15) {
                obstacle.transform.x = GetRandomFloat(minX, maxX);
                previousValue = -0.15;
            }

            obstacle.transform.y = 0;
            obstacle.transform.z = previousValue;
            Patches.inputs.setPoint("obstaclePosition", obstacle.transform.position);
        })
    }
}

function playerUpdate() {
    //What the player does when it's not dead
    if (dead == false) {
        Promise.all([Scene.root.findFirst('Player')]).then(function (results) {
            const player = results[0];
            const playerTransform = player.transform;
            const deviceWorldTransform = DeviceMotion.worldTransform;

            //Best way to modify the ScalarSignal is via their methods because it's not treated like a number
            playerTransform.x = deviceWorldTransform.rotationZ.clamp(playerMinClamp, playerMaxClamp).neg().div(2);
            Patches.inputs.setPoint("playerPosition", player.transform.position);
        })
    }

    //If alive check for player
    Patches.outputs.getBoolean("dead").then(function (results) {
        dead = results.pinLastValue();
    })
}

function GetRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
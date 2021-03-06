/*
Pie graph
Histrogram
Line graph
Bar graph
Gauge Chart
*/

const canvas = document.getElementsByTagName("canvas")[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const ctx = canvas.getContext('2d');

const urlParamsString = window.location.toString().substring(window.location.toString().indexOf("?"));
const urlParams = new URLSearchParams(urlParamsString);
const dataJson = decodeURI(urlParams.get("data"));

let Colors = ["#C04040", "#008000", "#00C080", "#800080", "#4000FF"];
let NextColor = 0;
function PickNextColor() {
    let selected = Colors[NextColor];
    NextColor++;

    if (NextColor >= Colors.length) {
        NextColor = 0;
    }

    return selected;
}

let Data = [
    new GraphData("red", 100),
    new GraphData("green", 100),
    new GraphData("blue", 100),
    new GraphData("aaaaaaaaaaaa", 100),
    new GraphData("red", 100),
    new GraphData("red", 100)
];
console.log(JSON.stringify(Data));

Data = JSON.parse(dataJson);

function GraphData(name, value, color) {
    this.name = name;
    this.value = value;
    this.color = color;
}

const GraphTypes = {
    "Pie": 0,
    "Line": 1,
    "Bar": 2,
    "Histrogram": 3,
    "Gauge": 4
}
Object.freeze(GraphTypes);

function reDraw(chartType, data, selected = -1) {
    const width = canvas.width;
    const height = canvas.height;
    const center = [canvas.width/2, canvas.height/2];

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "transparent";
    ctx.fillRect(0,0, canvas.width,canvas.height);

    if (chartType == GraphTypes.Pie) {
        let totalValue = 0;
        for(let i = 0; i < data.length; i++) {
            totalValue += data[i].value;
        }
        
        let oldAngle = 0;

        let startAndEnds = [];

        for(let i = 0; i < data.length; i++) {
            if (data[i].color == null) {
                data[i].color = PickNextColor();
            }

            const part = data[i].value/totalValue;

            let radius = (Math.min(width, height) / 3);

            if (i == selected) {
                radius *= 1.1;
            }

            const newAngle = oldAngle + part*2*Math.PI;

            ctx.beginPath();
            ctx.moveTo(center[0], center[1]);
            ctx.arc(center[0], center[1], radius, oldAngle, newAngle, false);
            ctx.fillStyle = data[i].color;
            ctx.strokeStyle = '#333333';
            ctx.fill();

            let centerAngle = (oldAngle + newAngle)/2;
            let centerX = center[0] + Math.cos(centerAngle) * radius * 1.2;
            let centerY = center[1] +Math.sin(centerAngle) * radius * 1.2;
            ctx.font = (radius/10) + "px Arial";
            ctx.fillStyle = "#ebebeb";
            ctx.fillText(data[i].name, centerX, centerY); 

            startAndEnds.push(oldAngle);

            oldAngle = newAngle;
        }

        onMouseMove = function(e) {
            const width = canvas.width;
            const height = canvas.height;
            const center = [canvas.width/2, canvas.height/2];

            const radius = (Math.min(width, height) / 3);

            let x = e.layerX;
            let y = e.layerY;

            x -= center[0];
            y -= center[1];

            let angle = Math.atan2(y,x);
            while(angle<0) { angle += 2*Math.PI; }
            let lenght = Math.sqrt(x*x+y*y);
            if (lenght < radius) {
                let selected = -1;
                for(let i = 0; i < startAndEnds.length; i++) {
                    let min = startAndEnds[i];

                    if (angle > min)
                    {
                        selected = i;
                    }

                }

                reDraw(chartType, data, selected);
            }
            else 
            {
                reDraw(chartType, data);
            }
        };
        
    }

}


var onMouseMove = function(e) {};

reDraw(GraphTypes.Pie, Data);

canvas.addEventListener("mousemove", function(e) {
    onMouseMove(e);
});

window.addEventListener('resize', function() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    reDraw(GraphTypes.Pie, Data);
});
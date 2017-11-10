/**
* knmi.js
* Lotte Geeraedts
* Data Processing
* Studentnummer: 10529748
*
* This function is used in data.html to plot a graph
* from the data input in data.html.
**/


// loading the values and split them into an array
var data = document.getElementById("rawdata").value;
var split_data = data.replace(/\n/g, ",").split(",");

var length = split_data.length;

// initializing arrays
var datum = [];
var temp = [];

// put the data correct in the datum array
for (var i = 0; i < length; i += 2)
{
    // remove spaces
    dat = split_data[i].replace(/\s/g,'');

    // make correct format for input to convert into date
    year = dat[0] + dat[1] + dat[2] + dat[3];
    month = dat[4] + dat[5];
    day = dat[6] + dat[7];
    date = month + " " + day + " " + year;

    // convert into date
    var correct_date = new Date(date);

    // add date to array
    datum.push(correct_date);
}

// put temperatures into temp array
for (var i = 1; i < length; i += 2)
{
    // remove spaces and put in temp array
    var correct_temp = split_data[i].replace(/\s/g,'');
    temp.push(correct_temp);
}

// drawing the canvas
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
canvas.width = 425;
canvas.height = 300;

// setting bounds for createTransform function
D_day = [0,365];
R_day = [50,425];
D_temp = [300,-100];
R_temp = [50,250];

// creating functions with createTransform
var a_day = createTransform(D_day, R_day);
var a_temp = createTransform(D_temp, R_temp);

// drawing the axes
ctx.beginPath();
ctx.moveTo(50,50);
ctx.lineTo(50,250);
ctx.lineTo(425,250);
ctx.stroke();

// drawing scale on axes
// y
var amount_y = 200/9;

for (var i = 0; i < 10; i++)
{
    ctx.beginPath();
    ctx.moveTo(50, 50 + amount_y * i);
    ctx.lineTo(53, 50 + amount_y * i);
    ctx.stroke();
}

// x
var amount_x = 365/12;

for (var i = 0; i < 13; i++)
{
    ctx.beginPath();
    ctx.moveTo(50 + amount_x * i, 250);
    ctx.lineTo(50 + amount_x * i, 247);
    ctx.stroke();
}

// drawing the graph
ctx.beginPath();
ctx.moveTo(50, a_temp(temp[0]));
for (var i = 1; i < length; i++)
{
    ctx.lineTo(i + 50, a_temp(temp[i]));
}
ctx.stroke();

// drawing 0-line
ctx.beginPath();
ctx.moveTo(50, 183);
ctx.lineTo(425, 183);
ctx.stroke();

// Title
ctx.font = '20px serif';
ctx.fillText('Gemiddelde temperatuur 2016', 51, 40);

// numbers on scale
ctx.font = '10px sanserif';

for (var i = 0; i < 9; i++)
{
    ctx.fillText((30 - (i * 5)), 32, (55 + amount_y * i));
}

// temperature title
ctx.font = '13px sanserif';
ctx.save();
var tx = 90
var ty = 90
ctx.translate(tx, ty);
ctx.rotate(Math.PI / -2);
ctx.translate(-tx, -ty);
ctx.fillText('Temperatuur (Celsius)', -40, 20);
ctx.restore();

// months on scale
months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];
ctx.font = '10px sanserif'

for (var i = 0; i < 12; i++)
{
    ctx.fillText(months[i], 50 + amount_x * i, 265);
}

// createTransform function from data.mprog.nl
function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

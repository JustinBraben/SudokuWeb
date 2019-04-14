svgNS = "http://www.w3.org/2000/svg";

let GridNumbers=[];

//set width and height of the board
    const wholeBoard = document.createElementNS(svgNS, "svg");
    wholeBoard.setAttribute("width", "450");
    wholeBoard.setAttribute("height", "450");

window.onload = function(e) {
    
    CreateBoard();
    NumbersOnBoard();
    HighlightBoard();
    GenerateNumbers();
    
    //GridNumbers.forEach((e) => {
    //    console.log(e);
    //}) ;
};

function GenerateNumbers(){
    GridNumbers = [];
    
    while(GridNumbers.length < 9)
    {
        currLine = [];
        while(currLine.length < 9)
        {
            num = Math.floor(Math.random() * 9 + 1);
            if(!currLine.includes(num))
                continue;
            currLine.push(num);
        }
        
        //more checks here
        GridNumbers.push(currLine);
    }
}; 

function NumbersOnBoard(){
    for(let col = 0; col < 9; col++)
    {
        for(let row = 1; row < 10; row++)
        {
            let newText = document.createElementNS(svgNS, "text");
            newText.setAttributeNS(null, "x", (col * 50 + 19) .toString(10));
            newText.setAttributeNS(null, "y", (row * 50 - 17).toString(10));
            newText.setAttributeNS(null, "font-size", "25");
            newText.setAttributeNS(null, "fore-color", "red");
            
            let text = document.createTextNode("1");
            newText.appendChild(text);
            
            wholeBoard.appendChild(newText);
        }
    }
    
    document.getElementById("board").appendChild(wholeBoard);
};

function CreateBoard(){
    
    for(let col = 0; col < 9; col++)
    {
        for(let row = 0; row < 9; row++)
        {
            //Create the tiles
            let rSquare = document.createElementNS(svgNS, "rect");
            rSquare.setAttribute("x", (col * 50) .toString(10));
            rSquare.setAttribute("y", (row * 50).toString(10));
            rSquare.setAttribute("rx", "10");
            rSquare.setAttribute("ry", "10");
            rSquare.setAttribute("fill", "transparent");
            rSquare.setAttribute("opacity", "1.0");
            rSquare.setAttribute("stroke", "black");
            rSquare.setAttribute("stroke-width", "2");
            rSquare.setAttribute("width", "50");
            rSquare.setAttribute("height", "50");
            
            wholeBoard.appendChild(rSquare);
            
            let newText = document.createElementNS(svgNS, "text");
            newText.setAttributeNS(null, "x", (col * 50) .toString(10));
            newText.setAttributeNS(null, "y", (row * 50).toString(10));
            newText.setAttributeNS(null, "font-size", "100");
            newText.setAttributeNS(null, "fore-color", "red");
            
            let text = document.createTextNode("R:" + row.toString(10) + "-C:" + col.toString(10));
            newText.appendChild(text);
            
            wholeBoard.appendChild(newText);
            
            wholeBoard.appendChild(text);
        }
    }
    
    document.getElementById("board").appendChild(wholeBoard);
};

function HighlightBoard(){
    for(let col = 0; col < 10; col++)
    {
        for(let row = 0; row < 10; row++)
        {
            //Create the tiles
            let lineRow = document.createElementNS(svgNS, "rect");
            let lineCol = document.createElementNS(svgNS, "rect");
            
            if(row  % 3 === 0){
                lineRow.setAttribute("x", (col * 50 - 2) .toString(10));
                lineRow.setAttribute("y", (row  * 50 - 2).toString(10));
                lineRow.setAttribute("rx", "1");
                lineRow.setAttribute("ry", "1");
                lineRow.setAttribute("fill", "black");
                lineRow.setAttribute("opacity", "1.0");
                lineRow.setAttribute("stroke", "black");
                lineRow.setAttribute("stroke-width", "3");
                lineRow.setAttribute("width", "50");
                lineRow.setAttribute("height", "3");
                wholeBoard.appendChild(lineRow);
            }
            
            if(col % 3 === 0){
                lineCol.setAttribute("x", (col * 50 - 2).toString(10));
                lineCol.setAttribute("y", (row * 50 - 2).toString(10));
                lineCol.setAttribute("rx", "1");
                lineCol.setAttribute("ry", "1");
                lineCol.setAttribute("fill", "black");
                lineCol.setAttribute("opacity", "1.0");
                lineCol.setAttribute("stroke", "black");
                lineCol.setAttribute("stroke-width", "3");
                lineCol.setAttribute("width", "3");
                lineCol.setAttribute("height", "50");
                wholeBoard.appendChild(lineCol);
            }
        }
    }
    
    document.getElementById("board").appendChild(wholeBoard);
};

var Tile = {
    correctNum: 0,
    selectedNum: null,
    completed : function(){
        return this.CorrectNum === this.SelectedNum;
    }
};
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuote = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');

const quotes = [
    {
        text:"I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
        category:"Attitude"
    },
    {
        text:"Maybe one day music will just be music, and there won't be these categories; it'll just be different shades of music.",
        category:"Life"
    },
    {
        text:"Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind.",
        category:"Motivational"
    },
    {
        text:"You know you're in love when you can't fall asleep because reality is finally better than your dreams",
        category:"love"
    }
];

newQuote.addEventListener("click",showRandomQuote);

function showRandomQuote(){
    const randomQuotes = Math.floor((Math.random())*quotes.length);
    quoteDisplay.innerHTML = `${quotes[randomQuotes].text}<br><br><strong>${quotes[randomQuotes].category}</strong>`;

    const createAddQuoteForm = document.createElement('form');
    createAddQuoteForm.innerHTML = `
    <div>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button type="button" onclick="addQuote()">Add Quote</button>
    </div>
    `;
    quoteDisplay.appendChild(createAddQuoteForm);
}

function addQuote(event){

    event.preventDefault();

    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    const newQuoteValue= { 
        text:newQuoteText,
        category:newQuoteCategory
    };

    if(newQuoteText !== "" && newQuoteCategory !== ""){
        quotes.push(newQuoteValue);
    }
    else{
        alert("Enter a quote & category");
    }

    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
}


 
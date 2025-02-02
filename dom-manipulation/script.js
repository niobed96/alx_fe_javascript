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
};

// let quotes = []; // This line is removed to avoid redeclaration

function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

function initializeQuotes() {
    if (isLocalStorageAvailable()) {
        try {
            const storedQuotes = localStorage.getItem('quotes');
            quotes = storedQuotes ? JSON.parse(storedQuotes) : [
                { text: "Be the change you wish to see in the world.", category: "Inspiration" },
                { text: "The only way to do great work is to love what you do.", category: "Work" }
            ];
        } catch (error) {
            console.error('Error loading quotes from localStorage:', error);
            quotes = [];
        }
    } else {
        console.warn('localStorage is not available. Using default quotes.');
        quote = [];
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initializeQuotes(); 
    createAddQuoteForm(); // This line is removed as the function is not defined
    showRandomQuote();
    
    // Event listeners
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportBtn').addEventListener('click', exportToJson);
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
});

function saveQuotes() {
    if (isLocalStorageAvailable()) {
        try {
            localStorage.setItem('quotes', JSON.stringify(quotes));
            sessionStorage.setItem('lastUpdated', new Date().toISOString());
        } catch (error) {
            console.error('Error saving quotes to localStorage:', error);
        }
    }
}

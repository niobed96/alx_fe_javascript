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

// Filtering system
function filterQuotes() {
    const selectedCategory = elements.categoryFilter.value;
    localStorage.setItem('lastCategory', selectedCategory);
    showRandomQuote();
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            quotes = [...quotes, ...importedQuotes];
            saveQuotes();
            populateCategories();
            showRandomQuote();
            showNotification('Quotes imported successfully!');
        } catch (error) {
            showNotification('Invalid JSON file');
        }
    };
    
    reader.readAsText(file);
}
// Enhanced showRandomQuote with filtering
function showRandomQuote() {
    const filteredQuotes = elements.categoryFilter.value === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === elements.categoryFilter.value);
    
    if(filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        elements.quoteDisplay.innerHTML = `
            <div class="quote">
                <p>"${filteredQuotes[randomIndex].text}"</p>
                <em>– ${filteredQuotes[randomIndex].category}</em>
            </div>
        `;
    }
}
function populateCategories() {
    // Uses map to process categories
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    // Map used again to create options
    categories.map(category => {
        const option = document.createElement('option');
        option.value = category;
        elements.categoryFilter.appendChild(option);
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeQuotes();
    populateCategories();
    showRandomQuote();
    
    // Event listeners
    elements.categoryFilter.addEventListener('change', filterQuotes);
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
});


async function fetchQuotesFromServer() {
    try {
        // Simulated server interaction
        const response = await fetch('https://jsonplaceholder.typicode.com/posts',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quotes: quotes,
                timestamp: new Date().toISOString()
            })
        });
        serverData = await response.json();
        
        // Convert server data to quote format
        const serverQuotes = serverData.map(post => ({
            text: post.title,
            category: 'Server'
        }));

        // Conflict resolution
        const conflicts = findConflicts(quotes, serverQuotes);
        if (conflicts.length > 0) {
            showNotification(`${conflicts.length} conflicts detected. Using server version.`);
            quotes = mergeQuotes(quotes, serverQuotes);
            saveQuotes();
            showRandomQuote();
        }
    } catch (error) {
        showNotification('Error syncing with server');
    }
}

function findConflicts(local, remote) {
    return local.filter(lq => 
        remote.some(rq => rq.text === lq.text && rq.category !== lq.category)
    );
}

function mergeQuotes(local, remote) {
    // Simple conflict resolution: server wins
    const localCopy = local.filter(lq => 
        !remote.some(rq => rq.text === lq.text)
    );
    return [...localCopy, ...remote];
}

// Helper functions
function initializeQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    quotes = storedQuotes ? JSON.parse(storedQuotes) : [
        { text: "Be the change", category: "Inspiration" },
        { text: "Great work requires love", category: "Work" }
    ];
    elements.categoryFilter.value = localStorage.getItem('lastCategory') || 'all';
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    sessionStorage.setItem('lastUpdated', new Date().toISOString());
}

function showRandomQuote() {
    const filtered = elements.categoryFilter.value === 'all' 
        ? quotes 
        : quotes.filter(q => q.category === elements.categoryFilter.value);
    
    if (filtered.length > 0) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        elements.quoteDisplay.innerHTML = `
            <div class="quote">
                <p>"${filtered[randomIndex].text}"</p>
                <em>– ${filtered[randomIndex].category}</em>
            </div>
        `;
    }
}

function setupEventListeners() {
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportBtn').addEventListener('click', exportToJson);
    document.getElementById('importFile').addEventListener('change', importFromJsonFile);
    elements.categoryFilter.addEventListener('change', filterQuotes);
}

function startServerSync() {
    syncInterval = setInterval(syncWithServer, 30000); // Sync every 30 seconds
}

// Notification system
function showNotification(message, duration = 3000) {
    elements.notification.textContent = message;
    setTimeout(() => elements.notification.textContent = '', duration);
}

// JSON handling
function exportToJson() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                quotes = mergeQuotes(quotes, imported);
                saveQuotes();
                populateCategories();
                showRandomQuote();
                showNotification('Quotes imported successfully!');
            } catch (error) {
                showNotification('Invalid JSON format');
            }
        };
        reader.readAsText(file);
    }
};
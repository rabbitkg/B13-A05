// console.log("main connection is ready to parfrom")

let allIssues = [];


document.getElementById("tab-all")
.addEventListener("click", function(){
    setActiveTab(this);
    filterIssues("all");
});

document.getElementById("tab-open")
.addEventListener("click", function(){
    setActiveTab(this);
    filterIssues("open");
});

document.getElementById("tab-closed")
.addEventListener("click", function(){
    setActiveTab(this);
    filterIssues("closed");
});

const setActiveTab = (activeBtn) => {
    const buttons = document.querySelectorAll(".tab-btn");

    buttons.forEach(btn => {
        btn.classList.remove("bg-[#4A00FF]","text-white");
        btn.classList.add("btn-outline");
    });

    activeBtn.classList.remove("btn-outline");
    activeBtn.classList.add("bg-[#4A00FF]","text-white");
};



// function showResult(data){
//     const resultDiv = document.getElementById("result");
//     resultDiv.innerHTML = "";

//     data.data.forEach(issue => {
//         const p = document.createElement("p");
//         p.innerText = issue.title;

//         resultDiv.appendChild(p);
//     });
// };


const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");

    if(status === true){
        spinner.classList.remove("hidden");
    }
    else{
        spinner.classList.add("hidden");
    }
};

const loadIssueDetails = (id) => {
    manageSpinner(true);
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

    fetch(url)
    .then(res => res.json())
    .then(data => {
        const issue = data.data;
        displayIssueModal(issue);
    })
    .finally(() => {
        manageSpinner(false);
    });
};

const displayIssueModal = (issue) => {
    document.getElementById("modal-title").innerText = issue.title;
    document.getElementById("modal-description").innerText = issue.description;
    document.getElementById("modal-status").innerText = issue.status;
    document.getElementById("modal-category").innerText = issue.category;
    document.getElementById("modal-author").innerText = issue.author;
    document.getElementById("modal-priority").innerText = issue.priority;
    document.getElementById("modal-label").innerText = issue.label;
    document.getElementById("modal-data").innerText = issue.createdAt;
    document.getElementById("issue_modal").showModal();
    
}





const loadIssues = () => {
    manageSpinner(true);

    setTimeout(() => {

        fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            allIssues = data.data;
            displayIssues(allIssues);
        })
        .finally(() => {
            manageSpinner(false);
        });

    },200);
};

const displayIssues = (issues) => {
    const container = document.getElementById("issues-container");

    container.innerHTML = "";

    document.getElementById("issue-count").innerText = issues.length;
    
    issues.forEach(issue => {
        let borderColor = "border-green-600";

        if(issue.status === "closed"){
            borderColor = "border-purple-600";
        }

        const card = document.createElement("div");

        card.innerHTML = `

            <div onclick="loadIssueDetails(${issue.id})"
            class="bg-white p-4 rounded-lg shadow border-t-4 ${borderColor} cursor-pointer hover:shadow-md transition">
                <div>

                </div>
                <h2 class="font-semibold mb-2">
                ${issue.title}
                </h2>

                <p class="text-sm text-gray-500 mb-3">
                ${issue.description.slice(0,60)}...
                </p>

                <div class="flex gap-2 mb-3">

                    <span class="badge badge-outline">
                    ${issue.category}
                    </span>

                    <span class="badge badge-warning">
                    ${issue.label}
                    </span>

                </div>

                <p class="text-xs text-gray-400">
                #${issue.id} by ${issue.author}
                </p>

            </div>

            `;
        container.append(card);
    })
};

const filterIssues = (status) => {
manageSpinner(true);
    document.getElementById("issues-container").innerHTML = "";

    setTimeout(() => {

        if(status === "all"){
            displayIssues(allIssues);
        }
        else{
            const filtered = allIssues.filter(issue => issue.status === status);
            displayIssues(filtered);
        }

        manageSpinner(false);

    }, 200);
};



loadIssues();


document.getElementById("btn-search").addEventListener("click", function () {

    const input = document.getElementById("input-search");
    const searchValue = input.value.trim();

    if(searchValue === ""){
        displayIssues(allIssues);
        return;
    };

    manageSpinner(true);
    document.getElementById("issues-container").innerHTML = "";

    setTimeout(() => {

        const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`;

        fetch(url)
        .then(res => res.json())
        .then(data => {
            displayIssues(data.data);
        })
        .finally(() => {
            manageSpinner(false);
        });

    }, 200);

});
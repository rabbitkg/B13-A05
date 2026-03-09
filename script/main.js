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

   

    const assignee =
    issue.author.charAt(0).toUpperCase() + issue.author.slice(1);


    let priorityStyle = "bg-red-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center";

    if(issue.priority === "medium"){
        priorityStyle = "bg-yellow-300 text-black px-3 py-1 rounded-full text-xs font-semibold";
    }
    else if(issue.priority === "low"){
        priorityStyle = "bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold";
    }

    let statusStyle = "bg-green-600 text-white";

    if(issue.status === "closed"){
        statusStyle = "bg-[#A855F7] text-white";
    };

    const labels = issue.labels || [];

    const labelsHTML = labels.map(label => {
        let color = "bg-red-200 text-red-600";

        if(label.toLowerCase() === "help wanted"){
            color = "bg-yellow-200 text-yellow-700";
        }
        else if(label.toLowerCase() === "enhancement"){
            color = "bg-green-200 text-green-700";
        }

        return `<span class="badge ${color}">${label.toUpperCase()}</span>`;
    }).join("");

    document.querySelector(".modal-box").innerHTML = `
        <h3 class="text-xl font-bold mb-2">${issue.title}</h3>

        <div class="flex items-center gap-2 font-bold text-sm mb-3">
            <span class="badge ${statusStyle}">
                ${issue.status.toUpperCase()}
            </span>
            <span>Opened by <b>${issue.author}</b></span>
            <span class="text-gray-400">${issue.createdAt}</span>
        </div>

        <div class="flex gap-2 mb-4 flex-wrap font-bold">
            ${labelsHTML}
        </div>

        <p class="text-gray-600 mb-6">
            ${issue.description}
        </p>

        <div class="bg-gray-100 p-4 gap-[37%] rounded-lg flex text-sm">
            <div>
                <p class="text-gray-500">Assignee</p>
                <p class="font-semibold">${assignee}</p>
            </div>

            <div>
                <p class="text-gray-500">Priority</p>
                <span class="${priorityStyle}">${issue.priority.toUpperCase()}</span>
            </div>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-primary">Close</button>
            </form>
        </div>
    `;

    document.getElementById("issue_modal").showModal();
};

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

        let statusIcon = "./assets/Open-Status.png";

        let priorityStyle = "bg-red-100 text-red-600";

       

        if(issue.priority === "medium"){
            priorityStyle = "bg-yellow-100 text-yellow-700";
        }
        else if(issue.priority === "low"){
            priorityStyle = "bg-gray-200 text-gray-600";
        }

        if(issue.status === "closed"){
            statusIcon = "./assets/Closed-Status.png";
        }

        if(issue.status === "closed"){
            borderColor = "border-purple-600";
        }

        let priorityColor = "badge-error";
        if(issue.priority === "medium") {
            priorityColor = "badge-warning";
        }

        else if(issue.priority === "low"){
            priorityColor = "badge-ghost";
        }


        let labels = (issue.labels || []).filter(l => l.toLowerCase());


        let labelsHTML = labels.map(label => {

        let labelLower = label.toLowerCase();
        let labelColor = "bg-red-200 font-bold text-red-500";

        if(labelLower === "help wanted"){
            labelColor = "bg-yellow-200 font-bold text-yellow-600";
        }
        else if(labelLower === "enhancement"){

            labelColor = "bg-green-200 font-bold text-green-500";

        }

        return `
            <span class="badge ${labelColor}">
                ${label.toUpperCase()}
            </span>
        `;

    }).join("");

   
       

        const card = document.createElement("div");

        card.innerHTML = `

            <div onclick="loadIssueDetails(${issue.id})"
            class="bg-white p-4 rounded-lg shadow border-t-4 ${borderColor} cursor-pointer  shadow-lg hover:shadow-xl transition h-full flex flex-col justify-between">

                <div class="flex justify-between items-center mb-2">

                    <div class="flex items-center gap-2">
                        <img src="${statusIcon}" class="w-6 h-6">
                    </div>

                    <span class="${priorityStyle} px-3 py-1 text-xs font-semibold rounded-full text-center">
                        ${issue.priority.toUpperCase()}
                    </span>

                </div>

                <h2 class="font-semibold text-md mb-2">
                ${issue.title}
                </h2>

                <p class="text-sm text-gray-500 mb-3 line-clamp-3">
                ${issue.description?.slice(0,70)}...
                </p>

                <div class="flex flex-wrap gap-2 mb-3">

                   ${labelsHTML}

                </div>

                

                <div class="flex flex-col gap-1 text-xs text-gray-400 border-t border-t-gray-200 pt-2">

                    <span>
                    #${issue.id} by ${issue.author}
                    </span>

                    <span>
                    ${issue.createdAt}
                    </span>

                </div>

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
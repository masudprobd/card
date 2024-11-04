const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".popup-box"),
    popupTitle = popupBox.querySelector("header p"),
    closeIcon = popupBox.querySelector("header i"),
    cardNumberTag = popupBox.querySelector("#cardNumber"),
    userNameTag = popupBox.querySelector("#userName"),
    phoneNumberTag = popupBox.querySelector("#phoneNumber"),
    form = document.querySelector("#cardForm");

let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Card";
    form.querySelector("button").innerText = "Save Card";
    popupBox.classList.add("show");
    document.body.style.overflow = "hidden";
    if(window.innerWidth > 660) cardNumberTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    form.reset();
    popupBox.classList.remove("show");
    document.body.style.overflow = "auto";
});



showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, cardNumber, userName, phoneNumber) {
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    cardNumberTag.value = cardNumber;
    userNameTag.value = userName;
    phoneNumberTag.value = phoneNumber;
    popupTitle.innerText = "Update Card";
    form.querySelector("button").innerText = "Update Card";
}

form.addEventListener("submit", (e) => {
    e.preventDefault(); // সাবমিট ইভেন্ট বন্ধ রাখার জন্য
    let cardNumber = cardNumberTag.value.trim(),
        userName = userNameTag.value.trim(),
        phoneNumber = phoneNumberTag.value.trim();

    let noteInfo = { cardNumber, userName, phoneNumber, date: new Date().toLocaleDateString() };
    if(!isUpdate) {
        notes.push(noteInfo); // নতুন নোট যুক্ত করা হচ্ছে
    } else {
        notes[updateId] = noteInfo; // আপডেট করা হচ্ছে
        isUpdate = false;
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
    closeIcon.click();
});
  
function showNotes() {
    document.querySelectorAll(".note").forEach(li => li.remove());
    notes.forEach((note, id) => {
        let liTag = `
            <li class="note">

                 <div class="bottom-content">                 
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="menu">

                            <li onclick="copyToClipboard('${note.cardNumber}')">
                            <i class="uil uil-copy alt"></i> Copy Card Number  </li>

                            <li onclick="updateNote(${id}, '${note.cardNumber}', '${note.userName}', '${note.phoneNumber}')">
                            <i class="uil uil-pen"></i>Edit</li>

                            <li onclick="deleteNote(${id})">
                            <i class="uil uil-trash"></i>Delete</li>

                             

                       
                                </ul>
                    </div> My Save Cards </div>
               <br/>

                
                <div class="details">
                    <p> ${note.userName}</p>
                    <p> ${note.cardNumber}</p> 
                    <p> ${note.phoneNumber}</p>
                </div>
                <div class="card-body">    
                    <form action="https://rapidpass.com.bd/bn/index.php/welcome/searchRegistraionInfo" method="post" target="_blank">
                        <input type="text" name="search" class="form-control" value="${note.cardNumber}" placeholder="আপনার কার্ড নম্বরটি প্রদান করুন" required style="width: 100%;">
                        <button type="submit" class="btn btn-success" style="width: 100%; margin-top: 2px;"> ব্যালেন্স </button>
                    </form>  
                </div>
                
                <div class="bottom-content">
                    <span>(এটি অফলাইন কার্ড বিধায় লাইভ ব্যালেন্স দেখা সম্ভব নয়, পূর্ববর্তী দিনের ব্যালেন্স প্রদর্শিত হবে) </span>
                </div>


                
            </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}


// কপি করার ফাংশন
function copyToClipboard(cardNumber) {
    navigator.clipboard.writeText(cardNumber).then(() => {
        alert("কার্ড নম্বর কপি করা হয়েছে: " + cardNumber);
    }).catch(err => {
        console.error("কপি করতে সমস্যা হয়েছে:", err);
    });
}  
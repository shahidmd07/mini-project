let btn = document.querySelector("button");
let ul = document.querySelector("ul");
let inp = document.querySelector("input");

btn.addEventListener("click", function() {
    // Create list item
    let item = document.createElement("li");

    // Create checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("complete");

    // Create task text
    let taskText = document.createElement("span");
    taskText.innerText = inp.value;

    // Create delete button
    let dltBtn = document.createElement("button");
    dltBtn.innerText = "delete";
    dltBtn.classList.add("delete");

    // Add everything inside li
    item.appendChild(checkbox);
    item.appendChild(taskText);
    item.appendChild(dltBtn);

    // Add li inside ul
    ul.appendChild(item);

    // Clear input
    inp.value = "";

});

ul.addEventListener("click", function(event) {
    // Checkbox clicked
    if (event.target.classList.contains("complete")) {

        let listItem = event.target.parentElement;

        listItem.classList.toggle("completed");
    }

    // Delete button clicked
    if (event.target.classList.contains("delete")) {

        let listItem = event.target.parentElement;

        listItem.remove();
    }

});





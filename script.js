document.addEventListener('DOMContentLoaded', () => {


    const formContainer = document.querySelector('.container');
    const mainForm = document.querySelector('.form');
    const btnAddMain = document.querySelector('.add__btn--btn');
    const btnCancel = document.querySelector('.form__button--cancel');
    const btnSubmit = document.getElementById("add--worker");
    const unassignedContainer = document.getElementById("workers");
    const cardInfoContainer = document.getElementById("cardinfo");


    const rolesPermissions = {
        "Réception": ["Réceptionnistes", "Manager"],
        "Salle des serveurs": ["Techniciens IT", "Manager"],
        "Salle de sécurité": ["Agents de sécurité", "Manager"],
        "Salle d’archives": ["Manager", "Réceptionnistes", "Techniciens IT", "Agents de sécurité", "Autre"],
    };

    const restrictedForCleaning = ["Salle d’archives"];


    function isAuthorized(role, roomName) {

        if (role === "Manager") return true;


        if (role === "Nettoyage" && restrictedForCleaning.includes(roomName)) {
            return false;
        }
        if (role === "Nettoyage") return true;


        if (rolesPermissions[roomName]) {
            return rolesPermissions[roomName].includes(role);
        }


        return true;
    }


    function hasSpace(roomElement) {
        const limit = parseInt(roomElement.getAttribute('data-limit'));
        const currentCount = roomElement.querySelectorAll('.emp').length;
        return currentCount < limit;
    }

    function updateZoneStatus() {
        const spaces = document.querySelectorAll('.space');
        const exempted = ["Salle de conférence", "Salle du personnel"];

        spaces.forEach(space => {
            const roomName = space.getAttribute('data-name');
            const count = space.querySelectorAll('.emp').length;


            if (count === 0 && !exempted.includes(roomName)) {
                space.classList.add('alert-empty');
            } else {
                space.classList.remove('alert-empty');
            }
        });
    }


    btnAddMain.addEventListener("click", () => {
        formContainer.style.display = 'block';
    });

    btnCancel.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.style.display = 'none';
    });

    btnSubmit.addEventListener("click", (event) => {
        event.preventDefault();


        const fname = document.getElementById('fname').value;
        const role = document.getElementById('plan').value;
        const targetRoomName = document.getElementById('initial-room').value;
        let link = document.getElementById('link').value || "https://via.placeholder.com/50";
        const email = document.getElementById('email').value;
        const fnumber = document.getElementById('fnumber').value;
        const localisation = document.getElementById('localisation').value;

        if (!fname || !role) {
            alert("Veuillez remplir le nom et le rôle.");
            return;
        }


        const newWorker = createWorkerElement(fname, role, link, email, fnumber, localisation);


        if (targetRoomName === "Unassigned") {
            unassignedContainer.appendChild(newWorker);
        } else {

            const spaces = document.querySelectorAll('.space');
            let targetZone = null;
            let targetZoneElement = null;

            spaces.forEach(space => {
                if (space.getAttribute('data-name') === targetRoomName) {
                    targetZone = space.querySelector('.zone--work');
                    targetZoneElement = space;
                }
            });

            if (targetZone) {

                if (!isAuthorized(role, targetRoomName)) {
                    alert(`Interdit ! Un ${role} ne peut pas aller à : ${targetRoomName}. Placé dans "Non assisté".`);
                    unassignedContainer.appendChild(newWorker);
                } else if (!hasSpace(targetZoneElement)) {
                    alert(`Zone pleine ! Placé dans "Non assisté".`);
                    unassignedContainer.appendChild(newWorker);
                } else {
                    targetZone.appendChild(newWorker);
                }
            }
        }


        mainForm.reset();
        formContainer.style.display = 'none';
        updateZoneStatus();
    });


    function createWorkerElement(name, role, imgLink, email, phone, loc) {
        let div = document.createElement("div");
        div.className = "emp";

        div.dataset.role = role;
        div.dataset.name = name;
        div.dataset.email = email;
        div.dataset.phone = phone;
        div.dataset.loc = loc;
        div.dataset.img = imgLink;


        div.innerHTML = `
            <div class="left">
                <img class="image" src="${imgLink}" alt="photo">
                <div>
                    <h3>${name}</h3>

                </div>
            </div>
            <div class="btns">
                <button class="btn btn--unassign" title="Désassigner (retour Unassigned)">↩</button>
                <button class="btn btn--delete" title="Supprimer l'employé">X</button>
            </div>
        `;

        div.querySelector(".btn--unassign").addEventListener("click", (e) => {
            e.stopPropagation();
            unassignedContainer.appendChild(div);
            updateZoneStatus();
        });

        div.querySelector(".btn--delete").addEventListener("click", (e) => {
            e.stopPropagation();
            div.remove();
            updateZoneStatus();

            cardInfoContainer.style.display = "none";
        });

        div.querySelector(".left").addEventListener("click", () => {
            const data = div.dataset;
            openModal(data.name, data.role, data.img, data.email, data.phone, data.loc);
        });

        return div;
    }


    function openModal(name, role, img, email, phone, loc) {
        cardInfoContainer.innerHTML = `
            <section class="card show">
                <div class="card__details">
                    <img src="${img}" class="card__image">
                    <h2>${name}</h2>
                    <p class="role-badge">${role}</p>
                    <hr>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Tel:</strong> ${phone}</p>
                    <p><strong>Localisation:</strong> ${loc}</p>
                    <div class="card_btndiv">
                        <button class="card__btn">Fermer</button>
                    </div>
                </div>
            </section>
        `;
        cardInfoContainer.style.display = "flex";

        cardInfoContainer.querySelector(".card__btn").addEventListener("click", () => {
            cardInfoContainer.style.display = "none";
        });
    }


    const zoneAddButtons = document.querySelectorAll('.add--existing-btn');

    zoneAddButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parentSpace = e.target.closest('.space');
            const roomName = parentSpace.getAttribute('data-name');
            const workZone = parentSpace.querySelector('.zone--work');


            if (!hasSpace(parentSpace)) {
                alert("Cette zone est déjà pleine !");
                return;
            }


            const unassignedWorkers = unassignedContainer.querySelectorAll('.emp');
            let foundCandidate = false;


            for (let worker of unassignedWorkers) {
                const workerRole = worker.dataset.role;
                const workerName = worker.dataset.name;

                if (isAuthorized(workerRole, roomName)) {
                    if(confirm(`Voulez-vous déplacer ${workerName} (${workerRole}) vers ${roomName} ?`)) {
                        workZone.appendChild(worker);
                        foundCandidate = true;
                        updateZoneStatus();
                        break;
                    }
                }
            }

            if (!foundCandidate && unassignedWorkers.length > 0) {
                alert("Aucun employé disponible dans 'Non assisté' n'a les droits pour cette zone.");
            } else if (unassignedWorkers.length === 0) {
                alert("Aucun employé en attente.");
            }
        });
    });


    updateZoneStatus();
});
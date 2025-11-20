let form = document.querySelector('.container');

let btn = document.querySelector('.add__btn--btn').addEventListener("click", () => {
    form.style.display = 'block';
});

let cancel = document.querySelector('.form__button--cancel');
cancel.addEventListener("click", () => {
    form.style.display = 'none';
});

let addworker = document.getElementById("add--worker");

addworker.addEventListener("click", (event) => {

  event.preventDefault();

  let fname = document.getElementById('fname').value;
  let plan = document.getElementById('plan').value;
  let link = document.getElementById('link').value;
  let email = document.getElementById('email').value;
  let fnumber = document.getElementById('fnumber').value;
  let localisation = document.getElementById('localisation').value;

  
  let newworker = document.createElement("div");
  newworker.innerHTML = `
        <div class="emp">
            <div class="left">
                <img class="image" src="${link}" alt="photo">  
                <h3>${fname}</h3>
            </div>
            <div class="btns">
                <button class="btn btn--edit">edit</button>
                <button class="btn btn--delete">X</button>
            </div>
        </div>
  `;


  let workers = document.getElementById("workers");
  workers.appendChild(newworker);
 // try to delete the worker
  let rm__worker = document.querySelector(".btn--delete")
  rm__worker.addEventListener("click",()=>{
    newworker.remove();
  });
  
  let workinformation = document.createElement("div");
  workinformation.innerHTML = `
      <section class="card">
        <div class="card__details">
            <img src="${link}" class="card__image">

            <p><strong>Full Name:</strong> ${fname}</p>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${fnumber}</p>
            <p><strong>Localisation:</strong> ${localisation}</p>

            <div class="card_btndiv">
                <button class="card__btn">close</button>
            </div>
        </div>
      </section>
  `;

  const cardinfo = document.getElementById("cardinfo");
  cardinfo.appendChild(workinformation);

  form.style.display = 'none';


  let picture = document.querySelector(".image");
  picture.addEventListener("click", () => {
      cardinfo.style.display = "block";
  });

  
  const Close = workinformation.querySelector(".card__btn");
  Close.addEventListener("click", () => {
      cardinfo.style.display = "none";
    
  });

});




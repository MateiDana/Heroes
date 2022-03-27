const listEroi = document.querySelector(".list-group");
const getPost = document.querySelector(".get-post");
const addPost = document.querySelector(".add-post-form");
const nume= document.getElementById("name");
const surname = document.getElementById("surname");
const heroName = document.getElementById("heroName");
const superpowersId = document.getElementById("superpowersId");
const nameSuperPower = document.getElementById("nameSuperPower");
const editPost = document.querySelector(".edit-post");

class listaEroi{
    constructor(
        id,
        nume,
        surname,
        heroName,
        superpowersId,
        nameSuperPower
    ){
        this.id = id;
        this.nume = nume;
        this.surname = surname;
        this.heroName = heroName;
        this.superpowersId= superpowersId;
        this.nameSuperPower = nameSuperPower;
    }
arataDate() {
return[
    this.id,
    this.nume,
    this.surname,
    this.heroName, 
    this.superpowersId,
    this.nameSuperPower,
    ];
    }
}

const eroiArray = [];
const url = "http://localhost:3000/heroes/?_expand=superpowers";
let output = "";

// GET
getPost.addEventListener("click", function() {
    fetch(url, {method:"GET"})
    .then(function(raspuns){
        return raspuns.json();
    })
    .then(function(raspunsTipJson) {
        console.log("Rapuns tip Json:", raspunsTipJson);
        output="";
        raspunsTipJson.forEach(function(hero, index) {
        console.log(`Eroul de la indexul ${index} este ${hero.heroName}`)
        eroiArray.push(
                new listaEroi(
                hero.id,
                hero.nume,
                hero.surname,
                hero.heroName,
                hero.superpowersId,
                hero.superpowers.nameSuperPowers
            )
            );
        output +=` <li class="list-group-item"><em>ID:</em>${hero.id}</li>
        <li class="list-group-item"><em>Nume: </em>${hero.nume}</li>
        <li class="list-group-item"><em>Prenume: </em>${hero.surname}</li>
        <li class="list-group-item"><em>Numele de erou: </em>${hero.heroName}</li>
        <li class="list-group-item"><em>Id superputere: </em>${hero.superpowersId}</li>
        <li class="list-group-item"><em>Super putere: </em>${hero.superpowers.nameSuperPower}</li>
        <div>
        <button class="btn btn-secondary edit-post" id="hero-id-${hero.id} "data-bs-toggle="modal" data-bs-target="#editHeroModal">Edit ${hero.heroName}</button>
        <button class="btn btn-secondary delete-post" id ="hero-id-${hero.id}">Delete</button>
        </div></br>`;

        listEroi.innerHTML = output;
        });
        
        //edit
        const editAllButtons = document.querySelectorAll(".edit-post");
        console.log(editAllButtons);
        editAllButtons.forEach(function(buton){
            buton.addEventListener("click", triggerEditFlow);
        });
        console.log(eroiArray);

        // delete
        const deleteAllButtons = document.querySelectorAll(".delete-post");
        console.log(deleteAllButtons);
        deleteAllButtons.forEach(function(btn){
            btn.addEventListener("click", deleteFlow);   
        })
        
    });;
});

//EDIT
function triggerEditFlow(event) {
    const id = Number(event.target.id.split("-").at(-1));
    const selectedHero = eroiArray.find((hero) => hero.id ===id);
    const modalBody = document.getElementById("generateForm");
    modalBody.innerHTML= generateForm(selectedHero);
    const saveButton = document.getElementById("saveEditedHero");
    saveButton.addEventListener("click", function() {
        submitHeroChanges(id);
    });
console.log(selectedHero);
}

function submitHeroChanges(id) {
    const form = document.querySelector("#generateForm form");
    console.dir(form);
    const nume = form[0].value;
    const surname = form[1].value;
    const heroName = form[2].value;
    const patchURL =`http://localhost:3000/heroes/${id}`
    console.log({nume, surname, heroName});
    fetch(patchURL,{
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nume: nume,
            surname: surname,
            heroName: heroName,
         }),
    });
}
function generateForm(hero) {
    return`
    <form class="add-post-form" >
    <div class="mb-3">
      <label class="form-label"
        ><strong>Editing...</strong></label
      >
    </div>
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        id="nume"
        placeholder="Introduceti numele"
        value="${hero.nume}"
        required
      />
    </div>
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        id="prenume"
        placeholder="Introduceti prenumele"
        value="${hero.surname}"
        required
      />
    </div>
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        id="numeErou"
        placeholder="Introduceti numele super eroului"
        value="${hero.heroName}"
        required
      />
    </div>
  </form>
`;
}
// POST
addPost.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submited");
    console.log(nume.value);
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nume: nume.value,
        surname: surname.value,
        heroName: heroName.value,
        superpowersId: Number(superpowersId.value),
      }),
    })
      .then(function (raspuns) {
        console.log(raspuns.json());
        return raspuns.json();
      })
      .catch(function (err) {
        console.log("Catch me if you ...,", err);
      });
  });

  //DELETE
function deleteFlow(e) {
    const idDelete = Number(e.target.id.split("-").at(-1));
    const selectedHeroDelete= eroiArray.find((hero) => hero.id ===idDelete);
    console.log("eroul selectat este:",selectedHeroDelete);
    console.log(e.target.parentElement.dataset.id);
    const deleteURL =`http://localhost:3000/heroes/${idDelete}`
    if (selectedHeroDelete) {
        fetch(deleteURL,{
        method: "DELETE",})
        .then(function(raspuns){
            return raspuns.json();
            })
        .then(function(raspunsTipJson) {
            // location.reload();
        console.log("remove post");
    })
}
}

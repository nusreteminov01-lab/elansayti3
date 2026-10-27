const API = "https://elan-api-lgwm.onrender.com/api/items/A12";

let elanElaveET = document.querySelector("#elanElaveET");
let elanElaveEtme = document.querySelector("#elanElaveEtme");
let elaveet = document.querySelector("#elaveet");
let elanlar = document.querySelector("#elanlar");

function elanlariGoster() {
    elanlar.innerHTML = "";

    fetch(`${API}?limit=100`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Elanları yükləmək mümkün olmadı!");
            }
            return res.json();
        })
        .then(ad => {
            ad.data.forEach(x => {
                let kart = document.createElement("div");
                kart.dataset.id = x.id;

                kart.innerHTML = `
                    <img src="${x.image}" alt="${x.title}">
                    <h3>${x.title}</h3>
                    <p>${x.desc}</p>
                    <h4>${x.price} AZN</h4>
                    <p>Kateqoriya: ${x.cat}</p>
                    <p>Ölkə: ${x.made}</p>
                    <button class="sil">Sil</button>
                `;

                let silDuyme = kart.querySelector(".sil");
                
                silDuyme.addEventListener("click", () => {
                    fetch(`https://elan-api-lgwm.onrender.com/api/items/${x.id}/A12`, {
                        method: "DELETE"
                    })
                        .then(async res => {
                            let cavab = await res.text();

                            if (!res.ok) {
                                console.error("Status:", res.status);
                                console.error("API cavabı:", cavab);
                                throw new Error("Elan API-dən silinmədi.");
                            }

                            kart.remove();
                        })
                        .catch(err => {
                            console.error(err);
                            alert("Elanı silmək mümkün olmadı. Console bölməsini yoxla.");
                        });
                });

                elanlar.appendChild(kart);
            });
        })
        .catch(err => console.error(err));
}


elanlariGoster();


elanElaveET.addEventListener("click", () => {
    elanElaveET.style.display = "none";
    elanElaveEtme.style.display = "flex";
    elanlar.style.display = "none";
});


elaveet.addEventListener("click", () => {
    let ad = document.querySelector("#newName").value;
    let tesvir = document.querySelector("#newDesc").value;
    let sekil = document.querySelector("#newImage").value;
    let qiymet = document.querySelector("#newPrice").value;
    let kateqoriya = document.querySelector("#category").value;
    let olke = document.querySelector("#country").value;

    fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: ad,
            desc: tesvir,
            image: sekil,
            price: qiymet,
            cat: kateqoriya,
            made: olke
        })
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Elan əlavə olunmadı!");
            }
            return res.json();
        })
        .then(data => {
            console.log(data);

            elanElaveEtme.style.display = "none";
            elanElaveET.style.display = "block";
            elanlar.style.display = "flex";

            elanlariGoster();
        })
        .catch(err => {
            console.error(err);
            alert("Elan əlavə edilərkən xəta baş verdi.");
        });
});

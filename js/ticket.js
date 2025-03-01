document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section.container");
    const buttons = document.querySelectorAll(".option-button, #button-addon2");

    // 🔹 Oculta todas las secciones excepto page1
    sections.forEach(section => {
        if (section.id !== "page1") {
            section.style.display = "none";
        }
    });

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");

            if (targetId) {
                // 🔹 Oculta todas las secciones
                sections.forEach(section => {
                    section.style.display = "none";
                });

                // 🔹 Muestra solo la sección destino
                const targetPage = document.getElementById(targetId);
                if (targetPage) {
                    targetPage.style.display = "block";
                }
            }
        });
    });
});


function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year}  ${hours}:${minutes}`;
    document.getElementById("datetime").innerText = formattedDate;
}
setInterval(updateDateTime, 1000);
updateDateTime();

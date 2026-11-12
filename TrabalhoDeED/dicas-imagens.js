document.querySelectorAll(".dicas-imagem img").forEach((imagem) => {
    imagem.addEventListener("error", () => {
        const figura = imagem.closest(".dicas-imagem");
        if (!figura || figura.querySelector(".dicas-imagem-status")) return;

        figura.classList.add("dicas-imagem-indisponivel");
        const aviso = document.createElement("span");
        aviso.className = "dicas-imagem-status";
        aviso.setAttribute("role", "status");
        aviso.textContent = `Imagem temporariamente indisponível: ${imagem.alt}`;
        figura.insertBefore(aviso, imagem.nextSibling);
    });
});

<section id="transacciones" class="">
    <h2>Buscar</h2>
    <input type="text" name="buscar" class="buscar" placeholder="Buscar transacción ..." />

    <div class="container" id="transactions-container">

    </div>
    <div id="spinner" class="spinner">
        <svg id="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">
            <title>spinner</title>
            <g id="Logo-2" data-name="Logo">
                <path id="petalo1"
                    d="M819.06,394.94c28.45-77.81-22.8-168-114.46-201.56s-189,2.41-217.47,80.22c-10.84,29.65-10.1,61.09,0,90.52.37,1.29,9,31.29,15,47.51a554.13,554.13,0,0,0,36.59,79.46l35.64,58.63.33.37,65.05-21.82A555.44,555.44,0,0,0,719,491.15l41.69-27C787.37,448.16,808.22,424.6,819.06,394.94Z"
                    fill="#052238" />
                <path id="petalo2"
                    d="M310.46,423c-81.61,14.27-134.14,103.77-117.33,199.91s96.6,162.5,178.21,148.22c31.09-5.43,58-21.8,78.38-45.28.93-1,22.6-23.44,33.66-36.71a555,555,0,0,0,50.52-71.42l33-60.19L567,557l-51.42-45.43a555.74,555.74,0,0,0-71.76-50L399.58,439C372.39,423.79,341.56,417.51,310.46,423Z"
                    fill="#052238" />
                <path id="petalo3"
                    d="M588.23,851c53.16,63.54,156.94,64.28,231.78,1.65s92.43-164.9,39.27-228.44C839,600,811.42,584.94,780.87,579c-1.3-.33-31.6-7.86-48.62-10.81a554.86,554.86,0,0,0-87.11-8l-68.6,1.55-.48.09q-6.82,33.63-13.63,67.25A554.65,554.65,0,0,0,555,716.22l2.56,49.62C558,797,568,826.81,588.23,851Z"
                    fill="#052238" />
                <path id="Rayo" d="M344,553.17,643.58,295c13.06-8.36,25.5,0,17.53,14.34l-95.61,188H736s27.09,0,0,22.31L441.2,779.46c-20.72,17.53-35.06,8-20.72-19.13l92.43-183.26H344S316.9,577.07,344,553.17Z" fill="#7f47dd" stroke="#fff" stroke-miterlimit="10" stroke-width="30" />
            </g>
        </svg>
    </div>


</section>

<script>
function generateRandomTransactions(transactions) {
    let html = '';
    transactions.forEach(transaction => {
        const {
            typeKey,
            status,
            typeName,
            idTx,
            title,
            date,
            amount
        } = transaction;

        let actions = '';
        switch (status) {
            case "confirmed":
                if (typeKey === "payment") {
                    actions += '<div class="action-info"></div><div class="action-refund"><button>Realizar devolución</button></div>';
                } else if (typeKey === "refund") {
                    actions += '<div class="action-info"></div><div class="action-refund"></div>';
                }
                break;
            case "pending":
                if (typeKey === "payment") {
                    actions += '<div class="action-info"></div><div class="action-refund disabled"><button disabled>Realizar devolución</button></div>';
                } else if (typeKey === "refund") {
                    actions += '<div class="action-info"></div><div class="action-refund"></div>';
                }
                break;
            case "expired":
                actions += '<div class="action-info"></div><div class="action-refund"></div>';
                break;
            default:
                break;
        }

        html += `
				<div class="item ${typeKey} ${status}">
					<div class="item-container">
						<div class="item-status"></div>
						<div class="item-info">
							<h3>${typeName} <span>${idTx}</span></h3>
							<span class="item-memo">${title}</span>
							<span class="item-date">${new Date(date * 1000).toLocaleDateString()}</span>
						</div>
						<div class="item-amount">${amount} €</div>
					</div>
					<div class="item-actions">
						${actions}
					</div>
				</div>
			`;
    });
    return html;
}

function llamada(url) {
    const spinner = document.getElementById('spinner');
    const container = document.getElementById('transactions-container');

    container.style.transition = 'none';
    container.style.opacity = 0;

    // Mostrar el spinner
    spinner.style.display = 'block';

    // Llamada AJAX para obtener los datos desde PHP
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const newContent = generateRandomTransactions(data);

            // Esperar el tiempo restante antes de actualizar el contenido y ocultar el spinner
            setTimeout(() => {
                // Ocultar el spinner
                spinner.style.display = 'none';

                // Actualizar el contenido del contenedor con fade-in
                container.style.opacity = 0;
                container.innerHTML = newContent;
                container.style.transition = 'opacity 1s';
                container.style.opacity = 1;

                // Añadir eventos a los nuevos elementos del DOM
                addEventListeners();

                // Compruebo el tamaño del nuevo main actualizado y decido si activar scroll o no
                mainScrollable();
            }, 2000);
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

function addEventListeners() {
    const items = document.querySelectorAll('#transactions-container .item .item-container');
    const main = document.querySelector('main'); // Suponiendo que 'main' es el contenedor principal
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    items.forEach(item => {
        item.addEventListener('click', () => {
            // Restablecer cualquier elemento que haya sido expandido previamente
            items.forEach(i => {
                const actions = i.parentElement.querySelector('.item-actions');
                if (i.parentElement !== item.parentElement && actions.classList.contains('expanded')) {
                    actions.style.transition = 'height 0.2s ease-in-out, opacity 0.1s ease-in-out'; // Transición para contraer
                    actions.style.height = '0';
                    actions.style.opacity = '0';
                    actions.classList.remove('expanded');
                    i.parentElement.classList.remove("active");
                }
            });

            // Alternar la clase 'expanded' en el elemento clicado
            const actions = item.parentElement.querySelector('.item-actions');
            if (actions.classList.contains('expanded')) {
                actions.style.transition = 'height 0.2s ease-in-out, opacity 0.1s ease-in-out'; // Transición para contraer
                actions.style.height = '0';
                actions.style.opacity = '0';
                actions.classList.remove('expanded');
                item.parentElement.classList.remove("active");
                item.parentElement.style.transition = "box-shadow 0.3s";
            } else {

                // Calcular la altura del contenido
                actions.style.height = 'auto'; // Temporalmente establecer a auto para obtener el tamaño
                const height = actions.scrollHeight + 'px'; // Obtener la altura del contenido
                actions.style.height = '0'; // Restablecer a 0 para la transición
                actions.style.opacity = '0';

                // Usar requestAnimationFrame para aplicar la transición correctamente
                requestAnimationFrame(() => {
                    actions.style.transition = 'height 0.2s ease-in-out, opacity 0.2s ease-in-out 0.1s'; // Transición para expandir
                    actions.classList.add('expanded');
                    item.parentElement.classList.add("active");
                    actions.style.height = height; // Aplicar la altura calculada
                    actions.style.opacity = '1';
                    item.parentElement.style.transition = "box-shadow 0.3s";
                });
            }

            // Obtener la posición del elemento clicado en relación con la ventana y el contenedor <main>
            const itemRect = item.parentElement.getBoundingClientRect();
            const mainRect = main.getBoundingClientRect();
            const headerBottom = header.getBoundingClientRect().bottom;
            const footerTop = footer.getBoundingClientRect().top;

            // Calcular la altura adicional del contenido expandido
            const expandedHeight = actions.scrollHeight;

            if (itemRect.top < headerBottom + 8 && !item.parentElement.classList.contains('active')) {
                // Si el elemento está por encima del límite superior calculado
                const scrollAmount = main.scrollTop + itemRect.top - (headerBottom + 8);
                main.scrollTo({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
            } else if (itemRect.bottom > footerTop - 8 && !item.parentElement.classList.contains('active')) {
                // Calcular la cantidad de desplazamiento
                const scrollAmount = main.scrollTop + itemRect.bottom - footerTop + expandedHeight + 8;
                main.scrollTo({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
            } else if (itemRect.bottom > footerTop - expandedHeight && !item.parentElement.classList.contains('active')) {
                // Calcular la cantidad de desplazamiento
                const scrollAmount = main.scrollTop + itemRect.bottom - footerTop + expandedHeight + 8;
                main.scrollTo({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
            }
            // Si el elemento se encuentra dentro de la zona delimitada, compenso el scroll
            // Próxima implementación de otros casos...

        });
    });

    // Eliminar el desenfoque al usar el campo de búsqueda
    document.querySelector('.buscar').addEventListener('input', () => {
        items.forEach(i => {
            i.parentElement.classList.remove('blurred', 'active');
            const actions = i.parentElement.querySelector('.item-actions');
            actions.style.transition = 'height 0.2s ease-in-out, opacity 0.1s ease-in-out'; // Transición para contraer
            actions.style.height = '0';
            actions.style.opacity = '0';
            actions.classList.remove('expanded'); // Contraer todas las acciones
        });
    });

    document.querySelector('.buscar').addEventListener('touchstart', () => {
        items.forEach(i => {
            i.parentElement.classList.remove('blurred', 'active');
            const actions = i.parentElement.querySelector('.item-actions');
            actions.style.transition = 'height 0.2s ease-in-out, opacity 0.1s ease-in-out'; // Transición para contraer
            actions.style.height = '0';
            actions.style.opacity = '0';
            actions.classList.remove('expanded'); // Contraer todas las acciones
        });
    });
}

//llamada('ajax/generateRandomTransactions.php');
</script>
document.addEventListener('DOMContentLoaded', function() {
    // --- Манипуляции с DOM ---
    const addElementBtn = document.getElementById('addElementBtn');
    const changeTextBtn = document.getElementById('changeTextBtn');
    const domOutput = document.getElementById('dom-output');
    const jsShowcaseHeading = document.querySelector('#javascript-showcase h2');

    if (addElementBtn) {
        addElementBtn.addEventListener('click', function() {
            const newParagraph = document.createElement('p');
            newParagraph.textContent = 'Это новый параграф, добавленный с помощью JavaScript! (' + new Date().toLocaleTimeString() + ')';
            newParagraph.style.backgroundColor = '#e7f3fe';
            newParagraph.style.padding = '5px';
            newParagraph.style.marginTop = '5px';
            domOutput.appendChild(newParagraph);
        });
    }

    if (changeTextBtn && jsShowcaseHeading) {
        changeTextBtn.addEventListener('click', function() {
            jsShowcaseHeading.textContent = 'Заголовок изменен JS!';
            jsShowcaseHeading.style.color = 'purple';
        });
    }

    // --- Обработка событий ---
    const hoverBox = document.getElementById('hover-box');
    const hoverStatus = document.getElementById('hover-status');

    if (hoverBox && hoverStatus) {
        hoverBox.addEventListener('mouseover', function() {
            hoverBox.style.backgroundColor = 'coral';
            hoverStatus.textContent = 'Статус: Мышь над элементом!';
        });

        hoverBox.addEventListener('mouseout', function() {
            hoverBox.style.backgroundColor = 'lightblue';
            hoverStatus.textContent = 'Статус: Мышь покинула элемент.';
        });
    }

    // Простой аккордеон
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Сначала закроем все открытые панели аккордеона (если нужно поведение "только одна открыта")
            // Если нужно, чтобы каждая открывалась/закрывалась независимо, закомментируйте этот блок:
            /*
            accordionButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.classList.remove('active');
                    const otherContent = otherButton.nextElementSibling;
                    otherContent.style.display = 'none';
                }
            });
            */

            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });
    
    // --- Эффекты на JavaScript ---
    const toggleVisibilityBtn = document.getElementById('toggleVisibilityBtn');
    const toggleElement = document.getElementById('toggle-element');

    if (toggleVisibilityBtn && toggleElement) {
        toggleVisibilityBtn.addEventListener('click', function() {
            if (toggleElement.style.display === 'none') {
                // Плавное появление (простой вариант)
                toggleElement.style.opacity = '0';
                toggleElement.style.display = 'block';
                let opacity = 0;
                const fadeInInterval = setInterval(function() {
                    if (opacity < 1) {
                        opacity += 0.1;
                        toggleElement.style.opacity = opacity;
                    } else {
                        clearInterval(fadeInInterval);
                    }
                }, 50); // Скорость появления
            } else {
                // Плавное исчезание (простой вариант)
                let opacity = 1;
                const fadeOutInterval = setInterval(function() {
                    if (opacity > 0) {
                        opacity -= 0.1;
                        toggleElement.style.opacity = opacity;
                    } else {
                        toggleElement.style.display = 'none';
                        clearInterval(fadeOutInterval);
                    }
                }, 50); // Скорость исчезания
            }
        });
    }

    console.log('JavaScript для демонстрации загружен и выполнен!');
});

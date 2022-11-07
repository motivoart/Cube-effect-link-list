class Cubes {
    constructor(element, cubes) {
        // Find all necessary elements
        this.element = element;
        this.wrapper = cubes;
        window.direction = "";
        window.oldX = 0;
        window.oldY = 0;
        this.gridX = 3;
        this.gridY = 3;

        // Init functionalities if all elements has been found
        if (this.element) {
            const elementWidth = this.element.offsetWidth;

            const half = elementWidth / 2;
            this.element.style.transformOrigin = `0 0 ${half}px`;
            this.element.style.height = `${elementWidth}px`;

            const front = this.element.querySelector(`[data-cube="front"]`);
            const cube = this.element.querySelector(`[data-cube="cube"]`);

            // Add init style
            if (cube) {
                cube.style.transform = `translateZ(-${half}px)`;
                cube.style.transformOrigin = `center center -${half}px`;
            }
            if (front) {
                front.style.transform = `rotateY(0deg) translateZ(${half}px)`;
            }

            setTimeout(() => {
                this.init();
            }, 100);
        }

        else {
            console.error("missing elements to properly init Cubes")
        }
    }

    init() {
        const elementWidth = this.element.offsetWidth;
        const half = elementWidth / 2;

        const scenetWidth = this.wrapper.offsetWidth;
        const sceneHeight = this.wrapper.offsetHeight;
        const index = this.element.getAttribute('data-index');

        const x = this.element.getAttribute('data-index') % this.gridY;
        const y = Math.ceil(index / this.gridY) - 1;
        let col = 0;

        switch (x) {
            case 1:
                col = 0;
                break;
            case 2:
                col = 1;
                break;
            case 0:
                col = 2;
                break;
            default:
        }

        // bg image position in cube

        const bgPosX = -(scenetWidth / this.gridX * col) + "px";
        const bgPosY = -(sceneHeight / this.gridY * y) + "px";

        const elementsBg = this.element.querySelectorAll('.bg');

        elementsBg.forEach((bg) => {

            bg.style.backgroundPosition = `${bgPosX} ${bgPosY}`;
        })

        // get mouse direction when mouse move
        document.addEventListener("mousemove", this.getMouseDirection, false);

        // Add functionality to show content on hover of item
        this.element.addEventListener('mouseenter', (e) => {

            const animation = this.element.getAttribute(`data-animation`);

            if (animation === "true") {
                e.preventDefault();
                window.stopAnimation = false;

                const back = this.element.querySelector(`[data-cube="back"]`);
                const cube = this.element.querySelector(`[data-cube="cube"]`);

                const isActive = this.element.getAttribute('data-active')

                // set the style for cube depending on the direction of the mouseover
                if (!window.stopAnimation) {
                    switch (window.direction) {
                        case "right":
                            cube.style.transform = `rotateY(-90deg) translateZ(-${half}px)`;
                            cube.style.transformOrigin = `center center -${half}px`;
                            back.style.transform = `rotateY(90deg) translateZ(${half}px)`;
                            break;
                        case "left":
                            cube.style.transform = `rotateY(90deg) translateZ(-${half}px)`;
                            cube.style.transformOrigin = `center center -${half}px`;
                            back.style.transform = `rotateY(-90deg) translateZ(${half}px)`;
                            break;
                        case "up":
                            cube.style.transform = `rotateX(-90deg) translateZ(-${half}px)`;
                            cube.style.transformOrigin = `center center -${half}px`;
                            back.style.transform = `rotateX(90deg) translateZ(${half}px)`;
                            break;
                        case "down":
                            cube.style.transform = `rotateX(90deg) translateZ(-${half}px)`;
                            cube.style.transformOrigin = `center center -${half}px`;
                            back.style.transform = `rotateX(-90deg) translateZ(${half}px)`;
                            break;
                        default:
                    }

                    this.element.setAttribute('data-active', "true");
                    this.element.classList.add('active');


                }

            }

        }

        );

        this.element.addEventListener('mouseleave', (e) => {
            e.preventDefault();


            const activeElements = this.wrapper.querySelectorAll(`[data-active="true"]`);

            if (activeElements.length > 0) {
                window.stopAnimation = true;

                activeElements.forEach((element) => {
                    const cube = element.querySelector(`[data-cube="cube"]`);
                    const elementWidth = element.offsetWidth;

                    const half = elementWidth / 2;
                    cube.style.transform = `translateZ(-${half}px)`;

                    const elementBack = element.querySelector(`[data-cube="back"]`);

                    elementBack.style.top = "0";
                    elementBack.style.left = "0";
                    elementBack.style.transform = "none";

                    element.setAttribute('data-active', "false");
                    element.classList.remove('active');
                    window.stopAnimation = false;
                })
            }
        });
    }

    getMouseDirection(e) {

        if (e.pageX > window.oldX && e.pageY == window.oldY) {
            window.direction = "right";
        }

        else if (e.pageX == window.oldX && e.pageY > window.oldY) {
            window.direction = "down";
        }

        else if (e.pageX == window.oldX && e.pageY < window.oldY) {
            window.direction = "up";
        }

        else if (e.pageX < window.oldX && e.pageY == window.oldY) {
            window.direction = "left";
        }

        window.oldX = e.pageX;
        window.oldY = e.pageY;

    }
}

window.addEventListener('load', () => {
    if (window.innerWidth > 767) {
        // Get all cubes wrapper that need to use this functionality
        const cubesWrapper = document.querySelectorAll(`[data-cube="wrapper"]`);

        if (cubesWrapper.length > 0) {
            cubesWrapper.forEach(cubes => {
                // Find all cubes elements
                const cubesElements = cubes.querySelectorAll(`[data-cube="item"]`);

                if (cubesElements.length > 0) {
                    cubesElements.forEach(element => {

                        // Init functionality for every element
                        new Cubes(element, cubes);
                    }

                    )
                }
            }

            )
        }
    }
});
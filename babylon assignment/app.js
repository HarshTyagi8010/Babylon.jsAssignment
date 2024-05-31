window.addEventListener('DOMContentLoaded', function () {
    // Get the canvas element
    const canvas = document.getElementById('renderCanvas');

    // Generate the BABYLON 3D engine
    const engine = new BABYLON.Engine(canvas, true);

    // Create the scene space
    const createScene = function () {
        const scene = new BABYLON.Scene(engine);

        // Add a camera to the scene and attach it to the canvas
        const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2.5, 50, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        // Add lights to the scene
        const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);
        const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), scene);

        // Add a ground plane
        const ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 100, height: 100}, scene);

        // Add a box
        const box = BABYLON.MeshBuilder.CreateBox('box', {size: 2}, scene);
        box.position.y = 1; // Raise the box above the ground

        // Enable user interaction for moving the box
        let selectedMesh = null;

        // Mouse events
        canvas.addEventListener('pointerdown', (event) => {
            const pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult.hit && pickResult.pickedMesh === box) {
                selectedMesh = pickResult.pickedMesh;
            }
        });

        canvas.addEventListener('pointerup', () => {
            selectedMesh = null;
        });

        canvas.addEventListener('pointermove', (event) => {
            if (selectedMesh) {
                const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                if (pickResult.hit) {
                    selectedMesh.position.x = pickResult.pickedPoint.x;
                    selectedMesh.position.z = pickResult.pickedPoint.z;
                }
            }
        });

        return scene;
    };

    const scene = createScene();

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener('resize', function () {
        engine.resize();
    });
});


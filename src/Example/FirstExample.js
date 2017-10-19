import {StandardMaterial, GL, Renderer, Cube, Plane, SceneObject,
	Color, Camera, CameraOrbitController, Scene, DirectLight, AmbientLight} from '../Engine/next-gl';

class FirstExample {
	constructor(domElement) {
		this._domElement = domElement;
		this._lastDT = 0;

		this.gl = new GL({domElement: this._domElement});

		this.scene = new Scene(this.gl);
		this.dirLight = new DirectLight({intencity: 0.7, direction: [0.15, 0.8, 0.75]});
		this.ambientLight = new AmbientLight({intencity: 0.3, color: new Color()});

		this.scene.addToScene(this.dirLight);
		this.scene.addToScene(this.ambientLight);

		const aspect = this.gl.glContext.canvas.clientWidth / this.gl.glContext.canvas.clientHeight;
		this.camera = new Camera({near: 1, far: 1000, aspect});
		this.cameraOrbitController = new CameraOrbitController({
			camera: this.camera,
			opts: {
				element: this._domElement,
				target: [0, 5, 0],
				distance: 20
			}
		});

		this.renderer = new Renderer({glContext: this.gl.glContext, scene: this.scene, camera: this.camera});

		this.renderFunc = this.render.bind(this);

		this.mapMaterial = new StandardMaterial({
			map: this.gl.loadTexture('src/Example/test_texture.jpg'),
			isDoubleSided: true
		});

		this.addCubes();

		const plane = new Plane({ material: this.mapMaterial });
		plane.scale = {x: 30, y:1, z: 30};

		this.scene.addToScene(plane);

		requestAnimationFrame(this.renderFunc);
	}

	render(dt) {
		if (this.gl.checkAndResize()) {
			this.camera.aspect = this.gl.glContext.canvas.clientWidth / this.gl.glContext.canvas.clientHeight;
		}
		dt *= 0.001;
		const deltaTime = dt - this._lastDT;
		this._lastDT = dt;

		for (const [index, cube] of this.cubes.entries()) {
			cube.rotate({x: 0, y: 1, z: 0}, deltaTime);
			cube.rotate({x: 0, y: 0, z: 1}, deltaTime * 0.2 * index);
		}

		this.cameraOrbitController.update(deltaTime);

		this.renderer.drawScene();
		requestAnimationFrame(this.renderFunc);
	}

	addCubes() {
		const materialWithColor = new StandardMaterial({
			color: new Color({r: 50, g: 60, b: 10})
		});

		const cube = new Cube({ material: this.mapMaterial});
		cube.position = {x: 0, y: 5, z: -18};
		this.scene.addToScene(cube);

		const cube2 = new Cube({ material: this.mapMaterial});
		cube2.position = {x: 5, y: 5, z: -18};
		this.scene.addToScene(cube2);

		const cube3 = new Cube({ material: materialWithColor});
		cube3.position = {x: -5, y: 5, z: -18};
		this.scene.addToScene(cube3);

		const cube4 = new Cube({ material: materialWithColor});
		cube4.position = {x: -5, y: 15, z: -18};
		this.scene.addToScene(cube4);

		cube4.setParent(cube3);

		this.cubes = [cube, cube2, cube3];
	}

}
export {FirstExample};

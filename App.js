function makeMosaic(){
	const subImage_origin = document.getElementById("subImage").files[0];
	
	test(subImage_origin);
	const subImage = resizeImage(subImage_origin);
	console.log(subImage);
	const materialImage_origin = document.getElementById("materialImage").files;
	console.log(materialImage_origin);
	const materialImagesColors = resizeGetColor(materialImage_origin)[0];
	console.log(materialImagesColors);
	const materialImages = materialImagesColors[0];
	const imageColors = materialImagesColors[1];
	const completeImage = getMosaicImage(subImage,materialImages,imageColors);
}
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener('click', makeMosaic);

function resizeImage(img){
	console.log("canvas");
	let cv = document.createElement('canvas');
	cv.width = 45;
	cv.height = 30;
	let color = Array(cv.width * cv.height);
	let ct =cv.getContext('2d');
	ct.drawImage(img, 0, 0);
	const image = ct.getImageData(0, 0, cv.width, cv.height);
	for (let i = 0; i < color.length; i++){
		color[i] = (image[4*i], image[4*i+1], image[4*i+2], image[4*i+3]);
	}
	return color;
}

function resizeGetColor(img){
	let images = Array(img.length);
	let colorsCal = Array(4);
	colorsCal.fill(0);
	let colors = Array(img.length);
	let cv = document.createElement('canvas');
	cv.width = 300;
	cv.height = 200;
	let ct =cv.getContext('2d');
	for (let i = 0; i < img.length; i++){
	ct.drawImage(img[i], 0, 0);
	images[i] = ct.getImageData(0, 0, cv.width, cv.height);
	for (let j = 0; j < cv.width * cv.height; j++){
		colorsCal = colorsCal + (image[i][4*j], image[i][4*j+1], image[i][4*j+2], image[i][4*j+3]);
		/*
		colorsCal[0] = colorsCal[0] + images[i][4*j]
		colorsCal[1] = colorsCal[1] + images[i][4*j+1]
		colorsCal[2] = colorsCal[2] + images[i][4*j+2]
		colorsCal[3] = colorsCal[3] + images[i][4*j+3];
		*/
	}
	colors[i] = colorsCal / (img.length);
	}
	return (images, colors);
}

function getMosaicImage(subImage, images, colors){
	let cv = document.getElementById('cv');
	let min = 0;
	let d = Array(colors.length);
	let near = 0;
	cv.width = 300*45;
	cv.height = 200*30;
	let ct =cv.getContext('2d');
	for (let x = 0; x < 45; x++){
		for (let y = 0; y < 30; y++){
			for (let i = 0; i < colors.length; i++){
				d = dotProduct((colors[i] - subImage[i]),(colors[i] - subImage[i]));
			}
			min = Math.min(...d);
			near = d.indexOf(min);
			ct.drawImage(images[near], x * 300, y * 200);
		}
	}
}

function test(img){
    let reader = new FileReader();
    reader.readAsDataURL(img);
    
      img.src = reader.result;
    
	let cvTest = document.getElementById("cvTest");
	let ct = cvTest.getContext('2d');
	cvTest.width = 100;
	cvTest.height = 100;
	ct.drawImage(img,0,0,cvTest.width,cvTest.height);
}




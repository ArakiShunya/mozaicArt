async function makeMosaic(){
	const subImage_origin = document.getElementById('subImage').files[0];
	const subImage = await resizeImage(subImage_origin);
	const materialImage_origin = document.getElementById("materialImage").files;
	console.log("materialImage_origin:"+materialImage_origin);
	const materialImagesColors = await resizeGetColor(materialImage_origin);
	console.log("materialImageColors:"+materialImagesColors);
	const materialImages = materialImagesColors[0];
	const imageColors = materialImagesColors[1];
	const completeImage = getMosaicImage(subImage,materialImages,imageColors);
}
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener('click', makeMosaic);

async function resizeImage(img){
	const width = 45;
	const height = 30;
	const image = await dispImage(img,width,height);
	console.log(image);
	let color = Array(width*height);
	for (let i = 0; i < color.length; i++){
		color[i] = (image.data[4*i], image.data[4*i+1], image.data[4*i+2], image.data[4*i+3]);
	}
	return color;
}

async function resizeGetColor(img){
	let images = Array(img.length);
	let colorsCal = Array(4);
	colorsCal.fill(0);
	let colors = Array(img.length);
	const width = 300;
	const height = 200;
	for (let i = 0; i < img.length; i++){
	images[i] = await dispImage(img[i],width,height);
	for (let j = 0; j < width * height; j++){
		colorsCal = colorsCal + (images[i].data[4*j], images[i].data[4*j+1], images[i].data[4*j+2], images[i].data[4*j+3]);
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

async function dispImage(img,width,height){
    let cv = document.getElementById("cvTest");
    let ct = cv.getContext('2d');
    let image = new Image();
    image.src = await convert2DataUrl(img);
    cv.width = width;
    cv.height = height;
    ct.drawImage(image,0,0,cv.width,cv.height);
    let color = ct.getImageData(0, 0, width, height);
    console.log("color is "+color.data);
    return color;
}

async function convert2DataUrl(img) {
    let reader = new FileReader()
    reader.readAsDataURL(img)
    await new Promise(resolve => reader.onload = () => resolve())
    return reader.result
}



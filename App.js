async function makeMosaic(){
	const subImage_origin = document.getElementById('subImage').files[0];
	const subImage = await resizeImage(subImage_origin);
	const materialImage_origin = document.getElementById("materialImage").files;
	const materialImagesColors = await resizeGetColor(materialImage_origin);
	const materialImages = materialImagesColors[0];
	const imageColors = materialImagesColors[1];
	await getMosaicImage(subImage,materialImages,imageColors);
}
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener('click', makeMosaic);

async function resizeImage(img){
	const width = 20;
	const height = 15;
	const image = await dispImage(img,width,height);
	let color = Array(width*height);
	for (let i = 0; i < color.length; i++){
		color[i] = new Array(4);
		color[i] = [image.data[4*i], image.data[4*i+1], image.data[4*i+2], image.data[4*i+3]];
	}
	return color;
}

async function resizeGetColor(img){
	let images = Array(img.length);
	let colors = Array(img.length);
	colors.fill(0);
	const width = 300;
	const height = 200;
	for (let i = 0; i < img.length; i++){
	images[i] = await dispImage(img[i],width,height);
	colors[i] = new Array(4);
	colors[i] = await getColor(images[i].data,width,height);
	}
	return [images, colors];
}

async function getColor(image,width,height){
	let colorsCal = Array(4);
	colorsCal.fill(0)
	for (let j = 0; j < width * height; j++){
		//colorsCal = colorsCal + [image[4*j], image[4*j+1], image[4*j+2], image[4*j+3]];
		
		colorsCal[0] = colorsCal[0] + image[4*j]
		colorsCal[1] = colorsCal[1] + image[4*j+1]
		colorsCal[2] = colorsCal[2] + image[4*j+2]
		colorsCal[3] = colorsCal[3] + image[4*j+3];
		
	}
	let color =Array(4)
	color[0] = colorsCal[0]/(width*height);
	color[1] = colorsCal[1]/(width*height);
	color[2] = colorsCal[2]/(width*height);
	color[3] = colorsCal[3]/(width*height);
	return color;
}

async function getMosaicImage(subImage, images, colors){
	let cv = document.getElementById('cv');
	let min = 0;
	let near = 0;
	let dColor = Array(4);
	cv.width = 300 * 20;
	cv.height = 200 * 15;
	let ct =cv.getContext('2d');
	for (let x = 0; x < 20; x++){
		console.log("x:" + x);
		for (let y = 0; y < 15; y++){
			let d = Array(colors.length);
			let j = y + x * 15
			for (let i = 0; i < colors.length; i++){
				dColor[0] = colors[i][0] - subImage[j][0];
				dColor[1] = colors[i][1] - subImage[j][1];
				dColor[2] = colors[i][2] - subImage[j][2];
				d[i] = await dot(dColor);
			}
			console.log(d);
			min = Math.min(...d);
			near = d.indexOf(min);
			console.log(subImage[j])
			console.log(images[near].data);		
                        await ct.putImageData(images[near], x * 300, y * 200);
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
    return color;
}

async function convert2DataUrl(img) {
    let reader = new FileReader()
    reader.readAsDataURL(img)
    await new Promise(resolve => reader.onload = () => resolve())
    return reader.result;
}

async function dot(color){
	let colorR = color[0] * color[0];
	let colorG = color[1] * color[1];
	let colorB = color[2] * color[2];
	let dotColor = colorR + colorG + colorB;
	return dotColor;
}

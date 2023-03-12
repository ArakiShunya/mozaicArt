async function makeMosaic(){
	const subWidth = 100;
	const subHeight = 70;
	const mateWidth = 15;
	const mateHeight = 10;
	const subImage_origin = document.getElementById('subImage').files[0];
	const subImage = await resizeImage(subImage_origin,subWidth,subHeight);
	const materialImage = document.getElementById("materialImage").files;
	const materialImagesColors = await resizeGetColor(materialImage,mateWidth,mateHeight);
	const materialImages = materialImagesColors[0];
	const imageColors = materialImagesColors[1];
	await getMosaicImage(subImage,materialImages,imageColors,subWidth,subHeight,mateWidth,mateHeight);
}
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener('click', makeMosaic);

async function resizeImage(img,width,height){
	let cv = document.getElementById("cvTest");
	let ct = cv.getContext('2d');
	cv.width = width;
        cv.height = height;
	const image = await dispImage(img,cv,ct);
	let color = Array(width*height);
	for (let i = 0; i < color.length; i++){
		color[i] = new Array(4);
		color[i] = [image.data[4*i], image.data[4*i+1], image.data[4*i+2], image.data[4*i+3]];
	}
	return color;
}

async function resizeGetColor(img,width,height){
	let images = Array(img.length);
	let colors = Array(img.length);
	colors.fill(0);
	let cv = document.getElementById("cvTest");
	let ct = cv.getContext('2d');
	cv.width = width;
        cv.height = height;
	for (let i = 0; i < img.length; i++){
	images[i] = await dispImage(img[i],cv,ct);
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
	let sumPixel = width * height;
	color[0] = colorsCal[0]/sumPixel;
	color[1] = colorsCal[1]/sumPixel;
	color[2] = colorsCal[2]/sumPixel;
	color[3] = colorsCal[3]/sumPixel;
	return color;
}

async function getMosaicImage(subImage, images, colors, subWidth, subHeight, mateWidth, mateHeight){
	let cv = document.getElementById('cv');
	let min = 0;
	let near = 0;
	let dColor = Array(4);
	cv.width = subWidth * mateWidth;
	cv.height = subHeight * mateHeight;
	let ct =cv.getContext('2d');
	for (let x = 0; x < subWidth; x++){
		for (let y = 0; y < subHeight; y++){
			let d = Array(colors.length);
			let j = y + x * mateHeight
			for (let i = 0; i < colors.length; i++){
				dColor[0] = colors[i][0] - subImage[j][0];
				dColor[1] = colors[i][1] - subImage[j][1];
				dColor[2] = colors[i][2] - subImage[j][2];
				d[i] = await dot(dColor);
			}
			min = Math.min(...d);
			near = d.indexOf(min);
                        await ct.putImageData(images[near], x * mateWidth, y * mateHeight);
			colors.splice(near,1)near;
			console.log(colors);
		}
	}
	const png = cv.toDataURL();
	document.getElementById("png").src = png;
}

async function dispImage(img,cv,ct){
    let image = new Image();
    image.src = await convert2DataUrl(img);
    ct.drawImage(image,0,0,cv.width,cv.height);
    let color = ct.getImageData(0, 0, cv.width, cv.height);
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

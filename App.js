const subWidth = 50;
const subHeight = 35;
const mateWidth = 7;
const mateHeight = 5;
const reuse = 3;

let images = [];
let colors = [];
let subColor = [];
	
let cv = document.getElementById("cvTest");
let ct = cv.getContext('2d', {willReadFrequently:true});
cv.width = mateWidth;
cv.height = mateHeight;

async function dispImages(){
	const subImage_origin = document.getElementById('subImage').files[0];
	subColor = await resizeImage(subImage_origin,subWidth,subHeight);
	const materialImage = document.getElementById("materialImage").files;
	dispMateImage(materialImage,mateWidth,mateHeight,reuse);
}
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener('click', dispImages);

function getMosaic(){
getMosaicImageTest(subColor,images,colors,subWidth,subHeight,mateWidth,mateHeight);
}
const mosaicButton = document.getElementById("mosaicButton");
mosaicButton.addEventListener('click', getMosaic);

async function resizeImage(img,width,height){
	let cvSub = document.getElementById("cv");
	cvSub.width = width;
        cvSub.height = height;
	let ctSub = cvSub.getContext('2d');
	await dispImage(img,cvSub,ctSub);
	const image = ctSub.getImageData(0,0,cvSub.width,cvSub.height);
	let color = Array(width*height);
	for (let i = 0; i < color.length; i++){
		color[i] = new Array(3);
		color[i] = [image.data[4*i], image.data[4*i+1], image.data[4*i+2]];
	}
	return color;
}

async function dispMateImage(img,width,height,reuse){
	for (let i = 0; i < img.length; i++){
	await dispImage(img[i],cv,ct);
	}
	let colorsSet = [];
	let imagesSet = [];
	for (let i=0; i < reuse; i++){
	Array.prototype.push.apply(colorsSet, colors);
	Array.prototype.push.apply(imagesSet, images);
	}
	console.log(colors);
	return [imagesSet, colorsSet];
}

function getImage(){
	let image = ct.getImageData(0, 0, cv.width, cv.height)
	let color = getColor(image.data,width,height)
	Array.prototype.push.apply(images, image);
	Array.prototype.push.apply(colors, color);
}
cv.addEventListener('change', getImage);

function getColor(image,width,height){
	let colorsCal = [0, 0, 0];
	for (let j = 0; j < width * height; j++){
		colorsCal[0] = colorsCal[0] + image[4*j];
		colorsCal[1] = colorsCal[1] + image[4*j+1];
		colorsCal[2] = colorsCal[2] + image[4*j+2];	
	}
	let color =Array(3)
	let sumPixel = width * height;
	color[0] = colorsCal[0]/sumPixel;
	color[1] = colorsCal[1]/sumPixel;
	color[2] = colorsCal[2]/sumPixel;
	return color;
}

function getMosaicImageTest(subImage, images, colors, subWidth, subHeight, mateWidth, mateHeight){
	let cv = document.getElementById('cv');
	cv.width = 60 * mateWidth;
	cv.height = 30 * mateHeight;
	let ct = cv.getContext('2d');
	for (let x = 0; x < 60; x++){
		for (let y =0; y<30; y++){
		    ct.putImageData(images[y+x*60],x*mateWidth,y*mateHeight);
		}
	}
	const png = cv.toDataURL();
	document.getElementById("png").src = png;
}
	
function getMosaicImage(subImage, images, colors, subWidth, subHeight, mateWidth, mateHeight){
	let cv = document.getElementById('cv');
	let minD = 0;
	let near = 0;
	let dColor = Array(3);
	cv.width = subWidth * mateWidth;
	cv.height = subHeight * mateHeight;
	let ct = cv.getContext('2d');
	for (let x = 0; x < subWidth; x++){
		for (let y = 0; y < subHeight; y++){
			let d = Array(colors.length);
			let j = x + y * subWidth
			for (let i = 0; i < colors.length; i++){
				dColor[0] = colors[i][0] - subImage[j][0];
				dColor[1] = colors[i][1] - subImage[j][1];
				dColor[2] = colors[i][2] - subImage[j][2];
				d[i] = dot(dColor);
			}
			minD = Math.min(...d);
			near = d.indexOf(minD);
                        ct.putImageData(images[near], x * mateWidth, y * mateHeight);
			colors.splice(near, 1);
			images.splice(near, 1);
			//console.log(colors);
			//console.log(images);
		}
	}
	const png = cv.toDataURL();
	document.getElementById("png").src = png;
}

async function dispImage(img,cv,ct){
    let image = new Image();
    image.src = await convert2DataUrl(img);
    ct.drawImage(image,0,0,cv.width,cv.height);
}

async function convert2DataUrl(img) {
    let reader = new FileReader()
    reader.readAsDataURL(img)
    await new Promise(resolve => reader.onload = () => resolve())
    return reader.result;
}

function dot(color){
	let colorR = color[0] * color[0];
	let colorG = color[1] * color[1];
	let colorB = color[2] * color[2];
	let dotColor = colorR + colorG + colorB;
	return dotColor;
}

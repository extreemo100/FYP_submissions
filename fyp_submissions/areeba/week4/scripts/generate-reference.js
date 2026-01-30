const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');
const jpeg = require('jpeg-js');
const { createCanvas, loadImage } = require('canvas');

async function generateReferenceEmbedding() {
  console.log('🚀 Starting reference embedding generation...');
  
  try {
    // Check if art print exists
    const artPrintPath = './public/art-print.jpg';
    if (!fs.existsSync(artPrintPath)) {
      console.error('❌ Error: art-print.jpg not found in public folder!');
      console.log('📝 Please add your art print image as: public/art-print.jpg');
      process.exit(1);
    }

    console.log('📸 Loading art print image...');
    
    // Load image using canvas
    const image = await loadImage(artPrintPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    
    // Convert to tensor
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imageTensor = tf.browser.fromPixels(imageData);
    
    console.log('🤖 Loading MobileNet model...');
    const model = await mobilenet.load();
    
    console.log('🔍 Extracting features from art print...');
    const embedding = model.infer(imageTensor, true);
    const embeddingData = await embedding.data();
    
    // Save to public folder
    const outputPath = './public/reference-embedding.json';
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ 
        embedding: Array.from(embeddingData),
        generated: new Date().toISOString(),
        imageSize: {
          width: image.width,
          height: image.height
        }
      }, null, 2)
    );
    
    console.log('✅ Reference embedding generated successfully!');
    console.log('📁 Saved to: public/reference-embedding.json');
    console.log(`📊 Embedding size: ${embeddingData.length} features`);
    
    // Cleanup
    imageTensor.dispose();
    embedding.dispose();
    
  } catch (error) {
    console.error('❌ Error generating reference:', error);
    process.exit(1);
  }
}

generateReferenceEmbedding();
#!/usr/bin/env node

/**
 * SVG Optimization Script
 * 
 * Optimizes SVG files by:
 * - Removing unnecessary attributes (opacity: 1, stroke: none when fill is present)
 * - Removing Inkscape/Sodipodi metadata
 * - Removing empty defs
 * - Cleaning up whitespace
 * - Optimizing path data
 * 
 * Usage:
 *   node scripts/optimize-svg.js <input-file> [output-file]
 *   If output-file is not provided, overwrites input-file
 */

const fs = require('fs');
const path = require('path');

/**
 * Rounds numeric values in SVG path data to reduce file size
 * @param {string} pathData - The path data string (d attribute)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Optimized path data
 */
function roundPathCoordinates(pathData, decimals = 2) {
  // Match numbers (including negative and decimal numbers)
  // This regex handles: integers, decimals, negative numbers, and scientific notation
  return pathData.replace(/(-?\d+\.?\d*)/g, (match) => {
    const num = parseFloat(match);
    if (isNaN(num)) return match;
    // Round to specified decimal places
    const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    // Remove trailing zeros and decimal point if not needed
    return rounded.toString().replace(/\.?0+$/, '');
  });
}

function optimizeSVG(svgContent) {
  let optimized = svgContent;

  // Remove XML declaration and comments
  optimized = optimized.replace(/<\?xml[^>]*\?>/g, '');
  optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');

  // Remove Inkscape/Sodipodi namespaces and attributes
  optimized = optimized.replace(/\s+inkscape:[^=]*="[^"]*"/g, '');
  optimized = optimized.replace(/\s+sodipodi:[^=]*="[^"]*"/g, '');
  optimized = optimized.replace(/\s+xmlns:inkscape="[^"]*"/g, '');
  optimized = optimized.replace(/\s+xmlns:sodipodi="[^"]*"/g, '');
  optimized = optimized.replace(/<sodipodi:namedview[^>]*\/>/g, '');
  optimized = optimized.replace(/<sodipodi:namedview[^>]*>[\s\S]*?<\/sodipodi:namedview>/g, '');

  // Remove empty defs
  optimized = optimized.replace(/<defs[^>]*>\s*<\/defs>/g, '');
  optimized = optimized.replace(/<defs[^>]*\/>/g, '');

  // Remove display:none layers and hidden images
  optimized = optimized.replace(/<g[^>]*style="[^"]*display:\s*none[^"]*"[^>]*>[\s\S]*?<\/g>/g, '');
  optimized = optimized.replace(/<image[^>]*style="[^"]*display:\s*none[^"]*"[^>]*\/>/g, '');

  // Clean up style attributes - remove opacity:1, stroke:none when fill is present
  optimized = optimized.replace(
    /style="([^"]*)opacity:\s*1[;]?([^"]*)"/g,
    (match, before, after) => {
      const cleaned = (before + after).replace(/^;\s*|;\s*$/g, '').replace(/;;+/g, ';');
      return cleaned ? `style="${cleaned}"` : '';
    }
  );

  // Remove stroke:none when fill is present
  optimized = optimized.replace(
    /style="([^"]*fill:[^;]+);?\s*stroke:\s*none[;]?([^"]*)"/g,
    (match, before, after) => {
      const cleaned = (before + after).replace(/^;\s*|;\s*$/g, '').replace(/;;+/g, ';');
      return cleaned ? `style="${cleaned}"` : '';
    }
  );

  // Remove unnecessary id attributes (unless they're referenced)
  optimized = optimized.replace(/\s+id="(?:svg|layer|path|defs|image)\d+"/g, '');

  // Remove unnecessary version and xml:space attributes
  optimized = optimized.replace(/\s+version="[^"]*"/g, '');
  optimized = optimized.replace(/\s+xml:space="[^"]*"/g, '');

  // Round path coordinates to reduce file size
  optimized = optimized.replace(
    /d="([^"]*)"/g,
    (match, pathData) => {
      const rounded = roundPathCoordinates(pathData, 2);
      return `d="${rounded}"`;
    }
  );

  // Also handle path data with single quotes
  optimized = optimized.replace(
    /d='([^']*)'/g,
    (match, pathData) => {
      const rounded = roundPathCoordinates(pathData, 2);
      return `d='${rounded}'`;
    }
  );

  // Round coordinates in other numeric attributes (points, viewBox, etc.)
  optimized = optimized.replace(
    /points="([^"]*)"/g,
    (match, points) => {
      const rounded = roundPathCoordinates(points, 2);
      return `points="${rounded}"`;
    }
  );

  // Round viewBox coordinates
  optimized = optimized.replace(
    /viewBox="([^"]*)"/g,
    (match, viewBox) => {
      const rounded = roundPathCoordinates(viewBox, 2);
      return `viewBox="${rounded}"`;
    }
  );

  // Clean up whitespace
  optimized = optimized.replace(/>\s+</g, '><');
  optimized = optimized.replace(/\s+/g, ' ');
  optimized = optimized.replace(/\s+>/g, '>');
  optimized = optimized.replace(/<\s+/g, '<');

  // Format for readability (optional - can be removed for smaller files)
  optimized = optimized.replace(/></g, '>\n<');

  // Remove empty lines
  optimized = optimized.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  return optimized.trim();
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node scripts/optimize-svg.js <input-file> [output-file]');
    process.exit(1);
  }

  const inputFile = path.resolve(args[0]);
  const outputFile = args[1] ? path.resolve(args[1]) : inputFile;

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  try {
    const svgContent = fs.readFileSync(inputFile, 'utf8');
    const optimized = optimizeSVG(svgContent);
    
    fs.writeFileSync(outputFile, optimized, 'utf8');
    
    const originalSize = Buffer.byteLength(svgContent, 'utf8');
    const optimizedSize = Buffer.byteLength(optimized, 'utf8');
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    
    console.log(`✓ Optimized: ${path.basename(inputFile)}`);
    console.log(`  Original: ${originalSize} bytes`);
    console.log(`  Optimized: ${optimizedSize} bytes`);
    console.log(`  Savings: ${savings}%`);
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { optimizeSVG };


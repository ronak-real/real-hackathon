console.log('Current environment variables:');
console.log('VITE_API_URL:', process.env.VITE_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if .env file exists
const fs = require('fs');
if (fs.existsSync('.env')) {
  console.log('\n.env file contents:');
  console.log(fs.readFileSync('.env', 'utf8'));
} else {
  console.log('\n.env file not found!');
}
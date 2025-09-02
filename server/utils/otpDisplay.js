const chalk = require('chalk');

const displayOTP = (email, otpCode) => {
  const border = '═'.repeat(70);
  const spacer = ' '.repeat(20);
  
  console.log('\n' + chalk.green(border));
  console.log(chalk.green('║') + chalk.yellow.bold(spacer + '🔐 NEW USER REGISTRATION OTP' + spacer) + chalk.green('║'));
  console.log(chalk.green(border));
  console.log(chalk.green('║') + chalk.white(`  📧 Email: ${email}`) + ' '.repeat(70 - email.length - 12) + chalk.green('║'));
  console.log(chalk.green('║') + chalk.cyan.bold(`  🔑 OTP: ${otpCode}`) + ' '.repeat(70 - otpCode.length - 11) + chalk.green('║'));
  console.log(chalk.green('║') + chalk.gray(`  ⏰ Time: ${new Date().toLocaleString()}`) + ' '.repeat(70 - new Date().toLocaleString().length - 11) + chalk.green('║'));
  console.log(chalk.green('║') + chalk.red('  ⚠️  This OTP expires in 5 minutes') + ' '.repeat(70 - 35) + chalk.green('║'));
  console.log(chalk.green(border) + '\n');
};

module.exports = { displayOTP };
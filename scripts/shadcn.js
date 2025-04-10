import { exec } from "child_process";

const component = process.argv[2];
if (!component) {
  console.error(
    "Please provide a component name. Usage: yarn comp <component>"
  );
  process.exit(1);
}

exec(`npx shadcn@2.3.0 add ${component}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});

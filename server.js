const app = require ("src/app"); 
const connDB = require ("sr/c/config/db");

const port= process.env.PORT || 3000;

connDB();

app.listen(Port , () => {
    console.log(`Server is running on port ${port}`);
});
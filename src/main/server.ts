import app from "@/main/app";
import "dotenv/config"

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
});
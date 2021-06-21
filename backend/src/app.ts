import express, { Application, Request, Response } from "express";
const app: Application = express();
const port: number = 3000;
app.get("/", (req: Request, res: Response) => {
    res.send("HomePage");
});

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});

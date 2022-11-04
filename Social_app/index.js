import express from "express";
import format from "date-format";
const app = express();
const PORT = 4000;

const instaProfile = {
  username: "apurvgupta.__",
  following: "180",
  follows: 260,
  date: format("dd/MM hh:mm:ss.SSS", new Date()),
};
app.get("/api/v1/instagram", (req, res) => {
  res.status(200).json({ instaProfile });
});
const facebookProfile = {
  username: "apurvgupta",
  following: "180",
  follows: 260,
  date: format("dd/MM hh:mm:ss", new Date()),
};
app.get("/api/v1/facebook", (req, res) => {
  res.status(200).json({ facebookProfile });
});

const linkedinProfile = {
  username: "apurv-gupta2000",
  following: "180",
  follows: 260,
  date: format("dd/MM hh:mm:ss.SSS", new Date()),
};
app.get("/api/v1/linkedin", (req, res) => {
  res.status(200).json({ linkedinProfile });
});

app.get("/api/v1/:id", (req, res) => {
  const params = req.params.id;
  res.status(200).json({ param: params });
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
